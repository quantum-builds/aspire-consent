import { stripHtml } from "string-strip-html";

export function sanitizeHtmlToText(html: string): string {
  // Strip HTML tags and convert to plain text
  const result = stripHtml(html, {
    dumpLinkHrefsNearby: {
      enabled: true,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
    cb: ({ tag }) => {
      // Removed the unused 'insert' parameter
      let replacement = "";

      // Handle specific tags if needed
      if (tag.name === "a") {
        // For links, we might want to keep the href
        const href = tag.attributes?.find(
          (attr) => attr.name === "href"
        )?.value;
        if (href) {
          replacement = ` (${href})`;
        }
      }
      // For line breaks, replace with newlines
      else if (tag.name === "br" || tag.name === "p") {
        replacement = "\n";
      }

      return { replacement }; // Return the replacement value
    },
  });

  return result.result.trim();
}
