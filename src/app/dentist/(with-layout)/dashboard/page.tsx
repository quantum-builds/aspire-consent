import Header from "@/components/Header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import RadialProgressCHartCard from "./components/RadialProgressChartCard";
import DashboardCardComponent from "./components/DashBoardCardComponent";
import PatientBarChartCard from "./components/PatientBarChartCard";
import ConsentDataTableComponent from "./components/ConsentDataTableComponent";

export default async function Dashboard() {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold mb-3">Dashboard</p>
          <p className="text-[#0000004D] mb-6">17th April 2025</p>
        </div>
        <Link
          className="bg-[#698AFF] hover:bg-[#698AFF] text-white cursor-pointer py-4 text-xl px-3 flex items-center justify-center rounded-md"
          href={"/dentist/new-consent-form"}
        >
          <Plus width={20} height={20} className="mr-1" />
          New Consent
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-5">
        <div className="col-span-1 lg:col-span-3">
          <DashboardCardComponent />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <PatientBarChartCard cookieHeader={cookieHeader} />
        </div>
        <div className="col-span-1">
          <RadialProgressCHartCard cookieHeader={cookieHeader} />
        </div>

        <div className="col-span-full">
         
          <ConsentDataTableComponent cookieHeader={cookieHeader} />
        </div>
      </div>
    </>
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

//       const response = await axiosInstance.get("/api/s3", {
//         params: {
//           fileName: selectedFile.name,

//           fileType: selectedFile.type,
//         },
//       });

//       const data = await response.data;

//       if (!data.success) throw new Error("Failed to get signed URL");

//       // Upload file to S3

//       await fetch(data.url, {
//         method: "PUT",

//         body: selectedFile,

//         headers: { "Content-Type": selectedFile.type },
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
//               <Image
//                 src={file.url}
//                 alt="Uploaded"
//                 width={400}
//                 height={300}
//                 className="w-full max-w-md rounded-lg shadow-md"
//               />
//             ) : (
//               // Render video

//               <video key={index} controls width="400">
//                 <source
//                   src={file.url}
//                   type={`video/${file.fileName.split(".").pop()}`}
//                 />
//                 Your browser does not support the video tag.
//               </video>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default async function Page() {
//   const response = await getAMedia(
//     "uploads/aspire-consent/aspire-consent-black-logo.svg"
//   );
//   const base64Data = Buffer.from(response).toString("base64");
//   console.log("base is ", base64Data);
//   return <Image src={response} alt="image" width={100} height={100} />;
// }
