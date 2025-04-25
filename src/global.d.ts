/**
 * Extend the Window interface to include na and MSStream
 * and openDatabase
 */
interface Window {
	MSStream?: any;
	ActiveXObject?: any;
	chrome?: any;
	opera?: any;
}
/**
 * Extend the Navigator interface to include deviceMemory and msMaxTouchPoints
 * and maxTouchPoints
 */
interface Navigator {
	deviceMemory?: number;
	msMaxTouchPoints?: number;
	maxTouchPoints?: number;
	bluetooth: Bluetooth;
	oscpu: string;
}

/**
 * Extend the Screen interface to include isExtended
 */
interface Screen {
	isExtended?: boolean;
	colorDepth: number;
	availLeft: number;
	availTop: number;
}
