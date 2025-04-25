// Define or import the LanguageInfo type
type LanguageInfo = {
	primaryLanguage: string;
	allLanguages: string[];
};

export const getLanguage = (): LanguageInfo & { locale: string } => {
	const primaryLanguage = navigator.language || 'unknown';
	const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';

	return {
		primaryLanguage,
		allLanguages: Array.from(navigator.languages) || ['unknown'],
		locale, // Locale information (e.g., "en-US")
	};
};
