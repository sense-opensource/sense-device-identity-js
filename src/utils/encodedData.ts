/**
 * Converts a string to UTF8 bytes
 * @param str - String to convert to UTF8 bytes
 * @returns - UTF8 bytes
*/

export function getEncodedData(str: string): Uint8Array {
    let strLength = str.length
    const data = new Uint8Array(strLength)
    for (let s = 0; s < strLength; s++) {
      const strChar = str.charCodeAt(s)
      if (strChar > 127) {
        return new TextEncoder().encode(str)
      }
      data[s] = strChar
    }
    return data
}