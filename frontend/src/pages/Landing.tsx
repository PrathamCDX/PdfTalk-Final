import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authContext } from "@/App";
import BackendWarning from "@/components/BackendWarning";

const Landing = () => {
  const { googleAuth, setGoogleAuth } = useContext(authContext) || {};
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <BackendWarning />
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              PDF Talks
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Chat with Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                PDFs
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload any PDF document and start having intelligent
              conversations. Ask questions, get summaries, and extract insights
              instantly with AI-powered analysis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    setGoogleAuth(credentialResponse.credential);
                    // console.log(credentialResponse);
                    navigate("/app");
                  }}
                  onError={() => {
                    setGoogleAuth("");
                    // console.log("Login Failed");
                  }}
                  useOneTap
                />
              </Button>
            </div>

            {/* Demo Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      You ask:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      "What are the main conclusions?"
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      AI responds:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      "Based on the analysis, the key findings include..."
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Your PDF Document
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Smart Conversations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask natural language questions and get intelligent responses
                based on your document content.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Instant Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get summaries, extract key points, and understand complex
                documents in seconds.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Multiple Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize and manage conversations with multiple PDF documents
                simultaneously.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 PDF Talks. Made with ❤️ for better document understanding.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
