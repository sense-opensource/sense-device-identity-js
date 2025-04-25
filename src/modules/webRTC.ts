/**
 * Interface representing WebRTC details.
 */
export interface WebRTCDetails {
	isSupported: boolean; // Whether WebRTC is supported
	ipCount: number; // Number of unique IPs detected
	webRTCIPs: string[]; // List of detected IPs
	ipV4: string | null; // Detected IPv4 address (if any)
	ipV6: string | null; // Detected IPv6 address (if any)
	ipLocal: string | null; // Detected local IP address (if any)
}

/**
 * Function to detect WebRTC support and gather IP addresses.
 * @returns A Promise that resolves to an object containing WebRTC details.
 */
export const detectWebRTC = async (): Promise<WebRTCDetails> => {
	try{
		let isWebRTCSupported = false;

		// Check if WebRTC is supported
		const webRTCItems = [
			'RTCPeerConnection',
			'webkitRTCPeerConnection',
			'mozRTCPeerConnection',
			'RTCIceGatherer',
		];
		webRTCItems.forEach((item) => {
			if (item in window) {
				isWebRTCSupported = true;
			}
		});

		const RTCPeerConnection =
			window.RTCPeerConnection ||
			(window as any).mozRTCPeerConnection ||
			(window as any).webkitRTCPeerConnection;

		if (!RTCPeerConnection) {
			return {
				isSupported: false,
				ipCount: 0,
				webRTCIPs: [],
				ipV4: null,
				ipV6: null,
				ipLocal: null,
			};
		}

		const peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		const ips = new Set<string>();

		// Function to handle ICE candidates and extract IP addresses
		const handleCandidate = (candidate: string): void => {
			const ipRegex = /(\d{1,3}(\.\d{1,3}){3}|[a-f\d]{1,4}(:[a-f\d]{1,4}){7})/;
			const match = ipRegex.exec(candidate);
			if (match) {
				ips.add(match[0]);
			}
		};
		peerConnection.onicecandidate = (ice) => {
			if (ice.candidate) {
				handleCandidate(ice.candidate.candidate);
			}
		};
		peerConnection.addEventListener('iceconnectionstatechange', () => {
			if (peerConnection.iceConnectionState === 'failed') {
				console.warn('ICE connection failed. Consider using a TURN server.');
			}
		});

		// Create a data channel to trigger ICE gathering
		peerConnection.createDataChannel('sense');

		// Create an offer and set it as the local description
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		// Wait for ICE gathering to complete
		await new Promise<void>((resolve) => {
			if (peerConnection.iceGatheringState === 'complete') {
				resolve();
			} else {
				const timeout = setTimeout(() => {
					console.warn('ICE gathering timed out');
					resolve(); // Still resolve to prevent hanging
				}, 3000); // Optional timeout
				peerConnection.onicegatheringstatechange = () => {
					if (peerConnection.iceGatheringState === 'complete') {
						clearTimeout(timeout);
						resolve();
					}
				};
			}
		});

		peerConnection.close();

		// Extract IP addresses
		const ipList = Array.from(ips);
		let ipV4: string | null = null;
		let ipV6: string | null = null;
		let ipLocal: string | null = null;

		for (let i = 0; i < ipList.length; i++) {
			if (
				ipList[i].match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)
			) {
				ipLocal = ipList[i];
			} else if (ipList[i].match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)) {
				ipV6 = ipList[i];
			} else if (
				ipList[i].match(/^(?!0\.0\.0\.0$)((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/)
			) {
				ipV4 = ipList[i];
			}
		}
		return {
			isSupported: isWebRTCSupported,
			ipCount: ipList.length,
			webRTCIPs: ipList,
			ipV4: ipV4 ?? null,
			ipV6: ipV6 ?? null,
			ipLocal: ipLocal ?? null,
		};
	} catch(err){
		return {
			isSupported: false,
			ipCount: 0,
			webRTCIPs: [],
			ipV4: null,
			ipV6: null,
			ipLocal: null,
		};
	}
};
