// This module provides a function to access the Battery Status API.
interface ZoneManager {
	timestamp: number; // Unix timestamp in milliseconds
	timezone: string; // IANA timezone string, e.g., "Asia/Calcutta"
	timezoneCountry: string; // Human-readable timezone info, e.g., "GMT+0530 (India Standard Time)"
	timeStampDelta: {
		clientDate: string; // Date string in the client's timezone
		senseDate: string; // Date string in the Sense's timezone
		differenceDay: string; // Difference in days
		differenceHours: string; // Difference in hours
		differenceMinutes: string; // Difference in minutes
		differenceSeconds: string; // Difference in seconds
	};
}

export const getZoneDetails = (): ZoneManager => {
	let date1, date2;
	date1 = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
	date2 = new Date().toLocaleString('en-US', {
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});
	const time_difference = new Date(date2).getTime() - new Date(date1).getTime();
	const days = Math.round(time_difference / (1000 * 60 * 60 * 24));
	const hours = time_difference / 36e5;
	const minutes = Math.round(time_difference / 1000 / 60);
	const seconds = time_difference / 1000;

	return {
		timestamp: Date.now(),
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		timezoneCountry: new Date().toTimeString().slice(9),
		timeStampDelta: {
			clientDate: date2,
			senseDate: date1,
			differenceDay: `${days} ${days <= 1 ? 'day' : 'days'}`,
			differenceHours: `${hours} hrs`,
			differenceMinutes: `${minutes} mins`,
			differenceSeconds: `${seconds} seconds`,
		},
	};
};
