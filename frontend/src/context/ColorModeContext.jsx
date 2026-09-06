import { darkTheme, lightTheme } from '../styles/theme';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Key used for persistence
const THEME_KEY = 'eventlife-color-mode';

const ColorModeContext = createContext({
	mode: 'dark',
	toggleMode: () => {},
	theme: darkTheme,
});

export const ColorModeProvider = ({ children }) => {
	// Detect system preference once on first load
	const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

	const [mode, setMode] = useState(() => {
		const stored = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
		if (stored === 'light' || stored === 'dark') return stored;
		return systemPrefersDark ? 'dark' : 'light';
	});

	useEffect(() => {
		localStorage.setItem(THEME_KEY, mode);
	}, [mode]);

	useEffect(() => {
		// Keep html[data-theme] for optional global CSS hooks if needed
		document.documentElement.setAttribute('data-theme', mode);
	}, [mode]);

	const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

	const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

	const value = useMemo(() => ({ mode, toggleMode, theme }), [mode, theme]);

	return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = () => useContext(ColorModeContext);
