import { Suspense } from "react";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import DashboardWrapper from "./components/DashboardWrapper";
import { redirect } from "next/navigation";
import { getDentistPractice } from "@/services/dentistPractice/DentistPracticeQuery";
import { TDentistPractice } from "@/types/dentist-practice";
import { Response } from "@/types/common";

export default async function Page(props: {
  searchParams?: Promise<{ practiceId: string }>;
}) {
  const searchParams = await props.searchParams;
  const practiceId = searchParams?.practiceId || "";

  let dentistPractices: TDentistPractice[] = [];
  if (!practiceId) {
    const response: Response<TDentistPractice[]> = await getDentistPractice();
    if (response.status && response.data.length > 0) {
      dentistPractices = response.data;
      redirect(`/dentist/dashboard?practiceId=${response.data[0].practice.id}`);
    }
    redirect(`dentist/dashboard?practiceId=${practiceId}`);
  }

  return (
    <Suspense key={practiceId} fallback={<DashboardSkeleton />}>
      <DashboardWrapper
        practiceId={practiceId}
        dentistPractices={dentistPractices}
      />
    </Suspense>
  );
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// import { axiosInstance } from "@/config/api-config";

// export default function MediaUploadPage() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const [uploading, setUploading] = useState(false);

//   const [mediaFiles, setMediaFiles] = useState<
//     { url: string; fileName: string }[] | null
//   >(null);

//   // Handle file selection

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   // Upload file to S3

//   const uploadFile = async () => {
//     if (!selectedFile) return alert("Please select a file first!");

//     setUploading(true);

//     try {
//       // Get the signed URL from the API

//       const response = await axiosInstance.post("/api/s3", {
//         fileName: selectedFile.name,
//         fileSize: selectedFile.size,
//         fileType: selectedFile.type,
//       });

//       const data = await response.data;

//       if (!data.success) throw new Error("Failed to get signed URL");

//       // Upload file to S3
//       await fetch(data.uploadUrl, {
//         method: "PUT",
//         body: selectedFile, // This is your actual file
//         headers: {
//           "Content-Type": selectedFile.type,
//         },
//       });

//       // alert("File uploaded successfully!");

//       fetchMediaFiles(); // Refresh media list after upload
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Fetch uploaded media files

//   const fetchMediaFiles = async () => {
//     try {
//       const response = await fetch(`/api/uploads`);

//       console.log(response);

//       const data = await response.json();

//       console.log(data);

//       if (data.success) {
//         // console.log("data is", data.videos);

//         // setMediaFiles(data.videos); // Assuming API returns `videos`, rename if needed

//         console.log(data);
//         if (data.media) {
//           setMediaFiles(data.media);
//         } else {
//           setMediaFiles(data.url);
//         }
//       } else {
//         console.error("Failed to fetch files");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Upload an Image or Video</h1>

//       {/* File Input */}

//       <input
//         type="file"
//         accept="image/*,video/*"
//         onChange={handleFileChange}
//         className="mb-4 p-2 border rounded-lg"
//       />

//       {/* Upload Button */}

//       <button
//         onClick={uploadFile}
//         disabled={!selectedFile || uploading}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
//       >
//         {uploading ? "Uploading..." : "Upload"}
//       </button>

//       {/* Fetch Files Button */}

//       <button
//         onClick={fetchMediaFiles}
//         className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//       >
//         Fetch Uploaded Files
//       </button>

//       {/* Display Uploaded Media */}

//       {mediaFiles && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//           {mediaFiles.map((file, index) =>
//             file.fileName.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? (
//               // Render image
//               <div className="flex flex-col gap-2">
//                 <Image
//                   src={file.url}
//                   alt="Uploaded"
//                   width={400}
//                   height={300}
//                   className="w-full max-w-md rounded-lg shadow-md"
//                 />
//                 <p>file name :{file.fileName}</p>
//               </div>
//             ) : (
//               // Render video

//               <div className="flex flex-col gap-2">
//                 <video key={index} controls width="400">
//                   <source
//                     src={file.url}
//                     type={`video/${file.fileName.split(".").pop()}`}
//                   />
//                   Your browser does not support the video tag.
//                 </video>
//                 <p>file name :{file.fileName}</p>
//               </div>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import DownloadPdfButton from "@/components/DownloadPdfButton";
// export default function ConsentForm() {
//   const pdfData = {
//     patient: "John Doe",
//     procedure: "Knee Arthroscopy",
//     date: new Date(),
//     qa: [
//       { question: "Do you have any allergies?", answer: "No" },
//       { question: "Have you had this procedure before?", answer: "No" },
//       { question: "Do you understand the risks?", answer: "Yes" },
//       { question: "Consent given for anesthesia?", answer: "Yes" },
//     ],
//     timestamps: [
//       { event: "Form started", time: new Date(Date.now() - 3600000) },
//       { event: "Form completed", time: new Date() },
//     ],
//   };

//   return (
//     <div>
//       <h1>Patient Consent Form</h1>
//       <DownloadPdfButton
//         data={pdfData}
//         fileName={`${pdfData.patient}-consent-form.pdf`}
//       >
//         Download Consent Form
//       </DownloadPdfButton>

//       {/* Display the same information in the UI */}
//       <div
//         style={{ marginTop: "2rem", border: "1px solid #eee", padding: "1rem" }}
//       >
//         <h2>Patient Information</h2>
//         <p>
//           <strong>Name:</strong> {pdfData.patient}
//         </p>
//         <p>
//           <strong>Procedure:</strong> {pdfData.procedure}
//         </p>
//         <p>
//           <strong>Date:</strong> {pdfData.date.toLocaleDateString()}
//         </p>

//         <h2>Questions & Answers</h2>
//         <ul>
//           {pdfData.qa.map((item, index) => (
//             <li key={index}>
//               <strong>{item.question}</strong> - {item.answer}
//             </li>
//           ))}
//         </ul>

//         <h2>Timestamps</h2>
//         <p>
//           Document will be generated with current time:{" "}
//           {new Date().toLocaleString()}
//         </p>
//         <ul>
//           {pdfData.timestamps.map((ts, i) => (
//             <li key={i}>
//               <strong>{ts.event}:</strong> {new Date(ts.time).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
