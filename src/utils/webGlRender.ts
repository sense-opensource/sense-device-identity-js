interface LegacyHTMLElement extends HTMLElement {
	addBehavior?: (url: string) => void;
}

// This function is used to get the WebGL renderer information from the browser.
// It creates a canvas element, gets the WebGL context, and retrieves the vendor and renderer information.
// It returns a string containing the vendor and renderer information or "N/A" if not available.
export function getWebGLRenderer(): string {
	try {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const gl = canvas.getContext('webgl')|| (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

		if (gl) {
			const vendor: string = gl.getParameter(gl.VENDOR) as string;
			const renderer: string = gl.getParameter(gl.RENDERER) as string;
			return `${vendor} ~ ${renderer}`;
		} else {
			return 'Not Available';
		}
	} catch (err) {
		return 'Not Available';
	}
}

// If the browser does not support WebGL, it returns "N/A".
export function getUnmaskedWebGLRenderer(): string {
	try {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const gl =
			canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

		if (
			gl &&
			typeof WebGLRenderingContext !== 'undefined' &&
			gl instanceof WebGLRenderingContext
		) {
			const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

			if (debugInfo) {
				const vendor = gl.getParameter(
					debugInfo.UNMASKED_VENDOR_WEBGL,
				) as string;
				const renderer = gl.getParameter(
					debugInfo.UNMASKED_RENDERER_WEBGL,
				) as string;
				return `${vendor} ~ ${renderer}`;
			}
		}

		return 'Not Available';
	} catch (err) {
		return 'Not Available';
	}
}

export const hasAddBehavior: boolean =
	typeof (window.HTMLElement.prototype as LegacyHTMLElement).addBehavior ===
	'function';
