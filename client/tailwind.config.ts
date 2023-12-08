import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
            jk: ['jkadobe', 'open-sans'],
        },

        extend: {
            colors: {
                primary: '#4044ED',
                lightnavy: '#1A192C',
                red: '#F81919',
                navy: '#161056',
                tuna: '#313250',
                Iron: '#D9D9D9',
                Gravel: '#494848',
            },
        },
    },
    plugins: [],
};
export default config;
