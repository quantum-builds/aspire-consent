import { useState, useEffect, useCallback } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import getPathAfterUploadsImages from "@/utils/getSplittedPath";
import { VideoModal } from "@/components/VideoModal";

export interface FileType extends File {
  preview?: string;
  formattedSize?: string;
  isLoading?: boolean;
  isVideo?: boolean;
  thumbnail?: string;
  webkitRelativePath: string;
}

interface FileUploaderProps {
  onFileUpload?: (files: FileType[] | null) => void;
  showPreview?: boolean;
  maxFiles?: number;
  icon?: string;
  text?: string;
  textClass?: string;
  extraText?: string;
  defaultPreview?: string;
  defaultName?: string;
  disabled?: boolean;
  error?: string;
  allowedTypes?: string[];
  alwaysShowDropzone?: boolean;
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
  return (size / (1024 * 1024)).toFixed(2) + " MB";
};

const extractFrameFromVideo = async (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoUrl;

    video.addEventListener("loadeddata", () => {
      video.currentTime = video.duration * 0.25;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not supported"));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/png");
      resolve(thumbnail);
    });

    video.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

const useFileUploader = (
  maxFiles = 1,
  defaultPreview?: string,
  defaultName?: string,
  allowedTypes?: string[],
  onFileChange?: (files: FileType[] | null) => void
) => {
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  useEffect(() => {
    if (defaultPreview && defaultName && !isInitialized) {
      const isVideoType = allowedTypes?.some((type) =>
        type.startsWith("video")
      );

      const defaultFile: FileType = {
        name: getPathAfterUploadsImages(defaultName || "default-preview"),
        preview: defaultPreview,
        size: 0,
        type: isVideoType ? "video/mp4" : "image/jpeg",
        formattedSize: "0 B",
        lastModified: 0,
        webkitRelativePath: "",
        arrayBuffer: () => Promise.reject("Not implemented"),
        bytes: () => Promise.reject("Not implemented"),
        slice: () => new Blob(),
        stream: () => new ReadableStream(),
        text: () => Promise.reject("Not implemented"),
        isLoading: true,
        isVideo: isVideoType,
      };

      setSelectedFiles([defaultFile]);
      setIsInitialized(true);

      if (isVideoType) {
        extractFrameFromVideo(defaultPreview)
          .then((thumbnail) => {
            setSelectedFiles((prevFiles) =>
              prevFiles.map((file) => ({
                ...file,
                thumbnail,
                isLoading: false,
              }))
            );
          })
          .catch((error) => {
            console.error("Failed to extract thumbnail:", error);
            setSelectedFiles((prevFiles) =>
              prevFiles.map((file) => ({
                ...file,
                thumbnail: "/fallback-thumbnail.png",
                isLoading: false,
              }))
            );
          });
      } else {
        const img = document.createElement("img");
        img.src = defaultPreview;

        img.onload = () => {
          setSelectedFiles((prevFiles) =>
            prevFiles.map((file) => ({
              ...file,
              isLoading: false,
            }))
          );
        };

        img.onerror = () => {
          setErrorMessage("Failed to load default preview");
          setSelectedFiles((prevFiles) =>
            prevFiles.map((file) => ({
              ...file,
              isLoading: false,
            }))
          );
        };
      }
    }
  }, [defaultPreview, defaultName, allowedTypes, isInitialized]);

  const handleAcceptedFiles = useCallback(
    (acceptedFiles: File[], callback?: (files: FileType[] | null) => void) => {
      setErrorMessage(null);

      if (selectedFiles.length + acceptedFiles.length > maxFiles) {
        setErrorMessage(`You can upload a maximum of ${maxFiles} file(s).`);
        return;
      }

      // Check file size
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE_BYTES
      );
      if (oversizedFiles.length > 0) {
        setErrorMessage(
          `File size too large. Maximum allowed size is ${formatFileSize(
            MAX_FILE_SIZE_BYTES
          )}`
        );
        return;
      }

      if (allowedTypes) {
        const invalidFiles = acceptedFiles.filter(
          (file) => !allowedTypes.includes(file.type)
        );
        if (invalidFiles.length > 0) {
          setErrorMessage(
            "Invalid file type. Allowed types: " + allowedTypes.join(", ")
          );
          return;
        }
      }

      const formattedFiles = acceptedFiles.map((file) => {
        const formattedFile = file as FileType;
        formattedFile.formattedSize = formatFileSize(file.size);
        formattedFile.isVideo = file.type.startsWith("video");
        formattedFile.preview = URL.createObjectURL(file);

        if (formattedFile.isVideo) {
          extractFrameFromVideo(formattedFile.preview)
            .then((thumbnail) => {
              formattedFile.thumbnail = thumbnail;
              setSelectedFiles((prevFiles) => [...prevFiles]);
            })
            .catch((error) => {
              console.error("Failed to extract thumbnail:", error);
              formattedFile.thumbnail = "/fallback-thumbnail.png";
              setSelectedFiles((prevFiles) => [...prevFiles]);
            });
        }
        return formattedFile;
      });

      // Combine existing files with new files
      const updatedFiles = [...selectedFiles, ...formattedFiles];
      setSelectedFiles(updatedFiles);
      onFileChange?.(updatedFiles.length > 0 ? updatedFiles : null);
      callback?.(updatedFiles.length > 0 ? updatedFiles : null);
    },
    [maxFiles, allowedTypes, onFileChange, MAX_FILE_SIZE_BYTES, selectedFiles]
  );

  const removeFile = useCallback(
    (file: FileType) => {
      const newFiles = selectedFiles.filter((f) => f.name !== file.name);
      setSelectedFiles(newFiles);

      if (file.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(file.preview);
      }

      onFileChange?.(newFiles.length > 0 ? newFiles : null);
    },
    [selectedFiles, onFileChange]
  );

  return {
    selectedFiles,
    handleAcceptedFiles,
    removeFile,
    errorMessage,
    isInitialized,
  };
};

const FileUploader: React.FC<FileUploaderProps> = ({
  showPreview = true,
  onFileUpload,
  icon = "upload",
  extraText,
  text = "Drop files here or click to upload",
  maxFiles = 1,
  defaultPreview,
  defaultName,
  disabled = false,
  error,
  allowedTypes = ["image/jpeg", "image/png", "video/mp4"],
  alwaysShowDropzone = true,
}) => {
  const {
    selectedFiles,
    handleAcceptedFiles,
    removeFile,
    errorMessage,
    isInitialized,
  } = useFileUploader(
    maxFiles,
    defaultPreview,
    defaultName,
    allowedTypes,
    onFileUpload
  );

  // Always show dropzone if alwaysShowDropzone is true
  const showDropzone =
    alwaysShowDropzone ||
    (!defaultName && selectedFiles.length === 0) ||
    (isInitialized && selectedFiles.length === 0);

  useEffect(() => {
    console.log("selected files are ", selectedFiles);
  }, [selectedFiles]);

  return (
    <>
      {showDropzone && (
        <Dropzone
          onDrop={(acceptedFiles) => {
            if (!disabled) {
              handleAcceptedFiles(acceptedFiles, onFileUpload);
            }
          }}
          maxFiles={maxFiles - selectedFiles.length}
          disabled={disabled || selectedFiles.length >= maxFiles}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
                disabled || selectedFiles.length >= maxFiles
                  ? "opacity-60 bg-gray-100 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
              {...getRootProps()}
            >
              <input
                {...getInputProps()}
                disabled={disabled || selectedFiles.length >= maxFiles}
              />
              <div className="text-gray-500 mb-2">
                {icon === "upload" ? (
                  <svg
                    className="h-12 w-12 mx-auto"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <i className={`text-3xl ${icon}`} />
                )}
              </div>
              <h3 className="text-gray-700 text-lg font-medium">{text}</h3>
              {extraText && (
                <p className="text-gray-500 text-sm mt-1">{extraText}</p>
              )}
              {selectedFiles.length > 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  {selectedFiles.length} of {maxFiles} files selected
                </p>
              )}
            </div>
          )}
        </Dropzone>
      )}

      {(error || errorMessage) && (
        <p className="text-red-500 text-sm mt-2">{error || errorMessage}</p>
      )}

      <div className="mt-3 space-y-2">
        {(showPreview || selectedFiles.length > 0) &&
          selectedFiles.map((file, idx) => (
            <div key={idx} className="bg-white border p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 h-10 justify-center rounded w-10 items-center">
                    {file.isLoading ? (
                      <div className="flex h-full justify-center w-full animate-pulse items-center">
                        <svg
                          className="h-5 text-gray-400 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : file.isVideo ? (
                      <VideoModal
                        videoUrl={file.preview || ""}
                        thumbnailUrl={file.thumbnail || ""}
                      />
                    ) : (
                      <Image
                        className="h-full w-full object-cover"
                        alt={file.name}
                        src={file.preview || ""}
                        width={100}
                        height={80}
                        onError={(e) => {
                          console.error("Error loading image:", e);
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-gray-500 text-xs">
                      {file.isLoading ? "Loading..." : file.formattedSize}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-gray-400 hover:text-red-500 text-4xl"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export { FileUploader, useFileUploader };
