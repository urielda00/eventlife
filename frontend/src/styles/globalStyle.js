import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => (theme.mode === "dark" ? "dark" : "light")};
  }

  * { 
    box-sizing: border-box; 
  }

  html, body, #root { 
    height: 100%; 
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    transition: background-color 250ms ease, color 250ms ease;

    /* 🔒 תיקון נגד גלילה אופקית */
    overflow-x: hidden;
  }

  /* אם הדפדפן תומך ב-clip, זה עדיף מ-hidden */
  @supports (overflow: clip) {
    body {
      overflow-x: clip;
    }
  }

  /* ==== Links ==== */
  a {
    text-decoration: none;
    color: inherit;
    transition: color 200ms ease;
  }

  /* שינוי צבע hover רק ללינקים טקסטואליים */
  p a:hover,
  li a:hover,
  .prose a:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  /* קישורים שהם בעצם כפתורים (CTA, Join וכו') */
  a[role="button"],
  a.button,
  a.btn,
  a.cta {
    color: inherit;
  }

  a[role="button"]:hover,
  a.button:hover,
  a.btn:hover,
  a.cta:hover {
    color: inherit;
    -webkit-text-fill-color: currentColor; /* Safari fix */
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #0B0F18;
  }

  /* Utility class for cards */
  .card-surface {
    background: ${({ theme }) => theme.colors.card};
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.card};
    border-radius: ${({ theme }) => theme.radius["2xl"]};
    transition: background-color 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
  }

  /* Headings styling */
  h1, h2 {
    letter-spacing: -0.02em;
    text-shadow: ${({ theme }) =>
      theme.mode === "light"
        ? "0 1px 0 rgba(0,0,0,0.12)"
        : "0 0 28px rgba(0,255,255,0.6), 0 0 10px rgba(0,255,255,0.35)"};
    transition: text-shadow 250ms ease, color 250ms ease;
  }
`;
