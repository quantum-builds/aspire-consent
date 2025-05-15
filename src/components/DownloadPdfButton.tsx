"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "@/components/PDFDownloader";
import { TPdfData } from "@/types/common";
import { ReactNode, CSSProperties } from "react";

interface DownloadPdfButtonProps {
  data: TPdfData;
  fileName?: string;
  children?: ReactNode;
}

export default function DownloadPdfButton({
  data,
  fileName = "document.pdf",
  children,
}: DownloadPdfButtonProps) {
  const buttonStyle: CSSProperties = {
    textDecoration: "none",
    padding: "10px 20px",
    backgroundColor: "#698AFF",
    color: "white",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block",
  };

  const wrapperStyle: CSSProperties = {
    display: "inline-block",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  };

  return (
    <div style={wrapperStyle}>
      <PDFDownloadLink
        document={<PdfDocument data={data} />}
        fileName={fileName}
        style={buttonStyle}
      >
        {({ loading }) =>
          loading ? "Loading document..." : children || "Download PDF"
        }
      </PDFDownloadLink>
    </div>
  );
}
