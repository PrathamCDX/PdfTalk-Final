import React, { useState } from "react";
import { FileText, Download, ZoomIn, ZoomOut } from "lucide-react";
import { PDFProject } from "@/pages/Index";

interface PDFViewerProps {
  project: PDFProject;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ project }) => {
  // --- Added state to control zoom level ---
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Clamp values for min/max zoom
  const minZoom = 0.5;
  const maxZoom = 3;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, maxZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, minZoom));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-4 px-2 flex-shrink-0 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {project.fileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {/* --- Zoom Out --- */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
              title="Zoom Out"
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              disabled={zoom <= minZoom}
            >
              <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {/* --- Zoom Level Display --- */}
            <span
              className="px-2 text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[48px] text-center select-none"
              title="Zoom Level"
            >
              {(zoom * 100).toFixed(0)}%
            </span>
            {/* --- Zoom In --- */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
              title="Zoom In"
              onClick={handleZoomIn}
              aria-label="Zoom In"
              disabled={zoom >= maxZoom}
            >
              <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {/* --- Reset Zoom --- */}
            {Math.abs(zoom - 1) > 0.01 && (
              <button
                className="ml-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                Reset
              </button>
            )}
            {/* Download PDF */}
            <a
              href={project.fileUrl}
              download={project.fileName}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
              title="Download PDF"
              aria-label="Download PDF"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>
      {/* PDF Content */}
      <div className="flex-1 p-2 sm:p-4 overflow-hidden w-full">
        {project.fileUrl ? (
          <div className="h-full bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto transition-colors flex flex-col">
            <div className="w-full h-full flex justify-center items-center overflow-auto">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ minHeight: "300px" }}
              >
                <iframe
                  src={project.fileUrl}
                  className="bg-white dark:bg-gray-950"
                  title={`PDF Viewer - ${project.title}`}
                  style={{
                    minHeight: "300px",
                    border: "none",
                    width: `${zoom * 100}%`,
                    height: `${zoom * 65}vh`,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s, width 0.2s, height 0.2s",
                    boxShadow: "0 0 0 0 transparent",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 transition-colors min-h-[180px]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
              <p className="text-lg font-medium mb-2">PDF Preview</p>
              <p className="text-sm">Your PDF content will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
