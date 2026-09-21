"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { DemoBanner } from "./DemoBanner";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [currentMode, setCurrentMode] = useState<string>("DEMO");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/demo")
      .then((res) => res.json())
      .then((data) => {
        if (data.activeMode) setCurrentMode(data.activeMode);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleModeToggle = async (newMode: string) => {
    setCurrentMode(newMode);
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        currentMode={currentMode}
        onModeToggle={handleModeToggle}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
      <DemoBanner
        currentMode={currentMode}
        onSwitchToReal={() => handleModeToggle("REAL")}
      />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden" key={`${currentMode}-${refreshKey}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
