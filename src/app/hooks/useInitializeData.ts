import { useEffect } from "react";
import { caseStudies } from "@/app/data/caseStudies";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function useInitializeData() {
  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        // Check if data already exists
        const checkResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/case-studies`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const checkData = await checkResponse.json();

        // If no data exists, initialize with defaults
        if (!checkData.success || checkData.data.length === 0) {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/initialize`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
                "X-Admin-Password": token,
              },
              body: JSON.stringify({ caseStudies }),
            }
          );

          const data = await response.json();
          console.log("Data initialized:", data);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);
}