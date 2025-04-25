// Importing the isBluetoothAvailable function from the bluetooth module
import { isBluetoothAvailable } from './bluetooth';

/**
 * Function to check if the browser has enabled certain features.
 * @returns An object containing information about enabled features (Bluetooth, PDF viewer, Flash, Java).
 */
// Define an interface for the enabled information
// This interface defines the structure of the object returned by the getEnabled function
// It includes properties for Bluetooth, PDF viewer, Flash, and Java enabled status
interface EnabledInfo {
	bluetoothEnabled: boolean;
	pdfViewerEnabled: boolean;
	isFlashEnabled: boolean;
	isJavaEnabled: boolean;
}

/**
 * Function to get enabled features in the browser.
 * @returns An object containing information about enabled features (Bluetooth, PDF viewer, Flash, Java).
 */
export const getEnabled = async (): Promise<EnabledInfo> => {

	let isFlashEnabled : boolean = false;

	if (navigator?.plugins?.namedItem('Shockwave Flash')) {
		isFlashEnabled = true;
	} else {
		try {
			if (typeof ActiveXObject !== 'undefined') {
				const flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (flash) {
					isFlashEnabled = true;
				}
			}
		} catch (e) {
			isFlashEnabled = false;
		}
	}

	return {
		bluetoothEnabled: await isBluetoothAvailable(),
		pdfViewerEnabled: navigator.pdfViewerEnabled,
		isFlashEnabled,
		isJavaEnabled: navigator.javaEnabled(),
	};
};
