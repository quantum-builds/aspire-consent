export default function getPathAfterUploadsImages(fullPath: string) {
  if (fullPath.includes("uploads/aspire-consent/")) {
    return fullPath.split("uploads/aspire-consent/")[1];
  }
  return fullPath;
}
