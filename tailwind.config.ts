import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nordic clean palette
        nordic: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        // Crisp signal colors for deadlines and alerts
        urgent: {
          light: '#FEE2E2',
          base: '#EF4444',
          text: '#991B1B',
          border: '#FCA5A5'
        },
        warning: {
          light: '#FEF3C7',
          base: '#F59E0B',
          text: '#92400E',
          border: '#FCD34D'
        },
        calm: {
          light: '#DCFCE7',
          base: '#10B981',
          text: '#065F46',
          border: '#86EFAC'
        },
        ongoing: {
          light: '#E0F2FE',
          base: '#0284C7',
          text: '#075985',
          border: '#7DD3FC'
        },
        international: {
          light: '#F3E8FF',
          base: '#9333EA',
          text: '#6B21A8',
          border: '#D8B4FE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
