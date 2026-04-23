import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { caseStudies } from "@/app/data/caseStudies";
import { sampleBlogPosts } from "@/app/data/blogPosts";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5`;
const INIT_FLAG = "portfolioDataInitialized";

export function useDataInitializer() {
  // If already initialized in a previous session, skip everything immediately
  const alreadyDone = !!localStorage.getItem(INIT_FLAG);

  const [initialized, setInitialized] = useState(alreadyDone);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Already seeded in a prior session — nothing to do
    if (alreadyDone) return;

    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsInitializing(true);

      const token = localStorage.getItem("adminToken");

      // Check if any data already exists
      const response = await fetch(`${API}/case-studies`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();

      if (!data.success) {
        console.warn("⚠️ Could not reach database, skipping init");
        setInitialized(true);
        setIsInitializing(false);
        return;
      }

      // Database already has case studies — mark as done, never touch it again
      if (data.data.length > 0) {
        console.log(`✅ Database already has ${data.data.length} case studies — skipping init`);
        localStorage.setItem(INIT_FLAG, "true");
        setInitialized(true);
        setIsInitializing(false);
        return;
      }

      // Database is empty and this is the very first time — seed sample data
      if (!token) {
        console.log("⚠️ No admin token found, skipping initialization");
        setInitialized(true);
        setIsInitializing(false);
        return;
      }

      console.log("🔄 First run: seeding sample data…");

      const initResponse = await fetch(`${API}/admin/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Password": token,
        },
        body: JSON.stringify({ caseStudies, blogPosts: sampleBlogPosts }),
      });

      if (initResponse.ok) {
        console.log("✅ Database seeded successfully");
        localStorage.setItem(INIT_FLAG, "true");
        setInitialized(true);
        setIsInitializing(false);
        setTimeout(() => window.location.reload(), 800);
      } else {
        console.error("❌ Failed to seed data");
        setInitialized(true);
        setIsInitializing(false);
      }
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      setInitialized(true);
      setIsInitializing(false);
    }
  };

  return { initialized, isInitializing };
}
