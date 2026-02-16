import { useEffect, useState } from "react";

export interface StatItem {
  icon: string; // Icon name from lucide-react
  value: string;
  label: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
  data?: {
    stats?: StatItem[];
    [key: string]: any;
  };
}

const DEFAULT_SECTIONS: HomepageSectionConfig[] = [
  {
    id: "hero",
    name: "Hero Section",
    isVisible: true,
    order: 1,
  },
  {
    id: "stats",
    name: "Stats Section",
    isVisible: true,
    order: 2,
    data: {
      stats: [
        { icon: "Users", value: "50+", label: "Happy Clients" },
        { icon: "Zap", value: "100+", label: "Projects Completed" },
        { icon: "Sparkles", value: "5+", label: "Years Experience" },
      ],
    },
  },
  {
    id: "values",
    name: "About Me / Values",
    isVisible: true,
    order: 3,
  },
  {
    id: "philosophy",
    name: "Philosophy Section",
    isVisible: true,
    order: 4,
  },
  {
    id: "experience",
    name: "Experience Timeline",
    isVisible: true,
    order: 5,
  },
  {
    id: "skills",
    name: "Skills & Expertise",
    isVisible: true,
    order: 6,
  },
  {
    id: "projects",
    name: "Featured Projects",
    isVisible: true,
    order: 7,
  },
  {
    id: "cta",
    name: "CTA Section",
    isVisible: true,
    order: 8,
  },
];

const STORAGE_KEY = "homepage_sections";

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
        setSections(JSON.parse(stored));
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
    isSectionVisible 
  };
}
