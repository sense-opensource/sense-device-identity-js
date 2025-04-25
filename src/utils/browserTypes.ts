/**
 * Interface representing the browser information.
 */
export interface BrowserInfo {
	browserName: string; // Name of the browser (e.g., "Chrome", "Firefox")
	browserVersion: string; // Version of the browser (e.g., "91.0")
	browserType: BrowserType; // Object containing boolean flags for browser types
}

/**
 * Interface representing the browser type flags.
 */
export interface BrowserType {
	isEdge?: boolean;
	isOpera?: boolean;
	isSafari?: boolean;
	isChrome?: boolean;
	isFirefox?: boolean;
	isIE?: boolean;
	isOthers?: boolean;
}

/**
 * Function to get browser information.
 * @returns An object containing the browser information.
 */
export const getInfo = (): BrowserInfo => {
	const ua: string = navigator.userAgent;
	let browserName: string;
	let browserVersion: string = 'Unknown';
	const browserType: BrowserType = {};

	if (ua.match(/edg/i)) {
		browserName = 'Edge';
		browserVersion = ua.match(/edg\/(\d+\.\d+)/i)?.[1] || 'Unknown';
		browserType.isEdge = true;
	} else if (ua.match(/opr\//i)) {
		browserName = 'Opera';
		browserVersion = ua.match(/opr\/(\d+\.\d+)/i)?.[1] || 'Unknown';
		browserType.isOpera = true;
	} else if (ua.match(/safari/i) && !ua.match(/chrome|crios|chromium/i)) {
		browserName = 'Safari';
		browserVersion = ua.match(/version\/(\d+\.\d+)/i)?.[1] || 'Unknown';
		browserType.isSafari = true;
	} else if (ua.match(/chrome|chromium|crios/i)) {
		browserName = 'Chrome';
		browserVersion =
			ua.match(/(?:chrome|crios|chromium)\/(\d+\.\d+)/i)?.[1] || 'Unknown';
		browserType.isChrome = true;
	} else if (ua.match(/firefox|fxios/i)) {
		browserName = 'Firefox';
		browserVersion =
			ua.match(/(?:firefox|fxios)\/(\d+\.\d+)/i)?.[1] || 'Unknown';
		browserType.isFirefox = true;
	} else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1) {
		browserName = 'Internet Explorer';
		const msieIndex = ua.indexOf('MSIE ');
		if (msieIndex > -1) {
			browserVersion = parseInt(
				ua.substring(msieIndex + 5, ua.indexOf('.', msieIndex)),
				10,
			).toString();
		}
		const tridentIndex = ua.indexOf('Trident/');
		if (tridentIndex > -1) {
			const rvIndex = ua.indexOf('rv:');
			browserVersion = parseInt(
				ua.substring(rvIndex + 3, ua.indexOf('.', rvIndex)),
				10,
			).toString();
		}
		browserType.isIE = true;
	} else {
		browserName = 'Others';
		browserType.isOthers = true;
	}

	return { browserName, browserVersion, browserType };
};
