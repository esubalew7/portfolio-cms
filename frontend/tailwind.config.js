/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-app)',
        surface: {
          base: 'var(--surface-base)',
          raised: 'var(--surface-raised)',
          elevated: 'var(--surface-elevated)',
        },
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          muted: 'var(--content-muted)',
          inverse: 'var(--content-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          foreground: 'var(--accent-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        full: '9999px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        floating: 'var(--shadow-floating)',
        glass: 'var(--shadow-glass)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        code: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '28': '7rem',
        '36': '9rem',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
        widest: '0.08em',
      },
    },
  },
  plugins: [],
};
