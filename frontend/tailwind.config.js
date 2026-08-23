/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deepEmerald: "#0B6E4F",
        mistWhite: "#F5F7F4",
        charcoal: "#222222",
        sage: "#DCE8DF",
        mutedMint: "#CFE5D8",
        primary: "#0B6E4F",
        emerald: "#0B6E4F",
        forest: "#0B6E4F",
        background: "#F5F7F4",
        ink: "#222222",
        graphite: "#222222",
        mist: "#DCE8DF",
        paper: "#F5F7F4",
        forestDeep: "#0B6E4F",
        electric: "#CFE5D8",
        emeraldDark: "#0B6E4F",
        emeraldSoft: "#DCE8DF",
        teal: "#0B6E4F",
        burgundy: "#222222",
        gold: "#CFE5D8"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Newsreader", "ui-serif", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(34, 34, 34, 0.08)"
      }
    }
  },
  plugins: []
};
