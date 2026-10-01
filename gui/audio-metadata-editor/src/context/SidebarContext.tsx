import { useContext, useState, useEffect, type ReactNode, createContext } from "react";

type SidebarContextType = {
  sidebar: Sidebar;
  setSidebarEnabled(enabled: boolean): void;
}

type Sidebar = {
  enabled: boolean;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

const fallback: Sidebar = {
  enabled: false
};

export default function SidebarProvider({ children }: { children: ReactNode}) {
  const [sidebar, setSidebar] = useState(() => {
    try {
      const settingsData = localStorage.getItem("sidebar");
      if (!settingsData) return fallback;

      const parsed = JSON.parse(settingsData);

      // if the data is blank or not an object, return the default values
      if (!parsed || typeof parsed !== "object")
        return fallback;

      return parsed;

    } catch {
      return fallback;
    }
  });

  const setSidebarEnabled = (enabled: boolean) => 
    setSidebar((sidebar: any ) => ({...sidebar, enabled: enabled})); 

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(sidebar));
  }, [sidebar.enabled]);

  return (
    <SidebarContext.Provider value={{ sidebar, setSidebarEnabled }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const ctx: SidebarContextType | null = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}