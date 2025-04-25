// This function checks if the browser is a "lied" browser.
// A "lied" browser is one that has a specific user agent string or product sub value.

// It returns true if the browser is a "lied" browser, false otherwise.
// If the browser is not recognized, it returns undefined.
export const getLiedBrowser = (): boolean | void => {
	const userAgent = navigator.userAgent.toLowerCase();
	const productSub = navigator.productSub;
	let browserName: string;

	if (
		userAgent.includes('edge/') ||
		userAgent.includes('iemobile/') ||
		userAgent.includes('opera mini')
	) {
		return false;
	}

	if (userAgent.includes('firefox/')) {
		browserName = 'Firefox';
	} else if (userAgent.includes('opera/') || userAgent.includes(' opr/')) {
		browserName = 'Opera';
	} else if (userAgent.includes('chrome/')) {
		browserName = 'Chrome';
	} else if (userAgent.includes('safari/')) {
		if (
			userAgent.includes('android 1.') ||
			userAgent.includes('android 2.') ||
			userAgent.includes('android 3.') ||
			userAgent.includes('android 4.')
		) {
			browserName = 'AOSP';
		} else {
			browserName = 'Safari';
		}
	} else if (userAgent.includes('trident/')) {
		browserName = 'Internet Explorer';
	} else {
		browserName = 'Other';
	}

	if (
		(browserName === 'Chrome' ||
			browserName === 'Safari' ||
			browserName === 'Opera') &&
		productSub !== '20030107'
	) {
		return false;
	}

	const evalLength = eval.toString().length;

	if (
		evalLength === 37 &&
		browserName !== 'Safari' &&
		browserName !== 'Firefox' &&
		browserName !== 'Other'
	) {
		return true;
	}

	if (
		evalLength === 39 &&
		browserName !== 'Internet Explorer' &&
		browserName !== 'Other'
	) {
		return true;
	}

	if (
		evalLength === 33 &&
		browserName !== 'Chrome' &&
		browserName !== 'AOSP' &&
		browserName !== 'Opera' &&
		browserName !== 'Other'
	) {
		return true;
	}

	let a: boolean;
	try {
		throw new Error('a');
	} catch (err: any) {
		try {
			err.toSource();
			a = true;
		} catch (e) {
			a = false;
		}
	}

	if (a && browserName !== 'Firefox' && browserName !== 'Other') {
		return true;
	}

	return false;
};

/**
 * This function checks if the browser is a "lied" language.
 * A "lied" language is one that has a specific language code or navigator.language value.
 * It returns true if the language is a "lied" language, false otherwise.
 * If the language is not recognized, it returns undefined.
 * @returns {boolean} - Returns true if the language is a "lied" language, false otherwise.
 * */
export const liedLanguages = (): boolean => {
	if (typeof navigator.languages !== 'undefined') {
		try {
			const langMatch = navigator.languages[0].substring(0, 2) !== navigator.language.substring(0, 2);
			if (langMatch) {
				return true;
			}
		} catch (error) {
			return true;
		}
	}
	return false;
};

/**
 * This function checks if the browser is a "lied" OS.
 * A "lied" OS is one that has a specific user agent string or OS CPU value.
 * It returns true if the OS is a "lied" OS, false otherwise.
 * If the OS is not recognized, it returns undefined.
 */
export const liedOS = (): boolean | void => {
	const r = navigator.userAgent.toLowerCase();
	let m = navigator.oscpu;
	const n = navigator.platform.toLowerCase();
	let e: string;

	if (r.includes('windows phone')) {
		e = 'Windows Phone';
	} else if (r.includes('windows') || r.includes('win16') || r.includes('win32') || r.includes('win64') || r.includes('win95') || r.includes('win98') || r.includes('winnt') || r.includes('wow64')) {
		e = 'Windows';
	} else if (r.includes('android')) {
		e = 'Android';
	} else if (r.includes('linux') || r.includes('cros') || r.includes('x11')) {
		e = 'Linux';
	} else if (r.includes('iphone') || r.includes('ipad') || r.includes('ipod') || r.includes('crios') || r.includes('fxios')) {
		e = 'iOS';
	} else if (r.includes('macintosh') || r.includes('mac_powerpc)')) {
		e = 'Mac';
	} else {
		e = 'Other';
	}

	if (('ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator.maxTouchPoints ?? (navigator as any).msMaxTouchPoints ?? 0)) &&
		e !== 'Windows' && e !== 'Windows Phone' && e !== 'Android' && e !== 'iOS' && e !== 'Other' && !r.includes('cros')) {
		return true;
	}	
	if (void 0 !== m) {
		m = m.toLowerCase();
		if (m.includes('win') && e !== 'Windows' && e !== 'Windows Phone')
			return true;
		if (m.indexOf('linux') >= 0 && 'Linux' !== e && 'Android' !== e)
			return true;
		if (m.indexOf('mac') >= 0 && 'Mac' !== e && 'iOS' !== e) return true;
		if (
			(-1 === m.indexOf('win') &&
				-1 === m.indexOf('linux') &&
				-1 === m.indexOf('mac')) !=
			('Other' === e)
		)
			return true;
	}
	return (
		(n.indexOf('win') >= 0 && 'Windows' !== e && 'Windows Phone' !== e) ||
		((n.indexOf('linux') >= 0 ||
			n.indexOf('android') >= 0 ||
			n.indexOf('pike') >= 0) &&
			'Linux' !== e &&
			'Android' !== e) ||
		((n.indexOf('mac') >= 0 ||
			n.indexOf('ipad') >= 0 ||
			n.indexOf('ipod') >= 0 ||
			n.indexOf('iphone') >= 0) &&
			'Mac' !== e &&
			'iOS' !== e) ||
		(!(n.indexOf('arm') >= 0 && 'Windows Phone' === e) &&
			!(n.indexOf('pike') >= 0 && r.indexOf('opera mini') >= 0) &&
			((n.indexOf('win') < 0 &&
				n.indexOf('linux') < 0 &&
				n.indexOf('mac') < 0 &&
				n.indexOf('iphone') < 0 &&
				n.indexOf('ipad') < 0 &&
				n.indexOf('ipod') < 0) !=
				('Other' === e) ||
				(void 0 === navigator.plugins &&
					'Windows' !== e &&
					'Windows Phone' !== e)))
	);
};
