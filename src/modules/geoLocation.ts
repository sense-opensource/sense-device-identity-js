interface GeoLocation {
	latitude: number;
	longitude: number;
	accuracy: number;
	altitude: number | null;
	altitudeAccuracy: number | null;
	heading: number | null;
	speed: number | null;
	timestamp: number;
	enabled: boolean;
	error?: string;
}
export const geoLocation = (): Promise<GeoLocation | { error: string }> => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						accuracy: position.coords.accuracy,
						altitude: position.coords.altitude,
						altitudeAccuracy: position.coords.altitudeAccuracy,
						heading: position.coords.heading,
						speed: position.coords.speed,
						timestamp: position.timestamp,
						enabled: true,
					});
				},
				(error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							resolve({ error: 'User denied the request for Geolocation.' });
							break;
						case error.POSITION_UNAVAILABLE:
							resolve({ error: 'Location information is unavailable.' });
							break;
						case error.TIMEOUT:
							resolve({ error: 'The request to get user location timed out.' });
							break;
						default:
							resolve({ error: 'An unknown error occurred.' });
							break;
					}
				},
			);
		} else {
			reject(new Error('No support for Geolocation'));
		}
	});
};
