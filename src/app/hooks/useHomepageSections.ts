import { useEffect, useState } from "react";

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  description: string;
  gradient: string;
}

export interface SkillCategory {
  emoji: string;
  title: string;
  skills: string[];
  gradient: string;
  border: string;
}

export interface ValueItem {
  icon: string;        // Lucide icon name e.g. "Heart"
  title: string;
  description: string;
}

export interface PhilosophyCard {
  icon: string;
  label: string;
  title: string;
  description: string;
  gradient: string;
}

export interface CtaSocialLink {
  name: string;
  icon: string;  // Lucide icon name
  url: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
  data?: {
    stats?: StatItem[];
    experience?: ExperienceItem[];
    skills?: SkillCategory[];
    bioTitle?: string;
    bioDescription?: string;
    valueItems?: ValueItem[];
    philosophyCards?: PhilosophyCard[];
    // cta section
    ctaHeading?: string;
    ctaDescription?: string;
    ctaEmail?: string;
    ctaButtonLabel?: string;
    ctaSocialLinks?: CtaSocialLink[];
    [key: string]: any;
  };
}

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    year: "June 2021 - Present",
    role: "UI/UX Design Lead & Product Owner (Manager 1)",
    company: "CIMB Bank PH",
    description:
      "Elevated to Product Owner with accountability for the strategic vision, roadmap, and delivery of key features within the digital banking platform. Serves as the sole UI/UX design authority, managing and maintaining the entire Figma design system and asset library. Leads product conceptualization from discovery through release, spearheading UI/UX initiatives that elevated user engagement by optimizing critical flows including onboarding and transactional experiences. Orchestrates collaboration between design, development, business, and product teams.",
    gradient: "from-purple-600 to-blue-600",
  },
  {
    year: "March 2017 - June 2021",
    role: "Product Designer",
    company: "Obelisk Security, Hong Kong",
    description:
      "Headed the redesign of cybersecurity product interfaces, significantly enhancing user adoption rates. Collaborated closely with the development team to ensure designs translated seamlessly into functional applications. Re-designed the internal application of the National Cancer Center in Singapore.",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    year: "March 2017 - June 2021",
    role: "UI/UX Designer",
    company: "Futureworks PH (Outbound Asia INC)",
    description:
      "Served as Lead Designer, responsible for the full design lifecycle — from conceptualization and branding through to production and enhancements of new and existing digital products. Functioned as a full-stack design expert, implementing designs via frontend development, prototyping, and preparing final assets for deployment. Responsible for all design needs including the creation of marketing design assets to support product launch and adoption.",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    year: "March 2015 - 2016",
    role: "Frontend Designer, UI/UX",
    company: "ThousandMinds, Makati City",
    description:
      "Supplied design assets for mobile and web applications, ensuring optimal user experience across all platforms.",
    gradient: "from-pink-600 to-purple-600",
  },
];

const DEFAULT_SKILLS: SkillCategory[] = [
  {
    emoji: "🛠",
    title: "Product Ownership & Strategy",
    skills: ["Product Lifecycle Management", "Roadmapping & Prioritization", "Stakeholder Management", "Customer Discovery & Validation"],
    gradient: "from-purple-500/20 to-blue-500/20",
    border: "border-purple-500/30",
  },
  {
    emoji: "🎨",
    title: "UI/UX Design & Research",
    skills: ["UI Design & Prototyping", "Design Systems", "Interaction & Motion Design", "Accessibility Standards"],
    gradient: "from-pink-500/20 to-purple-500/20",
    border: "border-pink-500/30",
  },
  {
    emoji: "🧱",
    title: "Development & Handoff",
    skills: ["Frontend Fundamentals", "Design-to-Dev Handoff", "Version Control & Collaboration"],
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
  },
  {
    emoji: "🧩",
    title: "Collaboration & Productivity",
    skills: ["Project & Task Management", "Cross-functional Team Leadership", "Agile / Scrum Workflows"],
    gradient: "from-teal-500/20 to-blue-500/20",
    border: "border-teal-500/30",
  },
];

const DEFAULT_VALUE_ITEMS: ValueItem[] = [
  { icon: "Heart",     title: "Empathy First",   description: "Understanding user needs is at the heart of everything I design" },
  { icon: "Lightbulb", title: "Innovation",       description: "Pushing boundaries while keeping usability at the forefront" },
  { icon: "Target",    title: "Goal-Oriented",    description: "Aligning design decisions with business objectives and user needs" },
  { icon: "Users",     title: "Collaboration",    description: "Great products are built by great teams working together" },
];

const DEFAULT_PHILOSOPHY_CARDS: PhilosophyCard[] = [
  {
    icon: "Target",
    label: "My Approach",
    title: "User-centered, data-informed",
    description:
      "I believe great design starts with understanding people. Through research, testing, and iteration, I create experiences that solve real problems while delivering business value.",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: "Users",
    label: "Beyond Pixels",
    title: "Collaboration & strategy",
    description:
      "Design doesn't happen in isolation. I work closely with product managers, engineers, and stakeholders to ensure designs are feasible, strategic, and aligned with business goals.",
    gradient: "from-blue-500 to-purple-500",
  },
];

const DEFAULT_SECTIONS: HomepageSectionConfig[] = [
  { id: "hero",  name: "Hero Section",    isVisible: true, order: 1 },
  {
    id: "stats", name: "Stats Section",   isVisible: true, order: 2,
    data: { stats: [
      { icon: "Users",    value: "50+",  label: "Happy Clients" },
      { icon: "Zap",      value: "100+", label: "Projects Completed" },
      { icon: "Sparkles", value: "5+",   label: "Years Experience" },
    ]},
  },
  {
    id: "values", name: "About Me / Values", isVisible: true, order: 3,
    data: {
      bioTitle:       "I create digital products that make a difference",
      bioDescription: "I'm a product designer based in San Francisco with a passion for crafting intuitive, accessible, and beautiful digital experiences. My approach combines user empathy with business strategy to create solutions that truly work.",
      valueItems:     DEFAULT_VALUE_ITEMS,
    },
  },
  {
    id: "philosophy", name: "Philosophy Section", isVisible: true, order: 4,
    data: { philosophyCards: DEFAULT_PHILOSOPHY_CARDS },
  },
  {
    id: "experience", name: "Experience Timeline", isVisible: true, order: 5,
    data: { experience: DEFAULT_EXPERIENCE },
  },
  {
    id: "skills", name: "Skills & Expertise", isVisible: true, order: 6,
    data: { skills: DEFAULT_SKILLS },
  },
  { id: "projects", name: "Featured Projects", isVisible: true, order: 7 },
  {
    id: "cta", name: "CTA Section", isVisible: true, order: 8,
    data: {
      ctaHeading:     "Let's work together",
      ctaDescription: "I'm currently available for freelance projects and full-time opportunities. Whether you have a question or just want to say hi, feel free to reach out!",
      ctaEmail:        "hello@yourname.com",
      ctaButtonLabel:  "Send me a message",
      ctaSocialLinks: [
        { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" },
        { name: "X",        icon: "Twitter",  url: "https://x.com" },
        { name: "GitHub",   icon: "Github",   url: "https://github.com" },
        { name: "Dribbble", icon: "Dribbble", url: "https://dribbble.com" },
      ],
    },
  },
];

const STORAGE_KEY = "homepage_sections";

/**
 * Merge stored sections with defaults so that newly added data fields
 * (like experience) are populated even in older localStorage entries.
 */
function mergeWithDefaults(stored: HomepageSectionConfig[]): HomepageSectionConfig[] {
  return DEFAULT_SECTIONS.map((defaultSection) => {
    const storedSection = stored.find((s) => s.id === defaultSection.id);
    if (!storedSection) return defaultSection;

    // Merge data: keep stored data but fill in missing default data keys
    const mergedData = {
      ...defaultSection.data,
      ...storedSection.data,
    };

    return {
      ...defaultSection,
      ...storedSection,
      data: Object.keys(mergedData).length > 0 ? mergedData : undefined,
    };
  });
}

export function useHomepageSections() {
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: HomepageSectionConfig[] = JSON.parse(stored);
        // Merge to ensure newly added default data fields are included
        setSections(mergeWithDefaults(parsed));
      } else {
        setSections(DEFAULT_SECTIONS);
      }
    } catch (err) {
      console.error("Error loading homepage sections:", err);
      setSections(DEFAULT_SECTIONS);
    } finally {
      setLoading(false);
    }
  };

  const saveSections = (newSections: HomepageSectionConfig[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSections));
      setSections(newSections);
      return true;
    } catch (err) {
      console.error("Error saving homepage sections:", err);
      return false;
    }
  };

  const getSectionConfig = (sectionId: string): HomepageSectionConfig | undefined => {
    return sections.find((s) => s.id === sectionId);
  };

  const isSectionVisible = (sectionId: string): boolean => {
    const section = getSectionConfig(sectionId);
    return section?.isVisible ?? true;
  };

  return {
    sections,
    loading,
    refetch: loadSections,
    saveSections,
    getSectionConfig,
    isSectionVisible,
    DEFAULT_EXPERIENCE,
    DEFAULT_SKILLS,
    DEFAULT_VALUE_ITEMS,
    DEFAULT_PHILOSOPHY_CARDS,
  };
}