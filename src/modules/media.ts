import { Hashing } from '../utils/hashing';

// This interface defines the structure of the object returned by the media function
interface MediaInfo {
	canEnumerate: boolean; // Indicates if the media devices can be enumerated
	audioHardware: {
		hasSpeakers: boolean; // Indicates if speakers are available
		hash: string; // Hash of the audio devices
		devices: MediaDeviceInfo[]; // List of audio devices
	};
	microPhoneHardware: {
		hasMicrophone: boolean; // Indicates if a microphone is available
		hash: string; // Hash of the microphone devices
		devices: MediaDeviceInfo[]; // List of microphone devices
		hasMicrophonePermissions: boolean; // Indicates if microphone permissions are granted
	};
	videoHardware: {
		hasWebCam: boolean; // Indicates if a webcam is available
		hash: string; // Hash of the video devices
		devices: MediaDeviceInfo[]; // List of video devices
		hasWebcamPermissions: boolean; // Indicates if webcam permissions are granted
	};
}

/**
 * Function to get media information (audio, video devices).
 * @returns An object containing media information (enumeration status, audio, microphone, and video hardware details).
 */
// This function retrieves information about the media devices (audio, video) available in the browser.
export const getMedia = async (): Promise<MediaInfo> => {
	const audioInputDevices: any = [],
		audioOutputDevices: any = [],
		videoInputDevices: any = [],
		alreadyUsedDevices: any = {};
	let hasMicrophone: any = false,
		hasSpeakers: boolean = false,
		hasWebcam: boolean = false,
		isWebsiteHasMicrophonePermissions: boolean = false,
		isWebsiteHasWebcamPermissions: boolean = false;

	if (navigator?.mediaDevices?.enumerateDevices) {
		const devices = await navigator.mediaDevices.enumerateDevices();
		devices.forEach((_device: any) => {
			const device: any = {};
			for (const d in _device) {
				try {
					if (typeof _device[d] !== 'function') {
						device[d] = _device[d];
					}
				} catch (e) {}
			}
			if (alreadyUsedDevices[device.deviceId + device.label + device.kind]) {
				return;
			}
			if (device.kind === 'audio') {
				device.kind = 'audioinput';
			}
			if (device.kind === 'video') {
				device.kind = 'videoinput';
			}
			device.deviceId ??= device.id;
			device.id ??= device.deviceId;
			if (!device.label) {
				device.isCustomLabel = true;
				if (device.kind === 'videoinput') {
					device.label = 'Camera ' + (videoInputDevices.length + 1);
				} else if (device.kind === 'audioinput') {
					device.label = 'Microphone ' + (audioInputDevices.length + 1);
				} else if (device.kind === 'audiooutput') {
					device.label = 'Speaker ' + (audioOutputDevices.length + 1);
				} else {
					device.label = 'Please invoke getUserMedia once.';
				}
				const userAgentMatch = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i.exec(navigator.userAgent);
				
				const browserVersion = userAgentMatch
					? parseInt(userAgentMatch[2], 10)
					: 0;

				if (
					!!window.chrome &&
					!(!!window.opera || navigator.userAgent.indexOf('OPR/') >= 0) &&
					browserVersion >= 46 &&
					!/^(https:|chrome-extension:)$/g.test(location.protocol || '')
				) {
					if (
						typeof document !== 'undefined' &&
						typeof document.domain === 'string' &&
						document.domain.search &&
						document.domain.search(/localhost|127.0./g) === -1
					) {
						device.label =
							'HTTPs is required to get label of this ' +
							device.kind +
							' device.';
					}
				}
			} else {
				if (device.kind === 'videoinput' && !isWebsiteHasWebcamPermissions) {
					isWebsiteHasWebcamPermissions = true;
				}
				if (
					device.kind === 'audioinput' &&
					!isWebsiteHasMicrophonePermissions
				) {
					isWebsiteHasMicrophonePermissions = true;
				}
			}
			if (device.kind === 'audioinput') {
				hasMicrophone = true;
				if (audioInputDevices.indexOf(device) === -1) {
					audioInputDevices.push(device);
				}
			}
			if (device.kind === 'audiooutput') {
				hasSpeakers = true;
				if (audioOutputDevices.indexOf(device) === -1) {
					audioOutputDevices.push(device);
				}
			}
			if (device.kind === 'videoinput') {
				hasWebcam = true;
				if (videoInputDevices.indexOf(device) === -1) {
					videoInputDevices.push(device);
				}
			}
			alreadyUsedDevices[device.deviceId + device.label + device.kind] = device;
		});

		return {
			canEnumerate: true,
			audioHardware: {
				hasSpeakers: hasSpeakers,
				hash: Hashing(JSON.stringify(audioOutputDevices)),
				devices: audioOutputDevices,
			},
			microPhoneHardware: {
				hasMicrophone: hasMicrophone,
				hash: Hashing(JSON.stringify(audioInputDevices)),
				devices: audioInputDevices,
				hasMicrophonePermissions: isWebsiteHasMicrophonePermissions,
			},
			videoHardware: {
				hasWebCam: hasWebcam,
				hash: Hashing(JSON.stringify(videoInputDevices)),
				devices: videoInputDevices,
				hasWebcamPermissions: isWebsiteHasWebcamPermissions,
			},
		};
	}

	return {
		canEnumerate: false,
		audioHardware: {
			hasSpeakers: false,
			hash: '',
			devices: [],
		},
		microPhoneHardware: {
			hasMicrophone: false,
			hash: '',
			devices: [],
			hasMicrophonePermissions: false,
		},
		videoHardware: {
			hasWebCam: false,
			hash: '',
			devices: [],
			hasWebcamPermissions: false,
		},
	};
};
