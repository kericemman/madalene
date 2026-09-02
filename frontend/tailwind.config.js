/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deepEmerald: "#0F4D3E",
        mistWhite: "#F7F8F6",
        charcoal: "#1A1A1A",
        sage: "#B8D8C5",
        mutedMint: "#B8D8C5",
        primary: "#0F4D3E",
        emerald: "#0F4D3E",
        forest: "#0F4D3E",
        background: "#F7F8F6",
        ink: "#1A1A1A",
        graphite: "#1A1A1A",
        mist: "#B8D8C5",
        paper: "#F7F8F6",
        forestDeep: "#0F4D3E",
        electric: "#B8D8C5",
        emeraldDark: "#0F4D3E",
        emeraldSoft: "#B8D8C5",
        teal: "#0F4D3E",
        burgundy: "#1A1A1A",
        gold: "#B8D8C5"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Newsreader", "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(26, 26, 26, 0.08)"
      }
    }
  },
  plugins: []
};
