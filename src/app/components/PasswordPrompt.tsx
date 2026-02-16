import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, X } from "lucide-react";

interface PasswordPromptProps {
  onSubmit: (password: string) => void;
  onCancel: () => void;
  error?: boolean;
}

export function PasswordPrompt({ onSubmit, onCancel, error }: PasswordPromptProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Lock Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">
            Password Protected
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            This case study is password protected. Please enter the password to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  error ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter password"
                autoFocus
                required
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 mt-2"
                >
                  Incorrect password. Please try again.
                </motion.p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                Unlock
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
