import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New color palette
        tarawera: {
          DEFAULT: '#083A62',
          50: '#1A5A8A',
          100: '#0F4A72',
          200: '#083A62',
          300: '#062E4F',
          400: '#05233C',
          500: '#041829',
          600: '#020C16',
          700: '#010103',
          800: '#000000',
          900: '#000000',
        },
        rosebud: {
          DEFAULT: '#FBB49C',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FEE5DC',
          300: '#FDD6C3',
          400: '#FCC5AA',
          500: '#FBB49C',
          600: '#F99A7A',
          700: '#F78058',
          800: '#F56636',
          900: '#F34C14',
        },
        ferra: {
          DEFAULT: '#7E5064',
          50: '#C4A4B4',
          100: '#BC98AA',
          200: '#AD8096',
          300: '#9E6882',
          400: '#8E5C73',
          500: '#7E5064',
          600: '#6A4355',
          700: '#563646',
          800: '#422937',
          900: '#2E1C28',
        },
        copperrose: {
          DEFAULT: '#9C6464',
          50: '#D4B4B4',
          100: '#CCA8A8',
          200: '#BD9090',
          300: '#AE7878',
          400: '#9C6464',
          500: '#855555',
          600: '#6E4646',
          700: '#573737',
          800: '#402828',
          900: '#291919',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Custom gradients using the new color palette
        "gradient-tarawera-rosebud": "linear-gradient(135deg, #083A62, #FBB49C)",
        "gradient-ferra-copperrose": "linear-gradient(135deg, #7E5064, #9C6464)",
        "gradient-tarawera-ferra": "linear-gradient(135deg, #083A62, #7E5064)",
        "gradient-rosebud-copperrose": "linear-gradient(135deg, #FBB49C, #9C6464)",
        "gradient-warm": "linear-gradient(135deg, #FBB49C, #9C6464, #7E5064)",
        "gradient-cool": "linear-gradient(135deg, #083A62, #7E5064, #9C6464)",
        "gradient-sunset": "linear-gradient(135deg, #FBB49C, #9C6464, #7E5064, #083A62)",
        "gradient-ocean": "linear-gradient(135deg, #083A62, #7E5064, #FBB49C)",
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards', // forwards keeps it at the end state
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
