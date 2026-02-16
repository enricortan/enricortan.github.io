import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { 
  PenTool, 
  StickyNote, 
  BookOpen, 
  Pencil, 
  Pin, 
  Figma,
  Palette,
  Layout,
  Layers,
  Square,
  Lightbulb,
  Sparkles,
  Compass,
  Ruler,
  Scissors,
  Brush,
  Target,
  Grid3x3
} from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  icon: any;
  delay: number;
  color: string;
}

export function NetworkBackground() {
  const [nodes] = useState<Node[]>([
    // Top area
    { id: 1, x: 75, y: 10, size: 50, icon: PenTool, delay: 0, color: 'coral' },
    { id: 2, x: 85, y: 20, size: 45, icon: StickyNote, delay: 0.5, color: 'mint' },
    { id: 3, x: 92, y: 15, size: 42, icon: Figma, delay: 1, color: 'lavender' },
    // Middle area
    { id: 4, x: 70, y: 35, size: 48, icon: BookOpen, delay: 0.8, color: 'peach' },
    { id: 5, x: 80, y: 45, size: 46, icon: Pencil, delay: 1.2, color: 'sky' },
    { id: 6, x: 88, y: 38, size: 44, icon: Palette, delay: 0.3, color: 'rose' },
    { id: 7, x: 95, y: 30, size: 43, icon: Layout, delay: 1.5, color: 'sage' },
    // Bottom area
    { id: 8, x: 72, y: 60, size: 47, icon: Pin, delay: 0.6, color: 'lemon' },
    { id: 9, x: 85, y: 55, size: 45, icon: Layers, delay: 1.8, color: 'periwinkle' },
    { id: 10, x: 94, y: 48, size: 42, icon: Square, delay: 0.9, color: 'teal' },
    { id: 11, x: 78, y: 70, size: 46, icon: Lightbulb, delay: 1.1, color: 'coral' },
    { id: 12, x: 88, y: 65, size: 44, icon: Sparkles, delay: 1.4, color: 'mint' },
    { id: 13, x: 68, y: 75, size: 45, icon: Compass, delay: 0.7, color: 'lavender' },
    { id: 14, x: 82, y: 82, size: 43, icon: Ruler, delay: 1.6, color: 'peach' },
    // Bottom right area - NEW ICONS
    { id: 15, x: 92, y: 75, size: 45, icon: Scissors, delay: 0.9, color: 'sky' },
    { id: 16, x: 96, y: 62, size: 44, icon: Brush, delay: 1.3, color: 'rose' },
    { id: 17, x: 88, y: 85, size: 46, icon: Target, delay: 1.7, color: 'sage' },
    { id: 18, x: 96, y: 82, size: 42, icon: Grid3x3, delay: 2.0, color: 'teal' },
  ]);

  const connections = [
    // Top cluster connections
    [1, 2], [2, 3], [1, 4],
    // Middle connections
    [2, 4], [4, 5], [5, 6], [3, 7], [6, 7], [2, 6],
    // Bottom connections
    [5, 8], [6, 9], [7, 10], [9, 10],
    [8, 9], [8, 11], [9, 12], [10, 12],
    // Cross connections for web effect
    [11, 12], [11, 13], [12, 14], [13, 14],
    [8, 13], [5, 9], [4, 8],
    // Bottom right connections - NEW
    [10, 16], [12, 15], [16, 15], [15, 17],
    [14, 17], [17, 18], [15, 18], [12, 16],
    [9, 16], [16, 18]
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'coral':
        return {
          gradient: 'from-coral-500/30 via-coral-600/25 to-coral-700/30',
          glow: 'from-coral-400/20 to-coral-600/20',
          border: 'border-coral-300/30 dark:border-coral-500/35',
          shadow: 'shadow-coral-500/25',
          text: 'text-coral-600 dark:text-coral-300',
          iconColor: '#ff6347'
        };
      case 'mint':
        return {
          gradient: 'from-mint-500/30 via-mint-600/25 to-mint-700/30',
          glow: 'from-mint-400/20 to-mint-600/20',
          border: 'border-mint-300/30 dark:border-mint-500/35',
          shadow: 'shadow-mint-500/25',
          text: 'text-mint-600 dark:text-mint-300',
          iconColor: '#98fb98'
        };
      case 'lavender':
        return {
          gradient: 'from-lavender-500/30 via-lavender-600/25 to-lavender-700/30',
          glow: 'from-lavender-400/20 to-lavender-600/20',
          border: 'border-lavender-300/30 dark:border-lavender-500/35',
          shadow: 'shadow-lavender-500/25',
          text: 'text-lavender-600 dark:text-lavender-300',
          iconColor: '#e6e6fa'
        };
      case 'peach':
        return {
          gradient: 'from-peach-500/30 via-peach-600/25 to-peach-700/30',
          glow: 'from-peach-400/20 to-peach-600/20',
          border: 'border-peach-300/30 dark:border-peach-500/35',
          shadow: 'shadow-peach-500/25',
          text: 'text-peach-600 dark:text-peach-300',
          iconColor: '#ffdab9'
        };
      case 'sky':
        return {
          gradient: 'from-sky-500/30 via-sky-600/25 to-sky-700/30',
          glow: 'from-sky-400/20 to-sky-600/20',
          border: 'border-sky-300/30 dark:border-sky-500/35',
          shadow: 'shadow-sky-500/25',
          text: 'text-sky-600 dark:text-sky-300',
          iconColor: '#87ceeb'
        };
      case 'rose':
        return {
          gradient: 'from-rose-500/30 via-rose-600/25 to-rose-700/30',
          glow: 'from-rose-400/20 to-rose-600/20',
          border: 'border-rose-300/30 dark:border-rose-500/35',
          shadow: 'shadow-rose-500/25',
          text: 'text-rose-600 dark:text-rose-300',
          iconColor: '#ff69b4'
        };
      case 'sage':
        return {
          gradient: 'from-sage-500/30 via-sage-600/25 to-sage-700/30',
          glow: 'from-sage-400/20 to-sage-600/20',
          border: 'border-sage-300/30 dark:border-sage-500/35',
          shadow: 'shadow-sage-500/25',
          text: 'text-sage-600 dark:text-sage-300',
          iconColor: '#8fbc8f'
        };
      case 'lemon':
        return {
          gradient: 'from-lemon-500/30 via-lemon-600/25 to-lemon-700/30',
          glow: 'from-lemon-400/20 to-lemon-600/20',
          border: 'border-lemon-300/30 dark:border-lemon-500/35',
          shadow: 'shadow-lemon-500/25',
          text: 'text-lemon-600 dark:text-lemon-300',
          iconColor: '#fffacd'
        };
      case 'periwinkle':
        return {
          gradient: 'from-periwinkle-500/30 via-periwinkle-600/25 to-periwinkle-700/30',
          glow: 'from-periwinkle-400/20 to-periwinkle-600/20',
          border: 'border-periwinkle-300/30 dark:border-periwinkle-500/35',
          shadow: 'shadow-periwinkle-500/25',
          text: 'text-periwinkle-600 dark:text-periwinkle-300',
          iconColor: '#add8e6'
        };
      case 'teal':
        return {
          gradient: 'from-teal-500/30 via-teal-600/25 to-teal-700/30',
          glow: 'from-teal-400/20 to-teal-600/20',
          border: 'border-teal-300/30 dark:border-teal-500/35',
          shadow: 'shadow-teal-500/25',
          text: 'text-teal-600 dark:text-teal-300',
          iconColor: '#40e0d0'
        };
      default:
        return {
          gradient: 'from-slate-500/30 to-slate-600/30',
          glow: 'from-slate-400/20 to-slate-600/20',
          border: 'border-slate-300/30',
          shadow: 'shadow-slate-500/25',
          text: 'text-slate-600',
          iconColor: '#64748b'
        };
    }
  };

  return (
    <>
      {/* Mobile version - Full width from left edge with network lines */}
      <div className="absolute w-full h-screen pointer-events-none lg:hidden z-0 flex items-center justify-start" style={{ top: '-100px', left: '0px' }}>
        <div 
          className="w-screen h-[140vw] origin-center relative"
          style={{ 
            transform: 'rotate(-90deg)',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            style={{ 
              filter: 'drop-shadow(0 0 25px rgba(147, 51, 234, 0.5))',
              transform: 'translate(15px, 30px)'
            }}
          >
            {/* SVG for connection lines - Thicker and more visible on mobile */}
            <defs>
              <linearGradient id="lineGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {connections.map(([start, end], idx) => {
              const startNode = nodes.find(n => n.id === start);
              const endNode = nodes.find(n => n.id === end);
              if (!startNode || !endNode) return null;
              
              return (
                <motion.line
                  key={`line-mobile-${idx}`}
                  x1={`${startNode.x}%`}
                  y1={`${startNode.y}%`}
                  x2={`${endNode.x}%`}
                  y2={`${endNode.y}%`}
                  stroke="url(#lineGradientMobile)"
                  strokeWidth="0.15"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{
                    duration: 2,
                    delay: idx * 0.2,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </svg>

          {/* Animated nodes - Now inside rotated container with proper positioning */}
          <div className="absolute inset-0 w-full h-full">
            {nodes.map((node) => {
              const colors = getColorClasses(node.color);
              return (
                <motion.div
                  key={`mobile-node-${node.id}`}
                  className="absolute"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: `${node.size * 0.85}px`,
                    height: `${node.size * 0.85}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: node.delay,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.15, rotate: 15 }}
                >
                  {/* Large outer glow - Reduced for smaller size */}
                  <motion.div
                    className={`absolute inset-[-15px] rounded-full bg-gradient-to-br ${colors.glow} blur-xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.25, 0.4, 0.25],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: node.delay,
                    }}
                  />
                  
                  {/* Middle glow ring - Smaller */}
                  <motion.div
                    className={`absolute inset-[-8px] rounded-full bg-gradient-to-br ${colors.glow} blur-md`}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: node.delay + 0.5,
                    }}
                  />
                  
                  {/* Main node with gradient background - Slightly smaller */}
                  <motion.div 
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.shadow} border ${colors.border} flex items-center justify-center backdrop-blur-sm`}
                    style={{ opacity: 0.9 }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: node.delay,
                    }}
                  >
                    <motion.span 
                      className={`text-base font-bold ${colors.text} drop-shadow-lg`}
                      animate={{
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: node.delay + 0.8,
                      }}
                    >
                      <node.icon size={20} color={colors.iconColor} strokeWidth={2} />
                    </motion.span>
                  </motion.div>

                  {/* Animated pulse rings - Smaller */}
                  <motion.div
                    className={`absolute inset-0 rounded-full border ${colors.border}`}
                    animate={{
                      scale: [1, 1.8],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: node.delay + 1,
                    }}
                  />

                  {/* Second pulse ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full border ${colors.border}`}
                    animate={{
                      scale: [1, 2.2],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: node.delay + 1.5,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Floating geometric shapes - Now inside rotated container */}
          <motion.div
            className="absolute"
            style={{ left: '60%', top: '20%' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 border-2 border-slate-400/40 dark:border-slate-500/50 rotate-45 shadow-lg shadow-slate-500/20" />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: '88%', top: '70%' }}
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-gray-400/40 dark:border-gray-500/50 shadow-lg shadow-gray-500/20" />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: '72%', top: '80%' }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon 
                points="30,5 55,55 5,55" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-neutral-400/40 dark:text-neutral-500/50 drop-shadow-lg"
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: '58%', top: '65%' }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -360],
              opacity: [0.18, 0.32, 0.18],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-slate-400/25 to-gray-400/25 rounded-lg rotate-12 shadow-lg shadow-slate-500/15 backdrop-blur-sm" />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: '94%', top: '42%' }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 90, 0],
              opacity: [0.18, 0.32, 0.18],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <svg width="55" height="55" viewBox="0 0 55 55">
              <rect 
                x="10" y="10" 
                width="35" height="35" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-gray-400/40 dark:text-gray-500/50 drop-shadow-lg"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Desktop version - Original layout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {/* SVG for connection lines - Hidden on mobile, shown on desktop */}
        <svg className="absolute inset-0 w-full h-full hidden lg:block" style={{ opacity: 0.6 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {connections.map(([start, end], idx) => {
            const startNode = nodes.find(n => n.id === start);
            const endNode = nodes.find(n => n.id === end);
            if (!startNode || !endNode) return null;
            
            return (
              <motion.line
                key={`line-${idx}`}
                x1={`${startNode.x}%`}
                y1={`${startNode.y}%`}
                x2={`${endNode.x}%`}
                y2={`${endNode.y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="0.2"
                strokeDasharray="5 10"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  delay: idx * 0.2,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </svg>

        {/* Animated nodes */}
        {nodes.map((node) => {
          const colors = getColorClasses(node.color);
          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `calc(${node.x}% - ${node.size / 2}px)`,
                top: `calc(${node.y}% - ${node.size / 2}px)`,
                width: `${node.size}px`,
                height: `${node.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: node.delay,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.15, rotate: 15 }}
            >
              {/* Large outer glow */}
              <motion.div
                className={`absolute inset-[-20px] rounded-full bg-gradient-to-br ${colors.glow} blur-2xl`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay,
                }}
              />
              
              {/* Middle glow ring */}
              <motion.div
                className={`absolute inset-[-8px] rounded-full bg-gradient-to-br ${colors.glow} blur-md`}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.25, 0.4, 0.25],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay + 0.5,
                }}
              />
              
              {/* Main node with gradient background */}
              <motion.div 
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.shadow} border ${colors.border} flex items-center justify-center backdrop-blur-sm`}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: node.delay,
                }}
              >
                <motion.span 
                  className={`text-sm md:text-base font-bold ${colors.text} drop-shadow-lg`}
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: node.delay + 0.8,
                  }}
                >
                  <node.icon size={24} color={colors.iconColor} />
                </motion.span>
              </motion.div>

              {/* Animated pulse rings */}
              <motion.div
                className={`absolute inset-0 rounded-full border ${colors.border}`}
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: node.delay + 1,
                }}
              />

              {/* Second pulse ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border ${colors.border}`}
                animate={{
                  scale: [1, 2.2],
                  opacity: [0.3, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: node.delay + 1.5,
                }}
              />

              {/* Sparkle effect - removed for subtlety */}
            </motion.div>
          );
        })}

        {/* Floating geometric shapes for extra decoration */}
        <motion.div
          className="absolute"
          style={{ left: '60%', top: '20%' }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 border-2 border-slate-400/40 dark:border-slate-500/50 rotate-45 shadow-lg shadow-slate-500/20" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: '88%', top: '70%' }}
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="w-20 h-20 rounded-full border-2 border-gray-400/40 dark:border-gray-500/50 shadow-lg shadow-gray-500/20" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: '72%', top: '80%' }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <polygon 
              points="30,5 55,55 5,55" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-neutral-400/40 dark:text-neutral-500/50 drop-shadow-lg"
            />
          </svg>
        </motion.div>

        {/* Additional decorative elements */}
        <motion.div
          className="absolute"
          style={{ left: '58%', top: '65%' }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -360],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-slate-400/25 to-gray-400/25 rounded-lg rotate-12 shadow-lg shadow-slate-500/15 backdrop-blur-sm" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: '94%', top: '42%' }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 90, 0],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg width="55" height="55" viewBox="0 0 55 55">
            <rect 
              x="10" y="10" 
              width="35" height="35" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-gray-400/40 dark:text-gray-500/50 drop-shadow-lg"
            />
          </svg>
        </motion.div>
      </div>
    </>
  );
}