// This file is deprecated and will be removed once custom backend API is integrated
// Keeping minimal structure for now

const getAppParams = () => {
	return {
		appId: null,
		token: null,
		fromUrl: typeof window !== 'undefined' ? window.location.href : null,
		functionsVersion: null,
		appBaseUrl: null,
	}
}

export const appParams = {
	...getAppParams()
}
