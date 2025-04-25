import { getBatteryDetails } from './modules/battery';
import { isBluetoothAvailable } from './modules/bluetooth';
import getBrowser from './modules/browser';
import { getNetworkConnectionInfo } from './modules/connection';
import { getLanguage } from './modules/language';
import { getZoneDetails } from './modules/zone';
import { detectWebRTC } from './modules/webRTC';
import { getDevice } from './modules/device';
import { getScreen } from './modules/screen';
import { getCookie } from './modules/cookie';
import { getEnabled } from './modules/enabled';
import { plugins } from './modules/plugins';
import { getMedia } from './modules/media';
import { geoLocation } from './modules/geoLocation';
import { x64hash128 } from './utils/senseHashing';
import { getEncodedData } from './utils/encodedData';

interface SenseInfo {
	allowGeoLocation: boolean;
}
interface BrowserData {
	isDarkMode?: boolean; // Optional
	// or:
	// isDarkMode: boolean | undefined;
}
/**
 * Function to get all Sense details.
 * @returns An object containing all the details (battery, zone, language, network, Bluetooth).
 */
export const init = async (senseInfo: SenseInfo) => {

	/**
	 * Metadata representing the client's runtime environment importent browser informaion,
	 * used for diagnostics, analytics, or feature support checks.
	 */
	const deviceMetaInfo = {
		language: getLanguage(),
		bluetooth: await isBluetoothAvailable(),
		device: getDevice(),
		plugins: plugins(),
		media: await getMedia(),
		browser : await getBrowser() as BrowserData
	}

	/**
	 * Device Information
	 */
	const data = {
		battery: await getBatteryDetails(),
		zone: getZoneDetails(),
		...deviceMetaInfo,
		webRTC: await detectWebRTC(),
		screen: getScreen(),
		connection: getNetworkConnectionInfo(),
		cookie: getCookie(),
		enabled: await getEnabled(),
		location: senseInfo.allowGeoLocation
			? await geoLocation()
			: { enabled: 'Not Available' },
	}
	deviceMetaInfo.browser.isDarkMode = undefined;

	const encodedMeta = getEncodedData(JSON.stringify(deviceMetaInfo));
	try {
		return {
			getDeviceDetails: data,
			getDeviceId: x64hash128(JSON.stringify(encodedMeta))
		};
	} catch (error) {
		return null; // Return null in case of any error
	}// NOSONAR
};
