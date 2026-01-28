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
        accent: "var(--accent-color)",
        darkBg: "var(--darkBg)",
        hoverColor: "var(--hoverColor)",
        lightBg: "var(--lightBg)",
        textColor: "var(--textColor)",
        dark: "var(--dark)",
        light: "var(--light)",
        lightGray: "var(--lightGray)",
        darkGray: "var(--darkGray)",
        bottelGreen: "#2a4927",
        lightBottelGreen: "#d3f6f19c",
      },
      keyframes: {
        tada: {
          "0%": { transform: "scale(1)" },
          "10%, 20%": { transform: "scale(0.9) rotate(-3deg)" },
          "30%, 50%, 70%": { transform: "scale(1.1) rotate(3deg)" },
          "40%, 60%": { transform: "scale(1.1) rotate(-3deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        slideDownFade: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "10%": { transform: "translateY(0)", opacity: "1" },
          "90%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
      },
      animation: {
        tada: "tada 2s ease-in-out infinite",
        slideDownFade: "slideDownFade 6s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
