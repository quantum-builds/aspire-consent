export const formatDateForInput = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    return ""; // Invalid date
  }

  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const hours = parsedDate.getHours().toString().padStart(2, "0");
  const minutes = parsedDate.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTimeLocal = (date: Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
