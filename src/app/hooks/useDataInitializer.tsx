import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { caseStudies } from "@/app/data/caseStudies";
import { sampleBlogPosts } from "@/app/data/blogPosts";

export function useDataInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsInitializing(true);
      
      // Check if we already have case studies
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/case-studies`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();

      // If no case studies exist, initialize with all default data
      if (data.success && data.data.length === 0) {
        console.log("🔄 No data found. Initializing with sample data...");
        const token = localStorage.getItem("adminToken");
        
        if (!token) {
          console.log("⚠️ No admin token found, skipping initialization");
          setIsInitializing(false);
          return;
        }

        // Initialize all case studies and blog posts
        const initResponse = await fetch(
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

        if (initResponse.ok) {
          const result = await initResponse.json();
          console.log("✅ Database initialized successfully:", result.message);
          console.log(`\n📦 Stored ${caseStudies.length} case studies in database:\n`);
          caseStudies.forEach((study, index) => {
            console.log(`   ${index + 1}. "${study.title}"`);
            console.log(`      └─ Category: ${study.category}`);
            console.log(`      └─ Year: ${study.year}`);
            console.log(`      └─ ID: ${study.id}\n`);
          });
          console.log(`\n📝 Stored ${sampleBlogPosts.length} blog posts in database:\n`);
          sampleBlogPosts.forEach((post, index) => {
            console.log(`   ${index + 1}. "${post.title}"`);
            console.log(`      └─ Category: ${post.category}`);
            console.log(`      └─ Status: ${post.status}`);
            console.log(`      └─ Slug: ${post.slug}\n`);
          });
          console.log("📝 Default site settings also initialized\n");
          console.log("✨ You can now edit everything in the admin panel!\n");
          
          setInitialized(true);
          setIsInitializing(false);
          
          // Reload after a short delay to show the data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error("❌ Failed to initialize data");
          setIsInitializing(false);
        }
      } else {
        console.log(`✅ Database already initialized with ${data.data.length} case studies`);
        setInitialized(true);
        setIsInitializing(false);
      }
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      setIsInitializing(false);
    }
  };

  return { initialized, isInitializing };
}