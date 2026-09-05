import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import {
  Save, CheckCircle2, Plus, Trash2, RotateCcw, GripVertical,
} from "lucide-react";
import {
  useContactSettings,
  ContactSettings,
  ContactSocialLink,
} from "../hooks/useContactSettings";

const inputCls =
  "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#0071e3] outline-none transition-shadow";
const textareaCls =
  "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#0071e3] outline-none resize-none transition-shadow";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {children}
      </label>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-[#1d1d1f]">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

export function AdminContactPage() {
  const { settings: loaded, loading, save, reset: resetToDefault } =
    useContactSettings();
  const [s, setS] = useState<ContactSettings>(loaded);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) setS(loaded);
  }, [loading]);

  const set = <K extends keyof ContactSettings>(key: K, val: ContactSettings[K]) =>
    setS((p) => ({ ...p, [key]: val }));

  /* ── Social link helpers ─────────────────────────────────────────── */
  const updateLink = (i: number, field: keyof ContactSocialLink, val: string) =>
    setS((p) => {
      const links = [...p.socialLinks];
      links[i] = { ...links[i], [field]: val };
      return { ...p, socialLinks: links };
    });

  const addLink = () =>
    setS((p) => ({
      ...p,
      socialLinks: [
        ...p.socialLinks,
        { name: "", icon: "Globe", url: "https://", label: "" },
      ],
    }));

  const removeLink = (i: number) =>
    setS((p) => ({ ...p, socialLinks: p.socialLinks.filter((_, idx) => idx !== i) }));

  const moveLink = (i: number, dir: -1 | 1) =>
    setS((p) => {
      const links = [...p.socialLinks];
      const j = i + dir;
      if (j < 0 || j >= links.length) return p;
      [links[i], links[j]] = [links[j], links[i]];
      return { ...p, socialLinks: links };
    });

  /* ── Save / reset ─────────────────────────────────────────────────── */
  const handleSave = () => {
    save(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirm("Reset all contact page settings to defaults?")) return;
    resetToDefault();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-7 h-7 border-2 border-[#1d1d1f] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">Contact Page</h1>
            <p className="text-sm text-[#6e6e73] mt-0.5">
              Everything shown on <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/contact</code>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#6e6e73] border border-black/[0.1] rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-[#1d1d1f] text-white hover:opacity-90"
              }`}
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save changes"}
            </motion.button>
          </div>
        </div>

        <div className="space-y-5">

          {/* ── 1. Intro text ─────────────────────────────────────── */}
          <Card title="Intro text">
            <div>
              <Label hint="Small uppercase text above the heading">Badge</Label>
              <input
                type="text"
                className={inputCls}
                value={s.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="Get In Touch"
              />
            </div>
            <div>
              <Label>Heading</Label>
              <input
                type="text"
                className={inputCls}
                value={s.heading}
                onChange={(e) => set("heading", e.target.value)}
                placeholder="Ready to start your project?"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                rows={3}
                className={textareaCls}
                value={s.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Let's discuss how we can work together…"
              />
            </div>
          </Card>

          {/* ── 2. Email CTA ──────────────────────────────────────── */}
          <Card title="Email CTA">
            <p className="text-xs text-[#6e6e73] leading-relaxed -mt-1">
              Shown as a clickable mailto link with a copy button. No contact form — direct and spam-free.
            </p>
            <div>
              <Label>Your email address</Label>
              <input
                type="email"
                className={inputCls}
                value={s.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="hello@yourname.com"
              />
            </div>
            <div>
              <Label hint='Label on the "open mail client" button'>Button label</Label>
              <input
                type="text"
                className={inputCls}
                value={s.buttonLabel}
                onChange={(e) => set("buttonLabel", e.target.value)}
                placeholder="Send me an email"
              />
            </div>
          </Card>

          {/* ── 3. Social links ───────────────────────────────────── */}
          <Card title="Social links">
            <p className="text-xs text-[#6e6e73] leading-relaxed -mt-1">
              Each link shows as a card with icon, name, and label. Use any{" "}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noreferrer"
                className="text-[#0071e3] hover:underline"
              >
                Lucide icon name
              </a>{" "}
              (e.g. <code className="text-xs bg-gray-100 px-1 rounded">Linkedin</code>,{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">Github</code>,{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">Twitter</code> for X,{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">Globe</code>).
            </p>

            <div className="space-y-3">
              {s.socialLinks.map((link, i) => (
                <div
                  key={i}
                  className="bg-[#f5f5f7] rounded-xl border border-black/[0.05] p-4"
                >
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveLink(i, -1)}
                        disabled={i === 0}
                        className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-semibold text-gray-500">Link {i + 1}</span>
                    </div>
                    <button
                      onClick={() => removeLink(i)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Fields grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Display name</Label>
                      <input
                        type="text"
                        className={inputCls}
                        value={link.name}
                        onChange={(e) => updateLink(i, "name", e.target.value)}
                        placeholder="X"
                      />
                    </div>
                    <div>
                      <Label>Lucide icon name</Label>
                      <input
                        type="text"
                        className={inputCls}
                        value={link.icon}
                        onChange={(e) => updateLink(i, "icon", e.target.value)}
                        placeholder="Twitter"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>URL</Label>
                      <input
                        type="url"
                        className={inputCls}
                        value={link.url}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        placeholder="https://x.com/yourhandle"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label hint="Shown below the name (handle, domain, etc.)">Label</Label>
                      <input
                        type="text"
                        className={inputCls}
                        value={link.label}
                        onChange={(e) => updateLink(i, "label", e.target.value)}
                        placeholder="@yourhandle"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addLink}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1d1d1f] border border-black/[0.1] rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add social link
            </button>
          </Card>

        </div>

        {/* ── Bottom save ─────────────────────────────────────────── */}
        <div className="mt-8 flex justify-end">
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-[#1d1d1f] text-white hover:opacity-90"
            }`}
          >
            {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? "Saved!" : "Save changes"}
          </motion.button>
        </div>
      </div>
    </AdminLayout>
  );
}
