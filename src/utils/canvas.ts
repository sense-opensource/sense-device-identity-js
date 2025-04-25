// canvas.ts

import { Hashing } from './hashing';

interface canvasInfo {
	canvas: string | null; // The data URL of the canvas
	canvasHash: string | null; // The hash of the canvas data URL
}
/**
 * This function creates a canvas element, draws shapes and text on it, and returns the canvas data URL and its hash.
 * @returns An object containing the canvas data URL and its hash.
 */
export const getCanvas = (): canvasInfo => {
	const isCanvas = document.createElement('canvas');

	if (isCanvas.getContext?.('2d')) {
		// let canvas, ctx;
		const width = 256, height = 128;
		const canvas = document.body.appendChild(document.createElement('canvas'));
		canvas.width = width;
		canvas.height = height;
		canvas.style.display = 'none';
		const ctx = canvas.getContext('2d');
		if (ctx !== null && ctx !== undefined) {
			ctx.fillStyle = 'rgb(255, 0, 255)';
			ctx.beginPath();
			ctx.rect(20, 20, 150, 100);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = 'rgb(0,255,255)';
			ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.stroke();
			if ('function' === typeof ctx.closePath) {
				ctx.closePath();
			}
			const txt = 'abz190#$%^@£éú';
			ctx.textBaseline = 'top';
			ctx.font = '17px "Arial 17"';
			ctx.textBaseline = 'alphabetic';
			ctx.fillStyle = 'rgb(255,5,5)';
			if ('undefined' !== typeof ctx.rotate && 'function' === typeof ctx.rotate) {
				ctx.rotate(0.03);
			}
			ctx.fillText(txt, 4, 17);
			ctx.fillStyle = 'rgb(155,255,5)';
			ctx.shadowBlur = 8;
			ctx.shadowColor = 'red';
			ctx.fillRect(20, 12, 100, 5);
			const src = canvas.toDataURL();
			isCanvas.remove();
			canvas.remove();
			return { canvas: src, canvasHash: Hashing(src) };
		}
	}
	return { canvas: null, canvasHash: null };
};
