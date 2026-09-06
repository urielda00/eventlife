import { useColorMode } from '../../context/ColorModeContext';
import * as styles from '../../styles/components/ThemeToggle.styles';

export const ThemeToggle = () => {
	const { mode, toggleMode } = useColorMode();
	const isDark = mode === 'dark';

	return (
		<styles.ToggleButton onClick={toggleMode} aria-label='Toggle color mode'>
			<styles.Icon role='img' aria-hidden='true'>
				{isDark ? '🌙' : '☀️'}
			</styles.Icon>
			<styles.Dot />
			<styles.Label>{isDark ? 'Dark' : 'Light'}</styles.Label>
		</styles.ToggleButton>
	);
};

export default ThemeToggle;
