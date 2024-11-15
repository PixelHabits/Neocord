export const getCsrfToken = (): string => {
	return (
		document.cookie
			.split('; ')
			.find((row) => row.startsWith('csrf_token='))
			?.split('=')[1] ?? ''
	);
};
