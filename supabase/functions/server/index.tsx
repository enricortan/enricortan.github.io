import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Admin-Password",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Admin password
const ADMIN_PASSWORD = "enricoadminpass";

// Middleware to check admin authentication
const requireAdmin = async (c: any, next: any) => {
  // Check for admin password in custom header
  const adminPassword = c.req.header("X-Admin-Password");
  console.log(
    "Admin password received:",
    adminPassword ? "***" : "none",
  );
  console.log("Expected password:", ADMIN_PASSWORD);

  if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
    console.log("Authentication failed!");
    return c.json({ error: "Unauthorized" }, 401);
  }
  console.log("Authentication successful!");
  await next();
};

// Health check endpoint
app.get("/make-server-cb2778c5/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin auth test endpoint
app.get(
  "/make-server-cb2778c5/admin/test",
  requireAdmin,
  (c) => {
    return c.json({
      status: "authenticated",
      message: "Admin authentication works!",
    });
  },
);

// Admin login endpoint
app.post("/make-server-cb2778c5/admin/login", async (c) => {
  try {
    console.log("Login attempt received");
    const body = await c.req.json();
    console.log("Request body received:", body);
    const { password } = body;

    console.log(
      "Comparing password:",
      password === ADMIN_PASSWORD,
    );

    if (password === ADMIN_PASSWORD) {
      console.log("Login successful");
      return c.json({
        success: true,
        token: ADMIN_PASSWORD,
        message: "Login successful",
      });
    }

    console.log("Invalid password provided");
    return c.json(
      { success: false, message: "Invalid password" },
      401,
    );
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      {
        success: false,
        error: "Login failed",
        details: error.message,
      },
      500,
    );
  }
});

// Get all case studies
app.get("/make-server-cb2778c5/case-studies", async (c) => {
  try {
    console.log("📡 Fetching case studies from database...");
    console.log(
      "Environment check - SUPABASE_URL:",
      Deno.env.get("SUPABASE_URL") ? "✓ Set" : "✗ Missing",
    );
    console.log(
      "Environment check - SUPABASE_SERVICE_ROLE_KEY:",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
        ? "✓ Set"
        : "✗ Missing",
    );

    const studies = await kv.getByPrefix("case_study:");
    console.log(
      `✅ Retrieved ${studies ? studies.length : 0} case studies from database`,
    );
    console.log("Studies data type:", typeof studies);
    console.log("Studies is array:", Array.isArray(studies));

    // Ensure we always return an array, even if null/undefined
    const caseStudiesArray = Array.isArray(studies)
      ? studies
      : [];
    console.log(
      "Case studies array length:",
      caseStudiesArray.length,
    );

    if (caseStudiesArray.length > 0) {
      console.log(
        "First case study ID:",
        caseStudiesArray[0]?.id,
      );
      console.log(
        "All IDs:",
        caseStudiesArray.map((s) => s?.id).join(", "),
      );
    }

    // Add cache-busting headers to prevent stale data
    c.header(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    c.header("Pragma", "no-cache");
    c.header("Expires", "0");

    return c.json({ success: true, data: caseStudiesArray });
  } catch (error) {
    console.error("❌ Error fetching case studies:", error);
    console.error("Error type:", typeof error);
    console.error("Error name:", error?.name);
    console.error(
      "Error message:",
      error?.message || "No error message",
    );
    console.error(
      "Error stack:",
      error?.stack || "No stack trace",
    );
    console.error(
      "Full error object:",
      JSON.stringify(error, null, 2),
    );
    return c.json(
      {
        success: false,
        error: "Failed to fetch case studies",
        details:
          error?.message || String(error) || "Unknown error",
        errorType: error?.name || typeof error,
      },
      500,
    );
  }
});

// Get single case study
app.get("/make-server-cb2778c5/case-studies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const study = await kv.get(`case_study:${id}`);

    if (!study) {
      return c.json({ error: "Case study not found" }, 404);
    }

    return c.json({ success: true, data: study });
  } catch (error) {
    console.error("Error fetching case study:", error);
    return c.json(
      {
        error: "Failed to fetch case study",
        details: error.message,
      },
      500,
    );
  }
});

// Create or update case study (admin only)
app.post(
  "/make-server-cb2778c5/admin/case-studies",
  requireAdmin,
  async (c) => {
    try {
      const study = await c.req.json();

      if (!study.id) {
        return c.json(
          { error: "Case study ID is required" },
          400,
        );
      }

      await kv.set(`case_study:${study.id}`, study);
      return c.json({ success: true, data: study });
    } catch (error) {
      console.error("Error saving case study:", error);
      return c.json(
        {
          error: "Failed to save case study",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Update case study (admin only)
app.put(
  "/make-server-cb2778c5/admin/case-studies/:id",
  requireAdmin,
  async (c) => {
    try {
      const id = c.req.param("id");
      const updates = await c.req.json();

      const existing = await kv.get(`case_study:${id}`);
      if (!existing) {
        return c.json({ error: "Case study not found" }, 404);
      }

      const updated = { ...existing, ...updates, id };
      await kv.set(`case_study:${id}`, updated);

      return c.json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating case study:", error);
      return c.json(
        {
          error: "Failed to update case study",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Delete case study (admin only)
app.delete(
  "/make-server-cb2778c5/admin/case-studies/:id",
  requireAdmin,
  async (c) => {
    try {
      const id = c.req.param("id");
      await kv.del(`case_study:${id}`);
      return c.json({
        success: true,
        message: "Case study deleted",
      });
    } catch (error) {
      console.error("Error deleting case study:", error);
      return c.json(
        {
          error: "Failed to delete case study",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Get site settings
app.get("/make-server-cb2778c5/settings", async (c) => {
  try {
    const settings = (await kv.get("site_settings")) || {
      siteName: "Enrico R Tan",
      heroTitle: "Crafting meaningful digital experiences",
      heroSubtitle:
        "I'm a product designer focused on creating user-centered solutions that solve real problems and delight users.",
      aboutTitle: "Let's work together",
      aboutDescription:
        "I'm passionate about solving complex problems through thoughtful design. With over 5 years of experience in product design, I've helped companies of all sizes create digital experiences that users love. My approach combines user research, strategic thinking, and visual design to deliver solutions that are both beautiful and functional.",
      aboutExpertise: [
        "Product Design",
        "UX Research",
        "Design Systems",
        "Prototyping",
        "User Testing",
      ],
      contactEmail: "hello@example.com",
      contactPhone: "+1 (555) 123-4567",
      socialLinkedIn: "https://linkedin.com/in/yourprofile",
      socialTwitter: "https://twitter.com/yourhandle",
      socialDribbble: "https://dribbble.com/yourprofile",
      socialBehance: "https://behance.net/yourprofile",
    };
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return c.json(
      {
        error: "Failed to fetch settings",
        details: error.message,
      },
      500,
    );
  }
});

// Update site settings (admin only)
app.put(
  "/make-server-cb2778c5/admin/settings",
  requireAdmin,
  async (c) => {
    try {
      const settings = await c.req.json();
      await kv.set("site_settings", settings);
      return c.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error updating settings:", error);
      return c.json(
        {
          error: "Failed to update settings",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Get homepage sections
app.get(
  "/make-server-cb2778c5/homepage-sections",
  async (c) => {
    try {
      const sections = (await kv.get("homepage_sections")) || [
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
              {
                icon: "Users",
                value: "50+",
                label: "Happy Clients",
              },
              {
                icon: "Zap",
                value: "100+",
                label: "Projects Completed",
              },
              {
                icon: "Sparkles",
                value: "5+",
                label: "Years Experience",
              },
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
      return c.json({ success: true, data: sections });
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
      return c.json(
        {
          error: "Failed to fetch homepage sections",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Update homepage sections (admin only)
app.post(
  "/make-server-cb2778c5/homepage-sections",
  requireAdmin,
  async (c) => {
    try {
      const { sections } = await c.req.json();

      if (!sections || !Array.isArray(sections)) {
        return c.json({ error: "Invalid sections data" }, 400);
      }

      await kv.set("homepage_sections", sections);
      return c.json({ success: true, data: sections });
    } catch (error) {
      console.error("Error updating homepage sections:", error);
      return c.json(
        {
          error: "Failed to update homepage sections",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Initialize default data if needed
app.post(
  "/make-server-cb2778c5/admin/initialize",
  requireAdmin,
  async (c) => {
    try {
      console.log("📥 Initialize endpoint called");

      const body = await c.req.json();
      console.log(
        "Request body received, has caseStudies:",
        !!body.caseStudies,
      );
      console.log(
        "Request body received, has blogPosts:",
        !!body.blogPosts,
      );

      const { caseStudies, blogPosts } = body;

      if (!caseStudies || !Array.isArray(caseStudies)) {
        console.error("Invalid caseStudies data:", caseStudies);
        return c.json(
          { error: "Invalid case studies data" },
          400,
        );
      }

      console.log(
        `Processing ${caseStudies.length} case studies...`,
      );

      // Save each case study
      for (let i = 0; i < caseStudies.length; i++) {
        const study = caseStudies[i];
        console.log(
          `Saving case study ${i + 1}/${caseStudies.length}: ${study.id}`,
        );

        try {
          await kv.set(`case_study:${study.id}`, study);
          console.log(`✅ Saved: ${study.id}`);
        } catch (err) {
          console.error(`❌ Error saving ${study.id}:`, err);
          throw err;
        }
      }

      console.log("All case studies saved successfully");

      // Save blog posts if provided
      if (blogPosts && Array.isArray(blogPosts)) {
        console.log(
          `Processing ${blogPosts.length} blog posts...`,
        );

        for (let i = 0; i < blogPosts.length; i++) {
          const post = blogPosts[i];
          console.log(
            `Saving blog post ${i + 1}/${blogPosts.length}: ${post.id}`,
          );

          try {
            await kv.set(`blog_post:${post.id}`, post);
            console.log(`✅ Saved: ${post.id}`);
          } catch (err) {
            console.error(`❌ Error saving ${post.id}:`, err);
            throw err;
          }
        }

        console.log("All blog posts saved successfully");
      }

      // Also initialize default settings if they don't exist
      const existingSettings = await kv.get("site_settings");
      if (!existingSettings) {
        console.log("Initializing default site settings...");
        const defaultSettings = {
          siteName: "Enrico Portfolio",
          heroTitle: "Crafting meaningful digital experiences",
          heroSubtitle:
            "I'm a product designer focused on creating user-centered solutions that solve real problems and delight users. With a passion for beautiful interfaces and seamless interactions, I help companies transform their ideas into engaging digital products.",
          aboutTitle: "Let's work together",
          aboutDescription:
            "I'm passionate about solving complex problems through thoughtful design. With over 5 years of experience in product design, I've helped companies of all sizes create digital experiences that users love. My approach combines user research, strategic thinking, and visual design to deliver solutions that are both beautiful and functional. I believe great design should be invisible - it should just work.",
          aboutExpertise: [
            "Product Design",
            "UX Research",
            "Design Systems",
            "Prototyping",
            "User Testing",
            "Interface Design",
          ],
          contactEmail: "hello@enrico.design",
          contactPhone: "+1 (555) 123-4567",
          socialLinkedIn: "https://linkedin.com/in/yourprofile",
          socialTwitter: "https://twitter.com/yourhandle",
          socialDribbble: "https://dribbble.com/yourprofile",
          socialBehance: "https://behance.net/yourprofile",
        };
        await kv.set("site_settings", defaultSettings);
        console.log("✅ Initialized default site settings");
      } else {
        console.log("Site settings already exist, skipping");
      }

      console.log("✅ Initialization complete!");

      const message =
        blogPosts && blogPosts.length > 0
          ? `Initialized ${caseStudies.length} case studies, ${blogPosts.length} blog posts, and site settings`
          : `Initialized ${caseStudies.length} case studies and site settings`;

      return c.json({
        success: true,
        message,
      });
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      return c.json(
        {
          error: "Failed to initialize data",
          details: error.message,
          stack: error.stack,
        },
        500,
      );
    }
  },
);

// Blog Posts Endpoints

// Get all blog posts (public - only published)
app.get("/make-server-cb2778c5/blog-posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("blog_post:");
    const postsArray = Array.isArray(posts) ? posts : [];

    // Only return published posts for public endpoint
    const publishedPosts = postsArray.filter(
      (post) => post.status === "published",
    );

    return c.json({ success: true, data: publishedPosts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return c.json(
      {
        error: "Failed to fetch blog posts",
        details: error.message,
      },
      500,
    );
  }
});

// Get single blog post by slug (public)
app.get("/make-server-cb2778c5/blog-posts/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const posts = await kv.getByPrefix("blog_post:");
    const postsArray = Array.isArray(posts) ? posts : [];

    const post = postsArray.find((p) => p.slug === slug);

    if (!post) {
      return c.json({ error: "Blog post not found" }, 404);
    }

    // Only return if published
    if (post.status !== "published") {
      return c.json({ error: "Blog post not found" }, 404);
    }

    return c.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return c.json(
      {
        error: "Failed to fetch blog post",
        details: error.message,
      },
      500,
    );
  }
});

// Get all blog posts (admin - includes drafts)
app.get(
  "/make-server-cb2778c5/admin/blog-posts",
  requireAdmin,
  async (c) => {
    try {
      const posts = await kv.getByPrefix("blog_post:");
      const postsArray = Array.isArray(posts) ? posts : [];

      // Sort by updatedAt (newest first)
      postsArray.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );

      return c.json({ success: true, data: postsArray });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return c.json(
        {
          error: "Failed to fetch blog posts",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Get single blog post by ID (admin)
app.get(
  "/make-server-cb2778c5/admin/blog-posts/:id",
  requireAdmin,
  async (c) => {
    try {
      const id = c.req.param("id");
      const post = await kv.get(`blog_post:${id}`);

      if (!post) {
        return c.json({ error: "Blog post not found" }, 404);
      }

      return c.json({ success: true, data: post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return c.json(
        {
          error: "Failed to fetch blog post",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Create blog post (admin only)
app.post(
  "/make-server-cb2778c5/admin/blog-posts",
  requireAdmin,
  async (c) => {
    try {
      const post = await c.req.json();

      // Generate ID if not provided
      if (!post.id) {
        post.id = crypto.randomUUID();
      }

      // Ensure required fields
      if (!post.slug) {
        return c.json({ error: "Slug is required" }, 400);
      }

      // Check if slug already exists
      const posts = await kv.getByPrefix("blog_post:");
      const postsArray = Array.isArray(posts) ? posts : [];
      const existingPost = postsArray.find(
        (p) => p.slug === post.slug && p.id !== post.id,
      );

      if (existingPost) {
        return c.json(
          { error: "A post with this slug already exists" },
          400,
        );
      }

      await kv.set(`blog_post:${post.id}`, post);
      return c.json({ success: true, data: post });
    } catch (error) {
      console.error("Error creating blog post:", error);
      return c.json(
        {
          error: "Failed to create blog post",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Update blog post (admin only)
app.put(
  "/make-server-cb2778c5/admin/blog-posts/:id",
  requireAdmin,
  async (c) => {
    try {
      const id = c.req.param("id");
      const updates = await c.req.json();

      const existing = await kv.get(`blog_post:${id}`);
      if (!existing) {
        return c.json({ error: "Blog post not found" }, 404);
      }

      // Check if slug is being changed and if it conflicts
      if (updates.slug && updates.slug !== existing.slug) {
        const posts = await kv.getByPrefix("blog_post:");
        const postsArray = Array.isArray(posts) ? posts : [];
        const conflictingPost = postsArray.find(
          (p) => p.slug === updates.slug && p.id !== id,
        );

        if (conflictingPost) {
          return c.json(
            { error: "A post with this slug already exists" },
            400,
          );
        }
      }

      const updated = { ...existing, ...updates, id };
      await kv.set(`blog_post:${id}`, updated);

      return c.json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating blog post:", error);
      return c.json(
        {
          error: "Failed to update blog post",
          details: error.message,
        },
        500,
      );
    }
  },
);

// Delete blog post (admin only)
app.delete(
  "/make-server-cb2778c5/admin/blog-posts/:id",
  requireAdmin,
  async (c) => {
    try {
      const id = c.req.param("id");
      await kv.del(`blog_post:${id}`);
      return c.json({
        success: true,
        message: "Blog post deleted",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return c.json(
        {
          error: "Failed to delete blog post",
          details: error.message,
        },
        500,
      );
    }
  },
);

Deno.serve(app.fetch);