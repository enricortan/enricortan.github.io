import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function DataInitializeButton() {
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [initializing, setInitializing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, message]);
  };

  const handleInitialize = async () => {
    if (!confirm("This will populate the database with 4 sample case studies. Continue?")) {
      return;
    }

    setInitializing(true);
    setStatus("Starting initialization...");
    setProgress(0);
    setLogs([]);

    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      setStatus("❌ No admin token found. Please login again.");
      setInitializing(false);
      return;
    }

    addLog(`🔑 Using token: ${token.substring(0, 20)}...`);
    addLog(`🌐 Project ID: ${projectId}`);

    try {
      // Test 1: Health check
      addLog(`\n🏥 Testing health endpoint...`);
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/health`;
      addLog(`   URL: ${healthUrl}`);
      
      const healthRes = await fetch(healthUrl);
      addLog(`   Status: ${healthRes.status}`);
      
      if (!healthRes.ok) {
        throw new Error(`Health check failed: ${healthRes.status}`);
      }
      
      const healthData = await healthRes.json();
      addLog(`   Response: ${JSON.stringify(healthData)}`);
      addLog(`✅ Server is responding`);

      // Test 2: Auth check
      addLog(`\n🔐 Testing authentication...`);
      const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/test`;
      addLog(`   URL: ${authUrl}`);
      
      const authRes = await fetch(authUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Password": token,
        },
      });
      addLog(`   Status: ${authRes.status}`);
      
      if (!authRes.ok) {
        const authError = await authRes.text();
        addLog(`   Error: ${authError}`);
        throw new Error(`Auth failed: ${authRes.status} - ${authError}`);
      }
      
      const authData = await authRes.json();
      addLog(`   Response: ${JSON.stringify(authData)}`);
      addLog(`✅ Authentication successful`);

      // Test 3: Save a simple test case study
      addLog(`\n📝 Testing case study save...`);
      const testStudy = {
        id: "test-study",
        title: "Test Study",
        subtitle: "Testing",
        category: "Test",
        year: "2024",
        heroImage: "https://images.unsplash.com/photo-1558655146-d09347e92766",
        overview: {
          role: "Designer",
          duration: "1 month",
          tools: ["Figma"],
          description: "Test description",
        },
        problem: "Test problem",
        solution: "Test solution",
        process: [
          {
            title: "Step 1",
            description: "Description 1",
          },
        ],
        images: ["https://images.unsplash.com/photo-1558655146-d09347e92766"],
        results: [
          { metric: "Test", value: "100%" },
        ],
      };

      const testUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/case-studies`;
      addLog(`   URL: ${testUrl}`);
      addLog(`   Sending test case study...`);

      const testRes = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Password": token,
        },
        body: JSON.stringify(testStudy),
      });

      addLog(`   Status: ${testRes.status}`);

      if (!testRes.ok) {
        const errorText = await testRes.text();
        addLog(`   ❌ Error: ${errorText}`);
        throw new Error(`Failed to save test study: ${testRes.status} - ${errorText}`);
      }

      const testResult = await testRes.json();
      addLog(`   ✅ Response: ${JSON.stringify(testResult)}`);
      addLog(`✅ Test save successful!`);

      // Now load all the real case studies
      addLog(`\n📚 Loading full case study data...`);
      
      // Import dynamically to avoid issues
      const { caseStudies } = await import("@/app/data/caseStudies");
      addLog(`   Found ${caseStudies.length} case studies to save`);

      for (let i = 0; i < caseStudies.length; i++) {
        const study = caseStudies[i];
        setStatus(`Saving: ${study.title} (${i + 1}/${caseStudies.length})`);
        setProgress(((i + 1) / caseStudies.length) * 90);

        addLog(`\n📤 [${i + 1}/${caseStudies.length}] Saving: ${study.title}`);

        const response = await fetch(testUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token,
          },
          body: JSON.stringify(study),
        });

        if (!response.ok) {
          const errorText = await response.text();
          addLog(`   ❌ Failed: ${response.status} - ${errorText}`);
          throw new Error(`Failed to save ${study.title}`);
        }

        addLog(`   ✅ Saved ${study.id}`);
      }

      // Save settings
      addLog(`\n⚙️ Saving site settings...`);
      setStatus("Saving site settings...");
      setProgress(95);

      const defaultSettings = {
        siteName: "Enrico Portfolio",
        heroTitle: "Crafting meaningful digital experiences",
        heroSubtitle: "I'm a product designer focused on creating user-centered solutions that solve real problems and delight users. With a passion for beautiful interfaces and seamless interactions, I help companies transform their ideas into engaging digital products.",
        aboutTitle: "Let's work together",
        aboutDescription: "I'm passionate about solving complex problems through thoughtful design. With over 5 years of experience in product design, I've helped companies of all sizes create digital experiences that users love. My approach combines user research, strategic thinking, and visual design to deliver solutions that are both beautiful and functional. I believe great design should be invisible - it should just work.",
        aboutExpertise: ["Product Design", "UX Research", "Design Systems", "Prototyping", "User Testing", "Interface Design"],
        contactEmail: "hello@enrico.design",
        contactPhone: "+1 (555) 123-4567",
        socialLinkedIn: "https://linkedin.com/in/yourprofile",
        socialTwitter: "https://twitter.com/yourhandle",
        socialDribbble: "https://dribbble.com/yourprofile",
        socialBehance: "https://behance.net/yourprofile",
      };

      const settingsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token,
          },
          body: JSON.stringify(defaultSettings),
        }
      );

      if (settingsRes.ok) {
        addLog(`✅ Settings saved`);
      } else {
        addLog(`⚠️ Settings save failed: ${settingsRes.status}`);
      }

      setProgress(100);
      addLog(`\n🎉 SUCCESS! All data initialized.`);
      setStatus("✅ Initialization complete! Reloading...");
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      addLog(`\n🚨 ERROR: ${error.message}`);
      addLog(`Error type: ${error.constructor.name}`);
      
      if (error instanceof TypeError) {
        addLog(`\n💡 This is a network error.`);
        addLog(`   The Edge Function may not be deployed.`);
        addLog(`   Or there may be a CORS issue.`);
      }
      
      setStatus(`❌ Failed: ${error.message}`);
      setInitializing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Initial Setup Required</p>
            <p>Click the button below to populate your portfolio with 4 sample case studies. You can edit or replace them later through this admin panel.</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleInitialize}
        disabled={initializing}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
      >
        <Upload className="w-5 h-5" />
        {initializing ? "Initializing..." : "Load Sample Case Studies & Settings"}
      </button>
      
      {status && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 mb-2">{status}</p>
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
      
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 shadow-lg max-h-96 overflow-y-auto font-mono text-xs">
          {logs.map((log, i) => (
            <div key={i} className="text-green-400">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}