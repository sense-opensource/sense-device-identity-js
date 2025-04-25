// Define an interface for the callback function
interface ScreenDetails {
	screenHeight: number;
	screenWidth: number;
	screenAngle: number;
	screenDepth: number;
	outerHeight: number;
	outerWidth: number;
	innerHeight: number;
	innerWidth: number;
	availLeft: number;
	availTop: number;
	screenOrientation: string;
	screenPixelRatio: number;
	displayResolution: string;
	availableDisplayResolution: string;
	colorDepth: number;
	hasFocus: boolean;
}

/**
 * Function to get the user's preferred color scheme (dark mode or light mode).
 * @param callback - A function that receives a boolean indicating whether dark mode is enabled.
 */
export const getScreen = (): ScreenDetails => {
	// Check if the screen object is available
	// If not, use the window object as a fallback
	const screenObj = screen || window.screen;
	let displayResolution = '',
		availableDisplayResolution = '';

	if (screenObj.width) {
		const width = screenObj.width ? screenObj.width : '';
		const height = screenObj.height ? screenObj.height : '';
		displayResolution = '' + width + ' x ' + height;
	}
	availableDisplayResolution =
		screenObj.availWidth + ' x ' + screenObj.availHeight;

	// Check if the screen object has the required properties
	return {
		screenHeight: screenObj.availHeight,
		screenWidth: screenObj.availWidth,
		screenAngle: screenObj.orientation?.angle,
		screenDepth: screenObj.pixelDepth,
		outerHeight: window.outerHeight,
		outerWidth: window.outerWidth,
		innerHeight: window.innerHeight,
		innerWidth: window.innerWidth,
		availLeft: window.screen.availLeft,
		availTop: window.screen.availTop,
		screenOrientation: screenObj.orientation?.type,
		screenPixelRatio: window.devicePixelRatio,
		displayResolution: displayResolution,
		availableDisplayResolution: availableDisplayResolution,
		colorDepth: screenObj.colorDepth,
		hasFocus: document.hasFocus(),
	};
};
