import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
            jk: ['jkadobe', 'open-sans'],
        },

        extend: {
            colors: {
                primary: '#4044ED',
                secondary: '#01b7f9',
                lightnavy: '#1A192C',
                red: '#F81919',
                navy: '#161056',
                tuna: '#313250',
                Iron: '#D9D9D9',
                Gravel: '#494848',
                crimson: '#b52020',
                cgray: '#747474',
                purple: '#4556EF',
                storm: '#606165',
                sapphire: '#4550b6',
            },
        },
    },
    plugins: [],
};
export default config;
