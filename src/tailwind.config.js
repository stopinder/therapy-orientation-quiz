export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                soft: "0 10px 30px -10px rgba(0,0,0,0.15)",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
        },
    },
    plugins: [],
}

