import { useState, useEffect } from "react";
import { caseStudies as defaultCaseStudies, type CaseStudy } from "@/app/data/caseStudies";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5`;

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      console.log("📡 Fetching case studies from database...");
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_BASE}/case-studies?_=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log("Response statusText:", response.statusText);
      
      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON!");
        const text = await response.text();
        console.error("Response text:", text);
        throw new Error("Invalid response format");
      }
      
      const data = await response.json();
      
      console.log("📦 Received data:", data);
      console.log("Data success field:", data.success);
      console.log("Data data field:", data.data);
      
      if (data.success) {
        // Always use database data, even if empty
        // This ensures the homepage shows what's actually in the admin panel
        setCaseStudies(data.data);
        console.log(`✅ Loaded ${data.data.length} case studies from database`);
      } else {
        console.warn("⚠️ API returned success: false");
        console.error("Error details:", data.error || "No error field");
        console.error("Error message:", data.details || "No details field");
        console.error("Error type:", data.errorType || "No error type");
        console.error("Full response:", JSON.stringify(data, null, 2));
        setError(data.error || "Failed to load case studies");
        // Show fallback data when database returns error
        setCaseStudies(defaultCaseStudies);
      }
    } catch (err) {
      console.error("❌ Error fetching case studies:", err);
      setError("Failed to load case studies");
      // Only use fallback data if there's a network error
      setCaseStudies(defaultCaseStudies);
      console.log("📋 Using fallback data due to error");
    } finally {
      setLoading(false);
    }
  };

  return { caseStudies, loading, error, refetch: fetchCaseStudies };
}

export function useCaseStudy(id: string) {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudy();
  }, [id]);

  const fetchCaseStudy = async () => {
    try {
      console.log(`📡 Fetching case study with id: ${id}`);
      const response = await fetch(`${API_BASE}/case-studies`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      console.log(`🔍 Response data:`, data);
      
      if (data.success) {
        console.log(`📋 All case studies in database:`, data.data.map((cs: CaseStudy) => ({ id: cs.id, title: cs.title })));
        console.log(`🎯 Searching for id: "${id}"`);
        
        const found = data.data.find((cs: CaseStudy) => cs.id === id);
        if (found) {
          setCaseStudy(found);
          console.log(`✅ Found case study: ${found.title}`);
        } else {
          console.warn(`⚠️ No case study found with id: ${id}`);
          console.log(`Available IDs:`, data.data.map((cs: CaseStudy) => cs.id));
          // Fallback to default data
          const fallback = defaultCaseStudies.find((cs) => cs.id === id);
          setCaseStudy(fallback || null);
        }
      } else {
        console.warn("⚠️ API returned success: false");
        setError("Failed to load case study");
      }
    } catch (err) {
      console.error(`❌ Error fetching case study ${id}:`, err);
      setError("Failed to load case study");
      // Use fallback data
      const fallback = defaultCaseStudies.find((cs) => cs.id === id);
      setCaseStudy(fallback || null);
    } finally {
      setLoading(false);
    }
  };

  return { caseStudy, loading, error, refetch: fetchCaseStudy };
}