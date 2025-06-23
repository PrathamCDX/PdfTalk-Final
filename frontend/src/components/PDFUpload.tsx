import React, { useCallback, useEffect, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { set } from "date-fns";

interface PDFUploadProps {
  onFileUpload: (file: File) => void;
  activeProjectId: string | null;
  uploadPdf: (file: File) => Promise<string | null>;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({
  onFileUpload,
  activeProjectId,
  uploadPdf,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [uploadPendingFile, setUploadPendingFile] = useState<boolean>(false);

  useEffect(() => {
    if (activeProjectId == null) {
      // console.log("No active project selected use effect pdf upload");
    } else {
      setUploadPendingFile(true);
      // console.log(
      //   "pdf upload changes use effect pdf upload : ",
      //   activeProjectId
      // );
    }
  }, [activeProjectId]);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files[0];

      if (pdfFile && validateFile(pdfFile)) {
        onFileUpload(pdfFile);
      }
    },
    [onFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setPdfFile((prev) => {
        prev = file;
        // console.log("File set:", prev);
        return prev;
      });
      onFileUpload(file);
      // console.log("uploaded:  ");
      if (uploadPendingFile) {
        await uploadPdf(file);
      }
      // console.log("File selected:", file);
    }
  };

  return (
    <div className="w-full ">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer",
          isDragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              isDragOver
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            )}
          >
            {isDragOver ? (
              <FileText className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isDragOver ? "Drop your PDF here" : "Upload your PDF"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose File
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Supported format: PDF</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
