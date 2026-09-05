import { useState } from "react";
import { motion } from "motion/react";
import { Database, CheckCircle } from "lucide-react";
import { caseStudies } from "@/app/data/caseStudies";
import { sampleBlogPosts } from "@/app/data/blogPosts";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function DataInitializer() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setStatus("loading");
    setMessage("Initializing database with sample data...");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setStatus("error");
        setMessage("Please login first");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token,
          },
          body: JSON.stringify({ 
            caseStudies,
            blogPosts: sampleBlogPosts 
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message + " - Refreshing...");
        // Refresh the page after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus("error");
        setMessage("Failed to initialize data");
      }
    } catch (error) {
      setStatus("error");
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Initialize Sample Data</h3>
            <p className="text-gray-600 mb-4">
              Click below to populate your database with 4 sample case studies and 4 sample blog posts. This is useful for testing or starting fresh.
            </p>
            <button
              onClick={handleInitialize}
              disabled={status === "loading"}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Initializing..." : "Initialize Data"}
            </button>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 flex items-center gap-2 ${
                  status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"
                }`}
              >
                {status === "success" && <CheckCircle className="w-5 h-5" />}
                {message}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}