import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ColorModeProvider } from './context/ColorModeContext';
import { EventProvider } from './context/EventContext.jsx';

createRoot(document.getElementById('root')).render(
	// <StrictMode>
	<ColorModeProvider>
		<EventProvider>
			<App />
		</EventProvider>
	</ColorModeProvider>
	// </StrictMode>
);
