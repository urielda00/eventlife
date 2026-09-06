import footerLinks from '../../assets/data/footerLinks.json';
import * as styles from '../../styles/components/Footer.styles';

export default function Footer() {
	return (
		<styles.Wrapper>
			<styles.Content>
				<styles.Brand>EventLife</styles.Brand>

				<styles.Links aria-label='Footer navigation'>
					{footerLinks.map(({ to, label }) => (
						<styles.FooterLink key={to} to={to}>
							{label}
						</styles.FooterLink>
					))}
				</styles.Links>

				<styles.Copy>&copy; {new Date().getFullYear()} EventLife. All rights reserved.</styles.Copy>
			</styles.Content>
		</styles.Wrapper>
	);
}
