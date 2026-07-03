import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#007AFF',
          'blue-hover': '#0066D6',
          gray: '#8E8E93',
          'gray-2': '#AEAEB2',
          'gray-5': '#E5E5EA',
          'gray-6': '#F2F2F7',
        },
      },
      borderRadius: {
        glass: '20px',
        'glass-lg': '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
