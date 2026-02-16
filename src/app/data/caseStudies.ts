export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  heroImage: string;
  overview: {
    role: string;
    duration: string;
    tools: string[];
    description: string;
  };
  problem: string;
  solution: string;
  process: {
    title: string;
    description: string;
  }[];
  images: string[];
  results: {
    metric: string;
    value: string;
  }[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  isPasswordProtected?: boolean;
  password?: string;
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fintech-dashboard",
    title: "FinTech Analytics Dashboard",
    subtitle: "Reimagining financial data visualization for modern investors",
    category: "Product Design",
    year: "2025",
    heroImage: "https://images.unsplash.com/photo-1583932692875-a42450d50acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY5NDg5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview: {
      role: "Lead Product Designer",
      duration: "4 months",
      tools: ["Figma", "Principle", "Maze", "Figjam"],
      description: "Led the complete redesign of an investment analytics platform, focusing on making complex financial data accessible and actionable for retail investors.",
    },
    problem: "The existing dashboard was overwhelming users with too much data, leading to decision paralysis. User research revealed that 68% of users felt confused by the interface and couldn't find key metrics quickly.",
    solution: "We designed a modular, card-based interface that allows users to customize their view. Key metrics are surfaced prominently, with advanced data hidden behind progressive disclosure patterns. The new design uses color-coding and visual hierarchy to guide users through complex information.",
    process: [
      {
        title: "User Research & Discovery",
        description: "Conducted 15 user interviews and analyzed usage data from 10,000+ active users. Created user personas representing different investor types and mapped their journeys to identify pain points.",
      },
      {
        title: "Competitive Analysis",
        description: "Evaluated 12 competing platforms to understand industry standards and identify opportunities for differentiation. Found that most competitors focused on power users, leaving a gap for accessible design.",
      },
      {
        title: "Design Exploration",
        description: "Created 3 distinct design directions exploring different approaches to data visualization. Ran preference tests with 50 users to validate design choices before moving forward.",
      },
      {
        title: "Prototyping & Testing",
        description: "Built interactive prototypes in Figma and conducted 5 rounds of usability testing. Iterated based on feedback, focusing on reducing cognitive load and improving task completion rates.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1583932692875-a42450d50acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY5NDg5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3ZWIlMjBkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY5NDg5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3ZWIlMjBkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY5NDg5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    results: [
      { metric: "Task Completion", value: "+42%" },
      { metric: "User Satisfaction", value: "4.8/5" },
      { metric: "Time on Platform", value: "+35%" },
      { metric: "Feature Discovery", value: "+60%" },
    ],
    testimonial: {
      text: "The new dashboard transformed how our users interact with their investments. We've seen a significant increase in engagement and positive feedback.",
      author: "Sarah Chen",
      role: "Head of Product",
    },
  },
  {
    id: "health-mobile-app",
    title: "MindfulHealth Mobile App",
    subtitle: "A holistic approach to mental wellness tracking",
    category: "Mobile App Design",
    year: "2024",
    heroImage: "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY5NDc3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview: {
      role: "UX/UI Designer",
      duration: "6 months",
      tools: ["Figma", "Protopie", "UserTesting", "Notion"],
      description: "Designed a mobile app that helps users track their mental health through mood journaling, meditation, and habit tracking, with a focus on creating a calm, non-judgmental experience.",
    },
    problem: "Users often abandon mental health apps because they feel clinical, overwhelming, or create guilt when they miss entries. Research showed 73% of users stop using mental health apps within the first month.",
    solution: "We created a gentle, encouraging interface that celebrates small wins and never makes users feel guilty. The app uses soft colors, micro-animations, and positive reinforcement to create a supportive environment. Features are introduced gradually to prevent overwhelm.",
    process: [
      {
        title: "Empathy Mapping",
        description: "Spoke with 25 individuals about their mental health journey and created detailed empathy maps. Identified that users need encouragement, not pressure, and want to feel understood, not judged.",
      },
      {
        title: "Information Architecture",
        description: "Designed a simple, three-tab structure that keeps core features accessible. Used card sorting with 30 participants to validate the navigation structure and ensure intuitive organization.",
      },
      {
        title: "Visual Design",
        description: "Developed a calming visual system using nature-inspired colors and gentle animations. Created a comprehensive design system with 50+ components and detailed usage guidelines.",
      },
      {
        title: "Accessibility Testing",
        description: "Conducted extensive accessibility testing including screen reader compatibility, color contrast validation, and usability testing with users who have various disabilities.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY5NDc3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY5NDc3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY5NDc3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    results: [
      { metric: "30-Day Retention", value: "68%" },
      { metric: "Daily Active Users", value: "+125%" },
      { metric: "Average Session Time", value: "12 min" },
      { metric: "App Store Rating", value: "4.9/5" },
    ],
    testimonial: {
      text: "This app feels like having a supportive friend in your pocket. The design is beautiful and calming, and I actually look forward to checking in each day.",
      author: "Alex Thompson",
      role: "Beta User",
    },
  },
  {
    id: "ecommerce-redesign",
    title: "Artisan Marketplace Redesign",
    subtitle: "Connecting independent creators with conscious consumers",
    category: "E-commerce",
    year: "2024",
    heroImage: "https://images.unsplash.com/photo-1629494893504-d41e26a02631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMHV4JTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc2OTQ4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080",
    overview: {
      role: "Senior UX Designer",
      duration: "5 months",
      tools: ["Figma", "Hotjar", "Google Analytics", "Optimal Workshop"],
      description: "Led the redesign of an artisan marketplace platform, focusing on improving product discovery and building trust between buyers and sellers.",
    },
    problem: "The platform had a 68% cart abandonment rate and sellers reported difficulty getting their products discovered. User testing revealed confusing navigation and lack of seller credibility indicators.",
    solution: "We implemented a story-driven approach that highlights artisan backgrounds, improved search with smart filters, and added social proof throughout the purchase journey. The new design emphasizes photography and craftsmanship.",
    process: [
      {
        title: "Stakeholder Workshops",
        description: "Facilitated workshops with both buyers and sellers to understand their needs. Created journey maps for both user types and identified key moments where trust could be built.",
      },
      {
        title: "Conversion Funnel Analysis",
        description: "Analyzed drop-off points in the purchase flow using analytics and heatmaps. Discovered that 45% of users left at the product detail page, indicating a need for better product information architecture.",
      },
      {
        title: "Design System Creation",
        description: "Built a scalable design system that could accommodate hundreds of unique artisan brands while maintaining visual cohesion. Created flexible components that sellers could customize.",
      },
      {
        title: "A/B Testing",
        description: "Ran extensive A/B tests on key pages including product listings, detail pages, and checkout flow. Validated design decisions with real user data before full rollout.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1629494893504-d41e26a02631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMHV4JTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc2OTQ4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx1aSUyMHV4JTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc2OTQ4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1aSUyMHV4JTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc2OTQ4MjExNHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    results: [
      { metric: "Cart Abandonment", value: "-34%" },
      { metric: "Conversion Rate", value: "+56%" },
      { metric: "Seller Signups", value: "+89%" },
      { metric: "Average Order Value", value: "+23%" },
    ],
    testimonial: {
      text: "The redesign completely transformed our platform. Sellers love the story-focused approach, and customers are spending more time discovering unique products.",
      author: "Marcus Rodriguez",
      role: "Founder & CEO",
    },
  },
  {
    id: "brand-identity",
    title: "Sustainable Fashion Brand Identity",
    subtitle: "Creating a visual identity that reflects eco-conscious values",
    category: "Branding",
    year: "2025",
    heroImage: "https://images.unsplash.com/photo-1762787863004-767d5d7eac07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGlkZW50aXR5JTIwZGVzaWdufGVufDF8fHx8MTc2OTQ4MDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    overview: {
      role: "Brand Designer",
      duration: "3 months",
      tools: ["Figma", "Adobe Illustrator", "After Effects"],
      description: "Developed a complete brand identity for a sustainable fashion startup, including logo, color system, typography, and brand guidelines.",
    },
    problem: "The client needed to stand out in a crowded sustainable fashion market while authentically communicating their commitment to environmental responsibility. They wanted to avoid looking too 'earthy' or preachy.",
    solution: "We created a modern, minimalist identity that uses natural forms and earth-tones in unexpected ways. The logo is derived from the golden ratio found in nature, and the color palette balances organic greens with sophisticated neutrals.",
    process: [
      {
        title: "Brand Strategy Workshop",
        description: "Worked with founders to define brand values, personality, and positioning. Created a brand pyramid that clarified the emotional and functional benefits of the brand.",
      },
      {
        title: "Mood Boarding & Concepts",
        description: "Developed 3 distinct creative directions based on different aspects of sustainability: regenerative, timeless, and innovative. Each direction had unique visual and verbal characteristics.",
      },
      {
        title: "Logo Development",
        description: "Explored 50+ logo concepts across the three directions. Refined the top concepts through multiple iterations, testing readability at various sizes and on different applications.",
      },
      {
        title: "Brand System Extension",
        description: "Developed comprehensive brand guidelines including photography style, iconography, packaging design, and social media templates. Created motion guidelines for animated applications.",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1762787863004-767d5d7eac07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGlkZW50aXR5JTIwZGVzaWdufGVufDF8fHx8MTc2OTQ4MDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxicmFuZGluZyUyMGlkZW50aXR5JTIwZGVzaWdufGVufDF8fHx8MTc2OTQ4MDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxicmFuZGluZyUyMGlkZW50aXR5JTIwZGVzaWdufGVufDF8fHx8MTc2OTQ4MDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    results: [
      { metric: "Brand Recognition", value: "+240%" },
      { metric: "Social Engagement", value: "+167%" },
      { metric: "Website Traffic", value: "+92%" },
      { metric: "Press Coverage", value: "15 features" },
    ],
    testimonial: {
      text: "The brand identity perfectly captures who we are. It's sophisticated, memorable, and authentically represents our values without being heavy-handed.",
      author: "Elena Vasquez",
      role: "Creative Director",
    },
  },
];