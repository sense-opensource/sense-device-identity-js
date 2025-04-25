/**
 * Interface representing browser details.
 */

import { getInfo, BrowserInfo } from '../utils/browserTypes';
import {
	getWebGLRenderer,
	getUnmaskedWebGLRenderer,
	hasAddBehavior,
} from '../utils/webGlRender'; // Import the WebRTC detection function
import { Hashing } from '../utils/hashing'; // Import the WebRTC detection function
import { getFonts } from '../utils/fonts';
import { webGlDetails } from '../utils/webGl';
import { getCanvas } from '../utils/canvas';
import { getLiedBrowser, liedLanguages, liedOS } from '../utils/liedData';
export interface BrowserDetails {
	browserVendor: string; // The browser vendor (e.g., "Google Inc.")
	oscpu?: string; // The operating system's CPU information (may not be available in all browsers)
	isDarkMode: boolean; // Boolean indicating if dark mode is enabled
	userAgent: string; // The user agent string of the browser
	browserName: string; // The name of the browser (e.g., "Brave", "Chrome")
	browserVersion: string; // The version of the browser (e.g., "96.0.4664.45")
	browserType: object; // Browser type flags (e.g., "desktop", "mobile")
	productSub?: string; // Product sub-version (optional)
	vendorSub?: string; // Vendor sub-version (optional)
	onLine: boolean; // Online status
	windowLocation: string; // JSON stringified window location
	windowOrigin: string; // The origin of the window
	referrer: string; // Document referrer
	webdriver?: string; // WebDriver status (optional)
	isSecureContext: boolean; // Secure context status
	doNotTrack: boolean | null; // Do Not Track status
	isExtended: boolean; // Whether the screen is extended
	browserHash: string; // Hash of the browser details
	webglVendorAndRenderer: string; // WebGL vendor and renderer information
	webglUnmaskedVendorAndRenderer: string; // Unmasked WebGL vendor and renderer information
	addBehavior: boolean; // Whether addBehavior is supported
	cpuClass: string; // CPU class (optional)
	eval: number; // Length of the eval function as a string
	fonts: {
		fonts: string[]; // List of fonts,
		fontHash: string; // Hash of the fonts
		fontsCount: number; // Count of the fonts
	}; // List of fonts
	localStorage: boolean; // Whether localStorage is supported
	sessionStorage: boolean; // Whether sessionStorage is supported
	indexedDb: boolean; // Whether indexedDb is supported
	openDatabase: boolean; // Whether the browser supports `window.openDatabase`
	webGl: string | null; // WebGL hash
	webGlHash: string | null; // WebGL hash
	canvas: string | null; // Canvas hash
	canvasHash: string | null; // Canvas hash
	hasLiedLanguages: boolean | void; // Check if the browser has lied about languages
	hasLiedBrowser: boolean | void; // Check if the browser has lied about the browser
	hasLiedOs: boolean | void; // Check if the browser has lied about the OS
	hasLiedResolution: boolean; // Check if the browser has lied about the resolution
}
/// Extend the Navigator interface
interface LegacyNavigator extends Navigator {
	cpuClass?: string;
}
/**
 * Extend the Window interface to include openDatabase.
 */
declare global {
	interface Window {
		openDatabase?: any;
	}
}

/**
 * Function to get browser details.
 * @returns A Promise that resolves to an object containing browser details.
 */
export default async function getBrowser(): Promise<BrowserDetails> {
	let isDarkMode = false;
	let brave = false;
	let do_not_track: any = ''; // Declare the variable with an initial value
	const screenDetails: Screen = screen || window.screen; // Type assertion to ExtendedScreen
	// Detect dark mode
	try {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode = mq.matches; // Check if dark mode is enabled
	} catch (error) {
		isDarkMode = false; // Default to false if an error occurs
	}

	// Detect Brave browser
	if ((navigator as any).brave?.isBrave?.()) {
		brave = true;
	}

	// Detect Do Not Track
	try {
		const navigatorDoNotTrack = navigator.doNotTrack;
		const windowDoNotTrack = (window as any).doNotTrack;

		if (
			navigatorDoNotTrack === '1' ||
			windowDoNotTrack === '1' ||
			navigatorDoNotTrack === 'yes'
		) {
			do_not_track = true;
		} else if (
			navigatorDoNotTrack === '0' ||
			windowDoNotTrack === '0' ||
			navigatorDoNotTrack === 'no'
		) {
			do_not_track = false;
		} else {
			do_not_track = null;
		}
	} catch (error) {
		do_not_track = null; // Default to null if an error occurs
	}

	// Get browser name and version using getInfo from BrowserTypes
	const browserInfo: BrowserInfo = getInfo();

	const browserName = brave ? 'Brave' : browserInfo.browserName;
	const legacyNavigator = navigator as LegacyNavigator;

	const browserObj = {
		browserName,
		browserVersion: browserInfo.browserVersion,
		userAgent: navigator.userAgent || '',
		browserVendor: navigator.vendor || '',
		colorDepth: screenDetails.colorDepth || 24, // Default to 24 if colorDepth is not available
	};
	const fonts = getFonts();
	const webGlInfo = webGlDetails();
	const canvasInfo = getCanvas();
	return {
		userAgent: navigator.userAgent || '', // User agent string
		browserName, // Use Brave if detected, otherwise use browserName from getInfo
		browserVersion: browserInfo.browserVersion, // Browser version
		browserType: browserInfo.browserType, // Browser type flags
		browserVendor: navigator.vendor || '', // Browser vendor
		productSub: navigator.productSub || '', // Product sub-version
		vendorSub: navigator.vendorSub || '', // Vendor sub-version
		onLine: navigator.onLine, // Online status
		windowLocation: JSON.stringify(window.location), // Window location
		windowOrigin: window.location.origin, // Window origin
		referrer: document.referrer, // Document referrer
		webdriver:
			null === (navigator as any).webdriver
				? 'Not Available'
				: String(navigator.webdriver), // WebDriver status
		isSecureContext: window.isSecureContext, // Secure context status
		doNotTrack: do_not_track, // Do Not Track status
		oscpu: 'oscpu' in navigator ? (navigator as any).oscpu : undefined, // OS CPU information (optional)
		isExtended: screenDetails.isExtended || false,
		browserHash: Hashing(JSON.stringify(browserObj)),
		hasLiedBrowser: getLiedBrowser(), // Check if the browser has lied about its identity
		hasLiedOs: liedOS(), // Check if the browser has lied about the OS
		hasLiedResolution:
			window.screen.width < window.screen.availWidth ||
			window.screen.height < window.screen.availHeight,
		hasLiedLanguages: liedLanguages(), // Check if the browser has lied about languages
		webGl: webGlInfo.webGl,
		webGlHash: webGlInfo.webGlHash,
		canvas: canvasInfo.canvas,
		canvasHash: canvasInfo.canvasHash,
		webglVendorAndRenderer: getWebGLRenderer(), // WebGL vendor and renderer information
		webglUnmaskedVendorAndRenderer: getUnmaskedWebGLRenderer(), // Unmasked WebGL vendor and renderer
		addBehavior: hasAddBehavior, // Check if addBehavior is supported
		cpuClass: legacyNavigator.cpuClass ?? 'Not Available', // CPU class (optional)
		eval: eval.toString().length,
		isDarkMode, // Return the dark mode status as a boolean
		fonts, // Get the list of fonts
		localStorage: !!window.localStorage,
		sessionStorage: !!window.sessionStorage,
		indexedDb: !!window.indexedDB,
		openDatabase: !!window.openDatabase,
	};
}
