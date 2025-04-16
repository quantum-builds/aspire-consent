export default function getPathAfterUploadsImages(fullPath: string) {
  if (fullPath.includes("uploads/images/")) {
    return fullPath.split("uploads/images/")[1];
  }
  return fullPath;
}
