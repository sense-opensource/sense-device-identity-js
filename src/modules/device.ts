import { Hashing } from '../utils/hashing';

//  * Get the device information
//  * @returns {object} An object containing device information
//  */
interface GetDevice {
	os: string;
	platform: string;
	touchSupport: boolean;
	deviceMemory: number;
	hardwareConcurrency: number;
	deviceHash: string;
	deviceTypes: {
		isDesktop: boolean;
		isMobile: boolean;
		isTablet: boolean;
		isWindows: boolean;
		isLinux: boolean;
		isLinux64: boolean;
		isAndroid: boolean;
		isMac: boolean;
		isIPad: boolean;
		isIPhone: boolean;
		isIPod: boolean;
		isSmartTV: boolean;
	};
}

/**
 * Function to get device information.
 * @returns An object containing device information
 */
export const getDevice = (): GetDevice => {
	const ua = navigator.userAgent.toLowerCase();
	const touchSupport: boolean =
		'ontouchstart' in window ||
		(navigator.maxTouchPoints ?? 0) > 0 ||
		(navigator.msMaxTouchPoints ?? 0) > 0;
	const isMobile = Boolean(/(iPad|iPhone|iPod|android|webOS)/i.exec(navigator.userAgent));
	const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
	const isWindows = /(win32|win64|windows|wince)/i.test(ua);
	const isMac = /(macintosh|macintel|macppc|mac68k|macos)/i.test(ua);
	const isAndroid = ua.indexOf('android') > -1;
	const isLinux = ua.includes('Linux');
	const isLinux64 = ua.includes('Linux') && ua.includes('x86_64');
	let platform = navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
		os = null;

	if (/android/i.test(ua)) {
		os = 'Android';
	} else if (macosPlatforms.indexOf(platform) !== -1 || /Mac/.test(platform)) {
		os = 'Mac OS';
	} else if (
		iosPlatforms.indexOf(platform) !== -1 ||
		(/iPad|iPhone|iPod/.test(ua) && !window.MSStream)
	) {
		os = 'iOS';
	} else if (
		windowsPlatforms.indexOf(platform) !== -1 ||
		/Win/.test(platform)
	) {
		os = 'Windows';
	} else if (/Linux/.test(platform)) {
		os = 'Linux';
	} else {
		os = 'Others';
	}
	return {
		os,
		platform: navigator.platform,
		touchSupport,
		deviceMemory: navigator.deviceMemory ?? 0,
		hardwareConcurrency: navigator.hardwareConcurrency || 0,
		deviceHash: Hashing(JSON.stringify(navigator.userAgent)),
		deviceTypes: {
			isDesktop: !isMobile && !isTablet,
			isMobile: isMobile,
			isTablet: isTablet,
			isWindows: isWindows,
			isLinux: isLinux,
			isLinux64: isLinux64,
			isAndroid: isAndroid,
			isMac: isMac,
			isIPad: ['iPad Simulator', 'iPad'].includes(navigator.platform),
			isIPhone: ['iPhone Simulator', 'iPhone'].includes(navigator.platform),
			isIPod: ['iPod Simulator', 'iPod'].includes(navigator.platform),
			isSmartTV: /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast\.tv/gi.test(ua.toLowerCase())
		},
	};
};
