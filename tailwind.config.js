/* =====================================================================
   LUMINA — Tailwind config
   • content paths cover all Twig + JS so JIT keeps only used classes
   • safe-list-css.txt ensures Twilight Web Component styles ship
   • design tokens bound to CSS variables (merchant-customisable)
   • NOTE: the `extend` block below intentionally includes the spacing,
     lineHeight, width, height, fontSize, borderRadius & boxShadow keys
     REQUIRED by the Twilight tailwind safe-list (e.g. `leading-12`).
     Removing them breaks the production build.
   ===================================================================== */
module.exports = {
    important: false,
    content: [
        "src/views/**/*.twig",
        "src/assets/js/**/*.js",
        "node_modules/@salla.sa/twilight-tailwind-theme/safe-list-css.txt",
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
            screens: { '2xl': '1280px' }
        },
        fontFamily: {
            sans: ['var(--font-main)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            heading: ['var(--font-heading)', 'var(--font-main)'],
            // `font-primary` is referenced by Twilight web-component styles
            primary: 'var(--font-main)',
        },
        extend: {
            /* ---- Lumina design tokens ---- */
            colors: {
                primary: 'var(--color-primary)',
                'primary-dark': 'var(--color-primary-dark)',
                'primary-light': 'var(--color-primary-light)',
                'primary-tint': 'var(--color-primary-tint)',
                accent: 'var(--color-accent)',
                surface: 'var(--color-surface)',
                /* required by Twilight safe-list */
                'dark': '#1D1F1F',
                'darker': '#0E0F0F',
                'danger': '#AE0A0A',
            },
            transitionTimingFunction: {
                lumina: 'cubic-bezier(.22,1,.36,1)',
                elastic: 'cubic-bezier(0.55, 0, 0.1, 1)',
            },
            maxWidth: {
                container: 'var(--container)',
                '1/4': '25%', '1/2': '50%', '3/4': '75%',
            },

            /* ---- Required by Twilight safe-list CSS ---- */
            gridTemplateColumns: { 'auto-fill': 'repeat(auto-fill, 290px)' },
            spacing: {
                '3.75': '15px', '7.5': '30px', '58': '232px', '62': '248px',
                '100': '28rem', '116': '464px', '132': '528px', '200': '800px',
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
                sm: 'var(--radius-sm)',
                lg: 'var(--radius-lg)',
                'large': '22px', 'big': '40px', 'tiny': '3px',
            },
            fontSize: {
                'icon-lg': '33px', 'xxs': '10px', 'xxxs': '8px',
                'title-size': '42px', '22px': '22px',
            },
            lineHeight: {
                '12': '3rem', '14': '3.5rem', '16': '4rem', '18': '4.5rem', '20': '5rem',
            },
            boxShadow: {
                soft: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                'default': '5px 10px 30px #2B2D340D',
                'top': '0px 0px 10px #0000001A',
                'dropdown': '0 4px 8px rgba(161, 121, 121, 0.07)',
                'light': '0px 4px 15px rgba(1, 1, 1, 0.06)',
                'huge': '0px 3px 6px #00000029',
                'progress': '0 5px 15px rgba(92, 213, 196, 0.4)',
            },
            width: { '18': '4.5rem', '22': '5.5rem', '74': '18.5rem', '76': '19rem', '78': '19.5rem' },
            height: { 'banner': '200px', 'lg-banner': '428px', 'full-banner': '600px', '500': '500px', '460': '460px' },
            minWidth: { '1/4': '25%', '1/2': '50%', '3/4': '75%' },
            zIndex: { '1': '1', '2': '2', '-1': '-1' },
            screens: { 'xxs': { 'min': '380px', 'max': '479px' }, 'xs': '480px' },
            transitionProperty: { 'height': 'height' },
            keyframes: {
                slideUpFromBottom: { '0%': { transform: 'translateY(100%)', opacity: '0' }, '100%': { transform: 'translateY(0%)', opacity: '1' } },
                slideDownFromBottom: { '0%': { transform: 'translateY(0%)', opacity: '1' }, '100%': { transform: 'translateY(100%)', opacity: '0' } },
            },
            animation: {
                slideUpFromBottom: 'slideUpFromBottom .6s linear',
                slideDownFromBottom: 'slideDownFromBottom .6s linear',
            },
        },
    },
    corePlugins: { outline: false },
    plugins: [
        require('@salla.sa/twilight-tailwind-theme'),
        require('@tailwindcss/forms'),
    ],
};
