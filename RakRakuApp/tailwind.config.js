/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f7ff',
                    100: '#bae7ff',
                    500: '#1890ff',
                    600: '#096dd9',
                },
                accent: {
                    green: '#52c41a',
                    yellow: '#faad14',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
