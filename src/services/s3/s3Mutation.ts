import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({ selectedFile }: { selectedFile: File }) => {
      if (!selectedFile) throw new Error("Please select a file first!");

      const response = await axiosInstance.post(ENDPOINTS.s3.getSignedUrl, {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      // console.log("params are ", selectedFile.size);
      const data = response.data;
      if (!data.success) throw new Error("Failed to get signed URL");
      // console.log("upoload data is ", data);
      // return data;

      // console.log("data to put on is ", data.url);
      // await fetch(data., {
      //   method: "PUT",
      //   body: selectedFile,
      //   headers: {
      //     "Content-Type": selectedFile.type,
      //   },
      // });

      await fetch(data.uploadUrl, {
        method: "PUT",
        body: selectedFile, // This is your actual file
        headers: {
          "Content-Type": selectedFile.type,
        },
      });
      return selectedFile;
    },
    onError: (err) => {
      console.error("Upload error:", err);
    },
    onSuccess: () => {
      console.log("File uploaded successfully!");
    },
  });
};
