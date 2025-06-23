import React from "react";

const BackendWarning: React.FC = () => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded"
    role="alert"
  >
    <div className="font-bold">Warning:</div>
    <div>
      The backend server may experience downtime or failures due to heavy
      machine learning models running on a free hosting tier. If you encounter
      issues, please try again later or run the backend locally for best
      results.
    </div>
  </div>
);

export default BackendWarning;
