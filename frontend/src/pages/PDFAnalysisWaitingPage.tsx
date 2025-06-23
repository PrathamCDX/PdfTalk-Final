import React from "react";

const PDFAnalysisWaitingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-8"></div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Analyzing your PDF...
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Please wait while we process and analyze your uploaded PDF. This may
        take a few moments depending on the file size and server load.
      </p>
      <div className="text-red-500">
        Server can crash due to heavy ML models running in free tier{" "}
      </div>
    </div>
  );
};

export default PDFAnalysisWaitingPage;
