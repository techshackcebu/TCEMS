/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ltt-orange': '#F15A24',
                'bg-carbon': '#0D0D0D',
                'bg-slate': '#1A1A1A',
                'text-main': '#FFFFFF',
                'text-muted': '#A0A0A0',
                'accent-blue': '#00A3FF',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}
