// Export only if you're in a module-based environment
export interface Bluetooth {
	getAvailability(): Promise<boolean>;
}

/**
 * Checks whether Bluetooth is available in the browser.
 * @returns Promise<boolean> - True if Bluetooth is available, otherwise false.
 */
export async function isBluetoothAvailable(): Promise<boolean> {
	if (!navigator.bluetooth) {
		return false;
	}

	try {
		const availability: boolean = await navigator.bluetooth.getAvailability();
		console.log(availability);
		return availability;
	} catch (error) {
		console.log(`Blutooth is available : ${error}`);
		return false;
	}
}
