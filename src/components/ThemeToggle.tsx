import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const ThemeToggle = ({ variant = "default" }: { variant?: string }) => {

  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button onClick={() => setDark(!dark)} className="h-8 w-8" variant={variant === "secondary" ? "secondary" : "outline"}>
      {dark ? <Sun/> : <Moon/>}
    </Button>
  );
};

export default ThemeToggle;