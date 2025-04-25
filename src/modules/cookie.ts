// This file is part of the "cookie" module.
// It provides functionality to check if cookies are enabled in the browser,
// retrieve cookie information, and hash the cookie data.
// It also includes an interface to define the structure of the cookie information object.

import { Hashing } from '../utils/hashing';

// Define an interface for the cookie information
interface CookieInfo {
	cookieEnabled: boolean;
	cookieIds: string;
	cookieHash: string | null;
	cookieWipedOut: boolean | null;
}

/**
 * Function to get cookie information.
 * @returns An object containing cookie information (enabled status, IDs, hash, and wiped out status).
 */
export const getCookie = (): CookieInfo => {
	return {
		cookieEnabled: navigator.cookieEnabled,
		cookieIds: document.cookie,
		cookieHash: document.cookie
			? Hashing(JSON.stringify(document.cookie))
			: null,
		cookieWipedOut:
			"undefined" === typeof document
				? null
				: document.cookie.length === 0,
	};
};
