/**
 * Interface representing network connection information.
 */
interface NetworkConnectionInfo {
	type: string | null; // The type of connection (e.g., "wifi", "cellular")
	effectiveType: string | null; // The effective connection type (e.g., "4g", "3g")
	downlink: number | null; // The estimated download bandwidth in Mbps
	rtt: number | null; // The estimated round-trip time in milliseconds
	saveData: boolean | null; // Whether the user has enabled data saver mode
	isMetered: boolean | null; // Whether the connection is metered
}

/**
 * Function to get network connection information.
 * @returns A NetworkConnectionInfo object with details about the user's network connection.
 */
export const getNetworkConnectionInfo = (): NetworkConnectionInfo => {
	const connection =
		(navigator as any).connection ??
		(navigator as any).mozConnection ??
		(navigator as any).webkitConnection;

	if (!connection) {
		console.warn(
			'The Network Information API is not supported in this browser.',
		);
		return {
			type: null,
			effectiveType: null,
			downlink: null,
			rtt: null,
			saveData: null,
			isMetered: null,
		};
	}

	return {
		type: connection.type ?? null,
		effectiveType: connection.effectiveType ?? null,
		downlink: connection.downlink ?? null,
		rtt: connection.rtt ?? null,
		saveData: connection.saveData ?? null,
		isMetered: connection.metered ?? null,
	};
};
