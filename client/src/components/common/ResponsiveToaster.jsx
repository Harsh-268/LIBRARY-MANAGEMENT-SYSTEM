import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext.jsx";

// true below Tailwind's `sm` breakpoint (640px)
const useIsMobile = (query = "(max-width: 639px)") => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

const ResponsiveToaster = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <Toaster
      // desktop keeps your current top-right; mobile moves to bottom-center
      position={isMobile ? "bottom-center" : "top-right"}
      // keep clear of the iOS home indicator / gesture bar
      containerStyle={
        isMobile ? { bottom: "calc(16px + env(safe-area-inset-bottom))" } : undefined
      }
      toastOptions={{
        duration: isMobile ? 3000 : 4000,
        style: {
          maxWidth: isMobile ? "100%" : 420,
          fontSize: isMobile ? 13 : 14,
          background: dark ? "#1f2937" : "#ffffff",
          color: dark ? "#f3f4f6" : "#111827",
          border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
        },
      }}
    />
  );
};

export default ResponsiveToaster;