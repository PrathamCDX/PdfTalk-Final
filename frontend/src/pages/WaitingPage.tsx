import React from "react";

const WaitingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-8"></div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Server is starting up...
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Please wait a moment while we get things ready for you. This may take a
        few seconds if the server is waking up from sleep.
      </p>
    </div>
  );
};

export default WaitingPage;
