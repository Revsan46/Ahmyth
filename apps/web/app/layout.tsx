export const metadata = {
	title: 'Chat',
	manifest: '/manifest.webmanifest',
	themeColor: '#0ea5e9',
};
export default function RootLayout({ children }: any) {
	return (
		<html lang="en">
			<body>
				<div id="app">{children}</div>
				<script defer src="/sw.js" />
			</body>
		</html>
	);
}