// TEMP FILE — for quickly testing dark mode only.
// Delete this file + its <DarkModeTestToggle /> import/usage in App.jsx
// when you're done. It doesn't touch any app state or structure —
// it just toggles the "dark" class on <html>, which is what makes
// every dark: class in the app switch on/off.

import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeTestToggle() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  function toggle() {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  }

  return (
    <button
      onClick={toggle}
      style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
      className="flex h-11 w-11 items-center justify-center rounded-full cursor-pointer bg-indigo-600 text-white shadow-lg"
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}
