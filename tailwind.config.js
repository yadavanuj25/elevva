export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        spartan: ['"League Spartan"', "sans-serif"],
        fredoka: ['"Fredoka One"', "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        golos: ["Golos Text", "sans-serif"],
      },
      colors: {
        darkBg: "var(--darkBg)",
        hoverColor: "var(--hoverColor)",
        lightBg: "var(--lightBg)",
        textColor: "var(--textColor)",
        dark: "var(--dark)",
        light: "var(--light)",
        lightGray: "var(--lightGray)",
        darkGray: "var(--darkGray)",
        bottelGreen: "#007672",
        lightBottelGreen: "#b2f1e89c",
      },
      keyframes: {
        tada: {
          "0%": { transform: "scale(1)" },
          "10%, 20%": { transform: "scale(0.9) rotate(-3deg)" },
          "30%, 50%, 70%": { transform: "scale(1.1) rotate(3deg)" },
          "40%, 60%": { transform: "scale(1.1) rotate(-3deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
      },
      animation: {
        tada: "tada 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
