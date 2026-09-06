import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/globalStyle';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Router from './router';

import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider, useColorMode } from './context/ColorModeContext';

// App shell wrapped with both Auth and Theme providers
const AppContent = () => {
	const { theme } = useColorMode();

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<AuthProvider>
				<Navbar />
				<Router />
				<Footer />
			</AuthProvider>
		</ThemeProvider>
	);
};

export default function App() {
	return (
		<BrowserRouter>
			<ColorModeProvider>
				<AppContent />
			</ColorModeProvider>
		</BrowserRouter>
	);
}

