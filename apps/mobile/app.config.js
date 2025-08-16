export default ({ config }) => ({
	...config,
	extra: {
		...config.extra,
		EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
		EXPO_PUBLIC_WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000/ws'
	}
});