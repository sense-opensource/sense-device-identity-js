// Define the BatteryManager interface
interface BatteryManager {
	charging: boolean;
	chargingTime: number;
	dischargingTime: number;
	level: number;
}

/**
 * Function to get battery details using Promises.
 * @returns A Promise that resolves to a BatteryManager object or null if an error occurs.
 */
export function getBatteryDetails(): Promise<BatteryManager | null> {
	return new Promise((resolve) => {
		if (
			'getBattery' in navigator &&
			typeof navigator.getBattery === 'function'
		) {
			navigator
				.getBattery()
				.then((battery: BatteryManager) => {
					resolve({
						charging: battery.charging,
						chargingTime: battery.chargingTime,
						dischargingTime: battery.dischargingTime,
						level: battery.level,
					});
				})
				.catch((error: any) => {
					resolve(null); // Resolve with null in case of an error
				});
		} else {
			resolve(null); // Resolve with null if the API is not supported
		}
	});
}
