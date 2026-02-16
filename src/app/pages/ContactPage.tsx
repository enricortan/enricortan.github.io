import { motion } from "motion/react";
import { Mail, Linkedin, Twitter, Github, MapPin, Clock, Calendar } from "lucide-react";

export function ContactPage() {
  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      href: "mailto:hello@yourname.com",
      label: "hello@yourname.com",
      color: "from-red-500 to-orange-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "linkedin.com/in/yourname",
      color: "from-blue-600 to-blue-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
      label: "@yourname",
      color: "from-sky-500 to-blue-500",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com",
      label: "github.com/yourname",
      color: "from-gray-700 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-8 font-bold leading-tight">
              Let's work{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm currently available for freelance projects and full-time
              opportunities. Whether you have a question or just want to say hi, feel
              free to reach out!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative flex items-start gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${link.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors font-medium">
                      {link.label}
                    </p>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* Message Card */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-12 md:p-16 shadow-xl border border-purple-100"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prefer to send a message?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Drop me an email at{" "}
              <a
                href="mailto:hello@yourname.com"
                className="font-semibold text-purple-600 hover:text-purple-700 underline"
              >
                hello@yourname.com
              </a>{" "}
              and I'll get back to you as soon as possible. I typically respond
              within 24-48 hours.
            </p>
            <div className="space-y-4 text-left max-w-lg mx-auto">
              {[
                {
                  title: "Project inquiries:",
                  desc: "Please include details about your project, timeline, and budget.",
                },
                {
                  title: "General questions:",
                  desc: "Feel free to ask anything about my work or process.",
                },
                {
                  title: "Collaboration:",
                  desc: "Always open to interesting partnerships and opportunities.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mt-2 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong className="text-gray-900">{item.title}</strong> {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Location & Availability */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Location",
                value: "San Francisco, CA",
                subtitle: "Open to remote work",
              },
              {
                icon: Calendar,
                title: "Availability",
                value: "Currently available",
                subtitle: "Starting February 2026",
              },
              {
                icon: Clock,
                title: "Time Zone",
                value: "PST (UTC-8)",
                subtitle: "Flexible hours",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-sm uppercase tracking-wider text-purple-300 font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold mb-2">{item.value}</p>
                <p className="text-white/70">{item.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your project?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Let's discuss how we can work together to bring your ideas to life.
          </p>
          <a
            href="mailto:hello@yourname.com"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-xl group"
          >
            <Mail className="w-5 h-5" />
            Send me an email
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </section>
    </div>
  );
}