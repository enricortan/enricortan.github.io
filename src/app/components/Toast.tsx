import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const styles = {
    success: {
      bg: "from-green-500 to-emerald-500",
      ring: "ring-green-500/30",
      iconColor: "text-green-500",
    },
    error: {
      bg: "from-red-500 to-rose-500",
      ring: "ring-red-500/30",
      iconColor: "text-red-500",
    },
    warning: {
      bg: "from-yellow-500 to-orange-500",
      ring: "ring-yellow-500/30",
      iconColor: "text-yellow-500",
    },
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ring-4 ${style.ring} overflow-hidden min-w-[320px] max-w-md`}
          >
            {/* Gradient top border */}
            <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
            
            <div className="p-4 flex items-start gap-4">
              {/* Icon with animated background */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${style.bg} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                
                {/* Pulse effect */}
                {type === "success" && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: 2,
                      ease: "easeOut",
                    }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.bg}`}
                  />
                )}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-gray-900 dark:text-white font-semibold leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors group"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`h-1 bg-gradient-to-r ${style.bg} origin-left`}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
