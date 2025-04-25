// Project: webgl2hash
// File: webGl.ts
// Description: WebGL2 Hashing
import { Hashing } from './hashing';

/**
 * Interface representing the WebGL2 context.
 */
interface BufferInfo {
	buffer: WebGLBuffer;
	itemSize: number;
	numItems: number;
}
/**
 * Interface representing the program information.
 */
interface ProgramInfo {
	program: WebGLProgram;
	attribLocations: {
		vertexPos: number;
	};
	uniformLocations: {
		offset: WebGLUniformLocation | null;
	};
}

interface WegGlInfo {
	webGl: string | null;
	webGlHash: string | null;
}

/**
 * Function to check if WebGL is supported and return its hash.
 * @returns An object containing the WebGL hash and the hash of the WebGL canvas.
 */

export const webGlDetails = (): WegGlInfo => {
	if (webGLRender()) {
		const width = 256, height = 128;
		const canvas = document.body.appendChild(document.createElement('canvas'));
		canvas.width = width;
		canvas.height = height;
		canvas.style.display = 'none';
		const ctx = (canvas.getContext('webgl2') ||
			canvas.getContext('experimental-webgl2') ||
			canvas.getContext('webgl') ||
			canvas.getContext('experimental-webgl') ||
			canvas.getContext('moz-webgl')) as WebGL2RenderingContext | null;
		canvas.remove();
		try {
			if (ctx != null) {
				const f =
					'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
				const g =
					'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
				const buffer = ctx.createBuffer();
				const bufferInfo: BufferInfo = {
					buffer: buffer,
					itemSize: 3,
					numItems: 3,
				};
				ctx.bindBuffer(ctx.ARRAY_BUFFER, bufferInfo.buffer);
				const i = new Float32Array([
					-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.7321, 0,
				]);
				ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW);
				const k = ctx.createShader(ctx.VERTEX_SHADER);
				if (!k) {
					throw new Error('Failed to create vertex shader');
				}
				ctx.shaderSource(k, f);
				ctx.compileShader(k);
				ctx.shaderSource(k, f);
				ctx.compileShader(k);

				const l = ctx.createShader(ctx.FRAGMENT_SHADER);
				if (!l) {
					throw new Error('Failed to create vertex shader');
				}
				ctx.shaderSource(l, g);
				ctx.compileShader(l);

				const j = ctx.createProgram();
				if (!j) {
					throw new Error('Failed to create vertex shader');
				}
				ctx.attachShader(j, k);
				ctx.attachShader(j, l);
				ctx.linkProgram(j);
				ctx.useProgram(j);

				const programInfo: ProgramInfo = {
					program: j,
					attribLocations: {
						vertexPos: ctx.getAttribLocation(j, 'attrVertex'),
					},
					uniformLocations: {
						offset: ctx.getUniformLocation(j, 'uniformOffset'),
					},
				};
				ctx.enableVertexAttribArray(programInfo.attribLocations.vertexPos);
				ctx.vertexAttribPointer(
					programInfo.attribLocations.vertexPos,
					bufferInfo.itemSize,
					ctx.FLOAT,
					false,
					0,
					0,
				);
				ctx.uniform2f(programInfo.uniformLocations.offset, 1, 1);
				ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, bufferInfo.numItems);
			}
		} catch (e) {}
			if (ctx?.canvas instanceof HTMLCanvasElement) {
				const m = ctx.canvas.toDataURL();
				return { webGl: m, webGlHash: Hashing(m) };
				// Now you can safely use `m` because we know ctx.canvas is an HTMLCanvasElement
			}
	}
	return { webGl: null, webGlHash: null };
};

const webGLRender = () => {
	return !!window.WebGLRenderingContext &&
		!!(document.createElement('canvas').getContext('webgl') ||  document.createElement('canvas').getContext('experimental-webgl'))
}