/** @type {import('tailwindcss').Config} */
module.exports = {
 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
	darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
				
        
        // Ваши кастомные цвета
        vividViolet: "#8948e9",
        lightTurquoise: "#99f6e4",
        brightPurple: "#8000ff",
        brightCyan: "#00FFFF",
      },
    },
  },
  plugins: [],
}