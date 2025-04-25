/**
 *
 * @param t - The string to hash
 * @returns
 */
export const Hashing = (t: string) => {
	let m = 0xdeadbeef ^ t.length;
	let n = 0xfeedface ^ t.length;
	let o = 0x12345678;
	let p = 0x87654321;
	for (let i = 0; i < t.length; i++) {
		const q = t.charCodeAt(i);
		n = (n + q) | 0;
		m = (m ^ (q << 8)) | 0;
		p = (p ^ q) | 0;
		o = (o + (q << 16)) | 0;
		n = (n << 13) | (n >>> 19);
		m = (m << 5) | (m >>> 27);
		p = (p << 7) | (p >>> 25);
		o = (o << 17) | (o >>> 15);
	}
	return (
		(m >>> 0).toString(16).padStart(8, '0') +
		(o >>> 0).toString(16).padStart(8, '0') +
		(n >>> 0).toString(16).padStart(8, '0') +
		(p >>> 0).toString(16).padStart(8, '0')
	);
};
