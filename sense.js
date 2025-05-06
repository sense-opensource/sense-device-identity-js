var SenseOS = (function (exports) {
    'use strict';

    /**
     * Function to get battery details using Promises.
     * @returns A Promise that resolves to a BatteryManager object or null if an error occurs.
     */
    function getBatteryDetails() {
        return new Promise((resolve) => {
            if ('getBattery' in navigator &&
                typeof navigator.getBattery === 'function') {
                navigator
                    .getBattery()
                    .then((battery) => {
                    resolve({
                        charging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime,
                        level: battery.level,
                    });
                })
                    .catch((error) => {
                    resolve(null); // Resolve with null in case of an error
                });
            }
            else {
                resolve(null); // Resolve with null if the API is not supported
            }
        });
    }

    /**
     * Checks whether Bluetooth is available in the browser.
     * @returns Promise<boolean> - True if Bluetooth is available, otherwise false.
     */
    async function isBluetoothAvailable() {
        if (!navigator.bluetooth) {
            return false;
        }
        try {
            const availability = await navigator.bluetooth.getAvailability();
            console.log(availability);
            return availability;
        }
        catch (error) {
            console.log(`Blutooth is available : ${error}`);
            return false;
        }
    }

    /**
     * Function to get browser information.
     * @returns An object containing the browser information.
     */
    const getInfo = () => {
        var _a, _b, _c, _d, _e;
        const ua = navigator.userAgent;
        let browserName;
        let browserVersion = 'Unknown';
        const browserType = {};
        if (ua.match(/edg/i)) {
            browserName = 'Edge';
            browserVersion = ((_a = ua.match(/edg\/(\d+\.\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]) || 'Unknown';
            browserType.isEdge = true;
        }
        else if (ua.match(/opr\//i)) {
            browserName = 'Opera';
            browserVersion = ((_b = ua.match(/opr\/(\d+\.\d+)/i)) === null || _b === void 0 ? void 0 : _b[1]) || 'Unknown';
            browserType.isOpera = true;
        }
        else if (ua.match(/safari/i) && !ua.match(/chrome|crios|chromium/i)) {
            browserName = 'Safari';
            browserVersion = ((_c = ua.match(/version\/(\d+\.\d+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || 'Unknown';
            browserType.isSafari = true;
        }
        else if (ua.match(/chrome|chromium|crios/i)) {
            browserName = 'Chrome';
            browserVersion =
                ((_d = ua.match(/(?:chrome|crios|chromium)\/(\d+\.\d+)/i)) === null || _d === void 0 ? void 0 : _d[1]) || 'Unknown';
            browserType.isChrome = true;
        }
        else if (ua.match(/firefox|fxios/i)) {
            browserName = 'Firefox';
            browserVersion =
                ((_e = ua.match(/(?:firefox|fxios)\/(\d+\.\d+)/i)) === null || _e === void 0 ? void 0 : _e[1]) || 'Unknown';
            browserType.isFirefox = true;
        }
        else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1) {
            browserName = 'Internet Explorer';
            const msieIndex = ua.indexOf('MSIE ');
            if (msieIndex > -1) {
                browserVersion = parseInt(ua.substring(msieIndex + 5, ua.indexOf('.', msieIndex)), 10).toString();
            }
            const tridentIndex = ua.indexOf('Trident/');
            if (tridentIndex > -1) {
                const rvIndex = ua.indexOf('rv:');
                browserVersion = parseInt(ua.substring(rvIndex + 3, ua.indexOf('.', rvIndex)), 10).toString();
            }
            browserType.isIE = true;
        }
        else {
            browserName = 'Others';
            browserType.isOthers = true;
        }
        return { browserName, browserVersion, browserType };
    };

    // This function is used to get the WebGL renderer information from the browser.
    // It creates a canvas element, gets the WebGL context, and retrieves the vendor and renderer information.
    // It returns a string containing the vendor and renderer information or "N/A" if not available.
    function getWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const vendor = gl.getParameter(gl.VENDOR);
                const renderer = gl.getParameter(gl.RENDERER);
                return `${vendor} ~ ${renderer}`;
            }
            else {
                return 'Not Available';
            }
        }
        catch (err) {
            return 'Not Available';
        }
    }
    // If the browser does not support WebGL, it returns "N/A".
    function getUnmaskedWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl &&
                typeof WebGLRenderingContext !== 'undefined' &&
                gl instanceof WebGLRenderingContext) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    return `${vendor} ~ ${renderer}`;
                }
            }
            return 'Not Available';
        }
        catch (err) {
            return 'Not Available';
        }
    }
    const hasAddBehavior = typeof window.HTMLElement.prototype.addBehavior ===
        'function';

    /**
     *
     * @param t - The string to hash
     * @returns
     */
    const Hashing = (t) => {
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
        return ((m >>> 0).toString(16).padStart(8, '0') +
            (o >>> 0).toString(16).padStart(8, '0') +
            (n >>> 0).toString(16).padStart(8, '0') +
            (p >>> 0).toString(16).padStart(8, '0'));
    };

    // Font detection utility
    const getFonts = () => {
        // The list of fonts to test.
        const m = [
            'Andale Mono',
            'Arial',
            'Arial Black',
            'Arial Hebrew',
            'Arial MT',
            'Arial Narrow',
            'Arial Rounded MT Bold',
            'Arial Unicode MS',
            'Bitstream Vera Sans Mono',
            'Book Antiqua',
            'Bookman Old Style',
            'Calibri',
            'Cambria',
            'Cambria Math',
            'Century',
            'Century Gothic',
            'Century Schoolbook',
            'Comic Sans',
            'Comic Sans MS',
            'Consolas',
            'Courier',
            'Courier New',
            'Geneva',
            'Georgia',
            'Helvetica',
            'Helvetica Neue',
            'Impact',
            'Lucida Bright',
            'Lucida Calligraphy',
            'Lucida Console',
            'Lucida Fax',
            'LUCIDA GRANDE',
            'Lucida Handwriting',
            'Lucida Sans',
            'Lucida Sans Typewriter',
            'Lucida Sans Unicode',
            'Microsoft Sans Serif',
            'Monaco',
            'Monotype Corsiva',
            'MS Gothic',
            'MS Outlook',
            'MS PGothic',
            'MS Reference Sans Serif',
            'MS Sans Serif',
            'MS Serif',
            'MYRIAD',
            'MYRIAD PRO',
            'Palatino',
            'Palatino Linotype',
            'Segoe Print',
            'Segoe Script',
            'Segoe UI',
            'Segoe UI Light',
            'Segoe UI Semibold',
            'Segoe UI Symbol',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Times New Roman PS',
            'Trebuchet MS',
            'Verdana',
            'Wingdings',
            'Wingdings 2',
            'Wingdings 3',
            'Abadi MT Condensed Light',
            'Academy Engraved LET',
            'ADOBE CASLON PRO',
            'Adobe Garamond',
            'ADOBE GARAMOND PRO',
            'Agency FB',
            'Aharoni',
            'Albertus Extra Bold',
            'Albertus Medium',
            'Algerian',
            'Amazone BT',
            'American Typewriter',
            'American Typewriter Condensed',
            'AmerType Md BT',
            'Andalus',
            'Angsana New',
            'AngsanaUPC',
            'Antique Olive',
            'Aparajita',
            'Apple Chancery',
            'Apple Color Emoji',
            'Apple SD Gothic Neo',
            'Arabic Typesetting',
            'ARCHER',
            'ARNO PRO',
            'Arrus BT',
            'Aurora Cn BT',
            'AvantGarde Bk BT',
            'AvantGarde Md BT',
            'AVENIR',
            'Ayuthaya',
            'Bandy',
            'Bangla Sangam MN',
            'Bank Gothic',
            'BankGothic Md BT',
            'Baskerville',
            'Baskerville Old Face',
            'Batang',
            'BatangChe',
            'Bauer Bodoni',
            'Bauhaus 93',
            'Bazooka',
            'Bell MT',
            'Bembo',
            'Benguiat Bk BT',
            'Berlin Sans FB',
            'Berlin Sans FB Demi',
            'Bernard MT Condensed',
            'BernhardFashion BT',
            'BernhardMod BT',
            'Big Caslon',
            'BinnerD',
            'Blackadder ITC',
            'BlairMdITC TT',
            'Bodoni 72',
            'Bodoni 72 Oldstyle',
            'Bodoni 72 Smallcaps',
            'Bodoni MT',
            'Bodoni MT Black',
            'Bodoni MT Condensed',
            'Bodoni MT Poster Compressed',
            'Bookshelf Symbol 7',
            'Boulder',
            'Bradley Hand',
            'Bradley Hand ITC',
            'Bremen Bd BT',
            'Britannic Bold',
            'Broadway',
            'Browallia New',
            'BrowalliaUPC',
            'Brush Script MT',
            'Californian FB',
            'Calisto MT',
            'Calligrapher',
            'Candara',
            'CaslonOpnface BT',
            'Castellar',
            'Centaur',
            'Cezanne',
            'CG Omega',
            'CG Times',
            'Chalkboard',
            'Chalkboard SE',
            'Chalkduster',
            'Charlesworth',
            'Charter Bd BT',
            'Charter BT',
            'Chaucer',
            'ChelthmITC Bk BT',
            'Chiller',
            'Clarendon',
            'Clarendon Condensed',
            'CloisterBlack BT',
            'Cochin',
            'Colonna MT',
            'Constantia',
            'Cooper Black',
            'Copperplate',
            'Copperplate Gothic',
            'Copperplate Gothic Bold',
            'Copperplate Gothic Light',
            'CopperplGoth Bd BT',
            'Corbel',
            'Cordia New',
            'CordiaUPC',
            'Cornerstone',
            'Coronet',
            'Cuckoo',
            'Curlz MT',
            'DaunPenh',
            'Dauphin',
            'David',
            'DB LCD Temp',
            'DELICIOUS',
            'Denmark',
            'DFKai-SB',
            'Didot',
            'DilleniaUPC',
            'DIN',
            'DokChampa',
            'Dotum',
            'DotumChe',
            'Ebrima',
            'Edwardian Script ITC',
            'Elephant',
            'English 111 Vivace BT',
            'Engravers MT',
            'EngraversGothic BT',
            'Eras Bold ITC',
            'Eras Demi ITC',
            'Eras Light ITC',
            'Eras Medium ITC',
            'EucrosiaUPC',
            'Euphemia',
            'Euphemia UCAS',
            'EUROSTILE',
            'Exotc350 Bd BT',
            'FangSong',
            'Felix Titling',
            'Fixedsys',
            'FONTIN',
            'Footlight MT Light',
            'Forte',
            'FrankRuehl',
            'Fransiscan',
            'Freefrm721 Blk BT',
            'FreesiaUPC',
            'Freestyle Script',
            'French Script MT',
            'FrnkGothITC Bk BT',
            'Fruitger',
            'FRUTIGER',
            'Futura',
            'Futura Bk BT',
            'Futura Lt BT',
            'Futura Md BT',
            'Futura ZBlk BT',
            'FuturaBlack BT',
            'Gabriola',
            'Galliard BT',
            'Gautami',
            'Geeza Pro',
            'Geometr231 BT',
            'Geometr231 Hv BT',
            'Geometr231 Lt BT',
            'GeoSlab 703 Lt BT',
            'GeoSlab 703 XBd BT',
            'Gigi',
            'Gill Sans',
            'Gill Sans MT',
            'Gill Sans MT Condensed',
            'Gill Sans MT Ext Condensed Bold',
            'Gill Sans Ultra Bold',
            'Gill Sans Ultra Bold Condensed',
            'Gisha',
            'Gloucester MT Extra Condensed',
            'GOTHAM',
            'GOTHAM BOLD',
            'Goudy Old Style',
            'Goudy Stout',
            'GoudyHandtooled BT',
            'GoudyOLSt BT',
            'Gujarati Sangam MN',
            'Gulim',
            'GulimChe',
            'Gungsuh',
            'GungsuhChe',
            'Gurmukhi MN',
            'Haettenschweiler',
            'Harlow Solid Italic',
            'Harrington',
            'Heather',
            'Heiti SC',
            'Heiti TC',
            'HELV',
            'Herald',
            'High Tower Text',
            'Hiragino Kaku Gothic ProN',
            'Hiragino Mincho ProN',
            'Hoefler Text',
            'Humanst 521 Cn BT',
            'Humanst521 BT',
            'Humanst521 Lt BT',
            'Imprint MT Shadow',
            'Incised901 Bd BT',
            'Incised901 BT',
            'Incised901 Lt BT',
            'INCONSOLATA',
            'Informal Roman',
            'Informal011 BT',
            'INTERSTATE',
            'IrisUPC',
            'Iskoola Pota',
            'JasmineUPC',
            'Jazz LET',
            'Jenson',
            'Jester',
            'Jokerman',
            'Juice ITC',
            'Kabel Bk BT',
            'Kabel Ult BT',
            'Kailasa',
            'KaiTi',
            'Kalinga',
            'Kannada Sangam MN',
            'Kartika',
            'Kaufmann Bd BT',
            'Kaufmann BT',
            'Khmer UI',
            'KodchiangUPC',
            'Kokila',
            'Korinna BT',
            'Kristen ITC',
            'Krungthep',
            'Kunstler Script',
            'Lao UI',
            'Latha',
            'Leelawadee',
            'Letter Gothic',
            'Levenim MT',
            'LilyUPC',
            'Lithograph',
            'Lithograph Light',
            'Long Island',
            'Lydian BT',
            'Magneto',
            'Maiandra GD',
            'Malayalam Sangam MN',
            'Malgun Gothic',
            'Mangal',
            'Marigold',
            'Marion',
            'Marker Felt',
            'Market',
            'Marlett',
            'Matisse ITC',
            'Matura MT Script Capitals',
            'Meiryo',
            'Meiryo UI',
            'Microsoft Himalaya',
            'Microsoft JhengHei',
            'Microsoft New Tai Lue',
            'Microsoft PhagsPa',
            'Microsoft Tai Le',
            'Microsoft Uighur',
            'Microsoft YaHei',
            'Microsoft Yi Baiti',
            'MingLiU',
            'MingLiU_HKSCS',
            'MingLiU_HKSCS-ExtB',
            'MingLiU-ExtB',
            'Minion',
            'Minion Pro',
            'Miriam',
            'Miriam Fixed',
            'Mistral',
            'Modern',
            'Modern No. 20',
            'Mona Lisa Solid ITC TT',
            'Mongolian Baiti',
            'MONO',
            'MoolBoran',
            'Mrs Eaves',
            'MS LineDraw',
            'MS Mincho',
            'MS PMincho',
            'MS Reference Specialty',
            'MS UI Gothic',
            'MT Extra',
            'MUSEO',
            'MV Boli',
            'Nadeem',
            'Narkisim',
            'NEVIS',
            'News Gothic',
            'News GothicMT',
            'NewsGoth BT',
            'Niagara Engraved',
            'Niagara Solid',
            'Noteworthy',
            'NSimSun',
            'Nyala',
            'OCR A Extended',
            'Old Century',
            'Old English Text MT',
            'Onyx',
            'Onyx BT',
            'OPTIMA',
            'Oriya Sangam MN',
            'OSAKA',
            'OzHandicraft BT',
            'Palace Script MT',
            'Papyrus',
            'Parchment',
            'Party LET',
            'Pegasus',
            'Perpetua',
            'Perpetua Titling MT',
            'PetitaBold',
            'Pickwick',
            'Plantagenet Cherokee',
            'Playbill',
            'PMingLiU',
            'PMingLiU-ExtB',
            'Poor Richard',
            'Poster',
            'PosterBodoni BT',
            'PRINCETOWN LET',
            'Pristina',
            'PTBarnum BT',
            'Pythagoras',
            'Raavi',
            'Rage Italic',
            'Ravie',
            'Ribbon131 Bd BT',
            'Rockwell',
            'Rockwell Condensed',
            'Rockwell Extra Bold',
            'Rod',
            'Roman',
            'Sakkal Majalla',
            'Santa Fe LET',
            'Savoye LET',
            'Sceptre',
            'Script',
            'Script MT Bold',
            'SCRIPTINA',
            'Serifa',
            'Serifa BT',
            'Serifa Th BT',
            'ShelleyVolante BT',
            'Sherwood',
            'Shonar Bangla',
            'Showcard Gothic',
            'Shruti',
            'Signboard',
            'SILKSCREEN',
            'SimHei',
            'Simplified Arabic',
            'Simplified Arabic Fixed',
            'SimSun',
            'SimSun-ExtB',
            'Sinhala Sangam MN',
            'Sketch Rockwell',
            'Skia',
            'Small Fonts',
            'Snap ITC',
            'Snell Roundhand',
            'Socket',
            'Souvenir Lt BT',
            'Staccato222 BT',
            'Steamer',
            'Stencil',
            'Storybook',
            'Styllo',
            'Subway',
            'Swis721 BlkEx BT',
            'Swiss911 XCm BT',
            'Sylfaen',
            'Synchro LET',
            'System',
            'Tamil Sangam MN',
            'Technical',
            'Teletype',
            'Telugu Sangam MN',
            'Tempus Sans ITC',
            'Terminal',
            'Thonburi',
            'Traditional Arabic',
            'Trajan',
            'TRAJAN PRO',
            'Tristan',
            'Tubular',
            'Tunga',
            'Tw Cen MT',
            'Tw Cen MT Condensed',
            'Tw Cen MT Condensed Extra Bold',
            'TypoUpright BT',
            'Unicorn',
            'Univers',
            'Univers CE 55 Medium',
            'Univers Condensed',
            'Utsaah',
            'Vagabond',
            'Vani',
            'Vijaya',
            'Viner Hand ITC',
            'VisualUI',
            'Vivaldi',
            'Vladimir Script',
            'Vrinda',
            'Westminster',
            'WHITNEY',
            'Wide Latin',
            'ZapfEllipt BT',
            'ZapfHumnst BT',
            'ZapfHumnst Dm BT',
            'Zapfino',
            'Zurich BlkEx BT',
            'Zurich Ex BT',
            'ZWAdobeF',
        ];
        // Array to store the fonts that pass the check.
        const o = [];
        // Loop through all fonts except the last one (as in your original code).
        for (let i = 0; i < m.length - 1; i++) {
            const n = ['monospace', 'sans-serif', 'serif'];
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            // If we cannot get a 2D context, skip this iteration.
            if (!context)
                continue;
            const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const fontCheck = {};
            // Test the font with each fallback font.
            for (let j = 0; j < n.length; j++) {
                // Measure with the fallback font.
                context.font = `72px ${n[j]}`;
                const baselineSize = context.measureText(text).width;
                // Measure with the custom font and fallback.
                context.font = `72px '${m[i]}', ${n[j]}`;
                const newSize = context.measureText(text).width;
                // If the widths differ, we assume the custom font is available.
                fontCheck[n[j]] = newSize !== baselineSize;
            }
            // If the custom font works with all fallbacks, add it to the results.
            if (fontCheck['monospace'] &&
                fontCheck['sans-serif'] &&
                fontCheck['serif']) {
                o.push(m[i]);
            }
        }
        // Build the response using the helper functions.
        return {
            fonts: o,
            fontHash: Hashing(JSON.stringify(o)),
            fontsCount: o.length,
        };
    };

    // Project: webgl2hash
    // File: webGl.ts
    // Description: WebGL2 Hashing
    /**
     * Function to check if WebGL is supported and return its hash.
     * @returns An object containing the WebGL hash and the hash of the WebGL canvas.
     */
    const webGlDetails = () => {
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
                canvas.getContext('moz-webgl'));
            canvas.remove();
            try {
                if (ctx != null) {
                    const f = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
                    const g = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
                    const buffer = ctx.createBuffer();
                    const bufferInfo = {
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
                    const programInfo = {
                        program: j,
                        attribLocations: {
                            vertexPos: ctx.getAttribLocation(j, 'attrVertex'),
                        },
                        uniformLocations: {
                            offset: ctx.getUniformLocation(j, 'uniformOffset'),
                        },
                    };
                    ctx.enableVertexAttribArray(programInfo.attribLocations.vertexPos);
                    ctx.vertexAttribPointer(programInfo.attribLocations.vertexPos, bufferInfo.itemSize, ctx.FLOAT, false, 0, 0);
                    ctx.uniform2f(programInfo.uniformLocations.offset, 1, 1);
                    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, bufferInfo.numItems);
                }
            }
            catch (e) { }
            if ((ctx === null || ctx === void 0 ? void 0 : ctx.canvas) instanceof HTMLCanvasElement) {
                const m = ctx.canvas.toDataURL();
                return { webGl: m, webGlHash: Hashing(m) };
                // Now you can safely use `m` because we know ctx.canvas is an HTMLCanvasElement
            }
        }
        return { webGl: null, webGlHash: null };
    };
    const webGLRender = () => {
        return !!window.WebGLRenderingContext &&
            !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl'));
    };

    // canvas.ts
    /**
     * This function creates a canvas element, draws shapes and text on it, and returns the canvas data URL and its hash.
     * @returns An object containing the canvas data URL and its hash.
     */
    const getCanvas = () => {
        var _a;
        const isCanvas = document.createElement('canvas');
        if ((_a = isCanvas.getContext) === null || _a === void 0 ? void 0 : _a.call(isCanvas, '2d')) {
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

    // This function checks if the browser is a "lied" browser.
    // A "lied" browser is one that has a specific user agent string or product sub value.
    // It returns true if the browser is a "lied" browser, false otherwise.
    // If the browser is not recognized, it returns undefined.
    const getLiedBrowser = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const productSub = navigator.productSub;
        let browserName;
        if (userAgent.includes('edge/') ||
            userAgent.includes('iemobile/') ||
            userAgent.includes('opera mini')) {
            return false;
        }
        if (userAgent.includes('firefox/')) {
            browserName = 'Firefox';
        }
        else if (userAgent.includes('opera/') || userAgent.includes(' opr/')) {
            browserName = 'Opera';
        }
        else if (userAgent.includes('chrome/')) {
            browserName = 'Chrome';
        }
        else if (userAgent.includes('safari/')) {
            if (userAgent.includes('android 1.') ||
                userAgent.includes('android 2.') ||
                userAgent.includes('android 3.') ||
                userAgent.includes('android 4.')) {
                browserName = 'AOSP';
            }
            else {
                browserName = 'Safari';
            }
        }
        else if (userAgent.includes('trident/')) {
            browserName = 'Internet Explorer';
        }
        else {
            browserName = 'Other';
        }
        if ((browserName === 'Chrome' ||
            browserName === 'Safari' ||
            browserName === 'Opera') &&
            productSub !== '20030107') {
            return false;
        }
        const evalLength = eval.toString().length;
        if (evalLength === 37 &&
            browserName !== 'Safari' &&
            browserName !== 'Firefox' &&
            browserName !== 'Other') {
            return true;
        }
        if (evalLength === 39 &&
            browserName !== 'Internet Explorer' &&
            browserName !== 'Other') {
            return true;
        }
        if (evalLength === 33 &&
            browserName !== 'Chrome' &&
            browserName !== 'AOSP' &&
            browserName !== 'Opera' &&
            browserName !== 'Other') {
            return true;
        }
        let a;
        try {
            throw new Error('a');
        }
        catch (err) {
            try {
                err.toSource();
                a = true;
            }
            catch (e) {
                a = false;
            }
        }
        if (a && browserName !== 'Firefox' && browserName !== 'Other') {
            return true;
        }
        return false;
    };
    /**
     * This function checks if the browser is a "lied" language.
     * A "lied" language is one that has a specific language code or navigator.language value.
     * It returns true if the language is a "lied" language, false otherwise.
     * If the language is not recognized, it returns undefined.
     * @returns {boolean} - Returns true if the language is a "lied" language, false otherwise.
     * */
    const liedLanguages = () => {
        if (typeof navigator.languages !== 'undefined') {
            try {
                const langMatch = navigator.languages[0].substring(0, 2) !== navigator.language.substring(0, 2);
                if (langMatch) {
                    return true;
                }
            }
            catch (error) {
                return true;
            }
        }
        return false;
    };
    /**
     * This function checks if the browser is a "lied" OS.
     * A "lied" OS is one that has a specific user agent string or OS CPU value.
     * It returns true if the OS is a "lied" OS, false otherwise.
     * If the OS is not recognized, it returns undefined.
     */
    const liedOS = () => {
        var _a, _b;
        const r = navigator.userAgent.toLowerCase();
        let m = navigator.oscpu;
        const n = navigator.platform.toLowerCase();
        let e;
        if (r.includes('windows phone')) {
            e = 'Windows Phone';
        }
        else if (r.includes('windows') || r.includes('win16') || r.includes('win32') || r.includes('win64') || r.includes('win95') || r.includes('win98') || r.includes('winnt') || r.includes('wow64')) {
            e = 'Windows';
        }
        else if (r.includes('android')) {
            e = 'Android';
        }
        else if (r.includes('linux') || r.includes('cros') || r.includes('x11')) {
            e = 'Linux';
        }
        else if (r.includes('iphone') || r.includes('ipad') || r.includes('ipod') || r.includes('crios') || r.includes('fxios')) {
            e = 'iOS';
        }
        else if (r.includes('macintosh') || r.includes('mac_powerpc)')) {
            e = 'Mac';
        }
        else {
            e = 'Other';
        }
        if (('ontouchstart' in window || navigator.maxTouchPoints > 0 || ((_b = (_a = navigator.maxTouchPoints) !== null && _a !== void 0 ? _a : navigator.msMaxTouchPoints) !== null && _b !== void 0 ? _b : 0)) &&
            e !== 'Windows' && e !== 'Windows Phone' && e !== 'Android' && e !== 'iOS' && e !== 'Other' && !r.includes('cros')) {
            return true;
        }
        if (void 0 !== m) {
            m = m.toLowerCase();
            if (m.includes('win') && e !== 'Windows' && e !== 'Windows Phone')
                return true;
            if (m.indexOf('linux') >= 0 && 'Linux' !== e && 'Android' !== e)
                return true;
            if (m.indexOf('mac') >= 0 && 'Mac' !== e && 'iOS' !== e)
                return true;
            if ((-1 === m.indexOf('win') &&
                -1 === m.indexOf('linux') &&
                -1 === m.indexOf('mac')) !=
                ('Other' === e))
                return true;
        }
        return ((n.indexOf('win') >= 0 && 'Windows' !== e && 'Windows Phone' !== e) ||
            ((n.indexOf('linux') >= 0 ||
                n.indexOf('android') >= 0 ||
                n.indexOf('pike') >= 0) &&
                'Linux' !== e &&
                'Android' !== e) ||
            ((n.indexOf('mac') >= 0 ||
                n.indexOf('ipad') >= 0 ||
                n.indexOf('ipod') >= 0 ||
                n.indexOf('iphone') >= 0) &&
                'Mac' !== e &&
                'iOS' !== e) ||
            (!(n.indexOf('arm') >= 0 && 'Windows Phone' === e) &&
                !(n.indexOf('pike') >= 0 && r.indexOf('opera mini') >= 0) &&
                ((n.indexOf('win') < 0 &&
                    n.indexOf('linux') < 0 &&
                    n.indexOf('mac') < 0 &&
                    n.indexOf('iphone') < 0 &&
                    n.indexOf('ipad') < 0 &&
                    n.indexOf('ipod') < 0) !=
                    ('Other' === e) ||
                    (void 0 === navigator.plugins &&
                        'Windows' !== e &&
                        'Windows Phone' !== e))));
    };

    /**
     * Interface representing browser details.
     */
    /**
     * Function to get browser details.
     * @returns A Promise that resolves to an object containing browser details.
     */
    async function getBrowser() {
        var _a, _b, _c;
        let isDarkMode = false;
        let brave = false;
        let do_not_track = ''; // Declare the variable with an initial value
        const screenDetails = screen || window.screen; // Type assertion to ExtendedScreen
        // Detect dark mode
        try {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            isDarkMode = mq.matches; // Check if dark mode is enabled
        }
        catch (error) {
            isDarkMode = false; // Default to false if an error occurs
        }
        // Detect Brave browser
        if ((_b = (_a = navigator.brave) === null || _a === void 0 ? void 0 : _a.isBrave) === null || _b === void 0 ? void 0 : _b.call(_a)) {
            brave = true;
        }
        // Detect Do Not Track
        try {
            const navigatorDoNotTrack = navigator.doNotTrack;
            const windowDoNotTrack = window.doNotTrack;
            if (navigatorDoNotTrack === '1' ||
                windowDoNotTrack === '1' ||
                navigatorDoNotTrack === 'yes') {
                do_not_track = true;
            }
            else if (navigatorDoNotTrack === '0' ||
                windowDoNotTrack === '0' ||
                navigatorDoNotTrack === 'no') {
                do_not_track = false;
            }
            else {
                do_not_track = null;
            }
        }
        catch (error) {
            do_not_track = null; // Default to null if an error occurs
        }
        // Get browser name and version using getInfo from BrowserTypes
        const browserInfo = getInfo();
        const browserName = brave ? 'Brave' : browserInfo.browserName;
        const legacyNavigator = navigator;
        const browserObj = {
            browserName,
            browserVersion: browserInfo.browserVersion,
            userAgent: navigator.userAgent || '',
            browserVendor: navigator.vendor || '',
            colorDepth: screenDetails.colorDepth || 24, // Default to 24 if colorDepth is not available
        };
        const fonts = getFonts();
        const webGlInfo = webGlDetails();
        const canvasInfo = getCanvas();
        return {
            userAgent: navigator.userAgent || '', // User agent string
            browserName, // Use Brave if detected, otherwise use browserName from getInfo
            browserVersion: browserInfo.browserVersion, // Browser version
            browserType: browserInfo.browserType, // Browser type flags
            browserVendor: navigator.vendor || '', // Browser vendor
            productSub: navigator.productSub || '', // Product sub-version
            vendorSub: navigator.vendorSub || '', // Vendor sub-version
            onLine: navigator.onLine, // Online status
            windowLocation: JSON.stringify(window.location), // Window location
            windowOrigin: window.location.origin, // Window origin
            referrer: document.referrer, // Document referrer
            webdriver: null === navigator.webdriver
                ? 'Not Available'
                : String(navigator.webdriver), // WebDriver status
            isSecureContext: window.isSecureContext, // Secure context status
            doNotTrack: do_not_track, // Do Not Track status
            oscpu: 'oscpu' in navigator ? navigator.oscpu : undefined, // OS CPU information (optional)
            isExtended: screenDetails.isExtended || false,
            browserHash: Hashing(JSON.stringify(browserObj)),
            hasLiedBrowser: getLiedBrowser(), // Check if the browser has lied about its identity
            hasLiedOs: liedOS(), // Check if the browser has lied about the OS
            hasLiedResolution: window.screen.width < window.screen.availWidth ||
                window.screen.height < window.screen.availHeight,
            hasLiedLanguages: liedLanguages(), // Check if the browser has lied about languages
            webGl: webGlInfo.webGl,
            webGlHash: webGlInfo.webGlHash,
            canvas: canvasInfo.canvas,
            canvasHash: canvasInfo.canvasHash,
            webglVendorAndRenderer: getWebGLRenderer(), // WebGL vendor and renderer information
            webglUnmaskedVendorAndRenderer: getUnmaskedWebGLRenderer(), // Unmasked WebGL vendor and renderer
            addBehavior: hasAddBehavior, // Check if addBehavior is supported
            cpuClass: (_c = legacyNavigator.cpuClass) !== null && _c !== void 0 ? _c : 'Not Available', // CPU class (optional)
            eval: eval.toString().length,
            isDarkMode, // Return the dark mode status as a boolean
            fonts, // Get the list of fonts
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            indexedDb: !!window.indexedDB,
            openDatabase: !!window.openDatabase,
        };
    }

    /**
     * Function to get network connection information.
     * @returns A NetworkConnectionInfo object with details about the user's network connection.
     */
    const getNetworkConnectionInfo = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const connection = (_b = (_a = navigator.connection) !== null && _a !== void 0 ? _a : navigator.mozConnection) !== null && _b !== void 0 ? _b : navigator.webkitConnection;
        if (!connection) {
            console.warn('The Network Information API is not supported in this browser.');
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
            type: (_c = connection.type) !== null && _c !== void 0 ? _c : null,
            effectiveType: (_d = connection.effectiveType) !== null && _d !== void 0 ? _d : null,
            downlink: (_e = connection.downlink) !== null && _e !== void 0 ? _e : null,
            rtt: (_f = connection.rtt) !== null && _f !== void 0 ? _f : null,
            saveData: (_g = connection.saveData) !== null && _g !== void 0 ? _g : null,
            isMetered: (_h = connection.metered) !== null && _h !== void 0 ? _h : null,
        };
    };

    const getLanguage = () => {
        const primaryLanguage = navigator.language || 'unknown';
        const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';
        return {
            primaryLanguage,
            allLanguages: Array.from(navigator.languages) || ['unknown'],
            locale, // Locale information (e.g., "en-US")
        };
    };

    const getZoneDetails = () => {
        let date1, date2;
        date1 = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        date2 = new Date().toLocaleString('en-US', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        const time_difference = new Date(date2).getTime() - new Date(date1).getTime();
        const days = Math.round(time_difference / (1000 * 60 * 60 * 24));
        const hours = time_difference / 36e5;
        const minutes = Math.round(time_difference / 1000 / 60);
        const seconds = time_difference / 1000;
        return {
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneCountry: new Date().toTimeString().slice(9),
            timeStampDelta: {
                clientDate: date2,
                senseDate: date1,
                differenceDay: `${days} ${days <= 1 ? 'day' : 'days'}`,
                differenceHours: `${hours} hrs`,
                differenceMinutes: `${minutes} mins`,
                differenceSeconds: `${seconds} seconds`,
            },
        };
    };

    /**
     * Function to detect WebRTC support and gather IP addresses.
     * @returns A Promise that resolves to an object containing WebRTC details.
     */
    const detectWebRTC = async () => {
        try {
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
            const RTCPeerConnection = window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection;
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
            const ips = new Set();
            // Function to handle ICE candidates and extract IP addresses
            const handleCandidate = (candidate) => {
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
            await new Promise((resolve) => {
                if (peerConnection.iceGatheringState === 'complete') {
                    resolve();
                }
                else {
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
            let ipV4 = null;
            let ipV6 = null;
            let ipLocal = null;
            for (let i = 0; i < ipList.length; i++) {
                if (ipList[i].match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
                    ipLocal = ipList[i];
                }
                else if (ipList[i].match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)) {
                    ipV6 = ipList[i];
                }
                else if (ipList[i].match(/^(?!0\.0\.0\.0$)((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/)) {
                    ipV4 = ipList[i];
                }
            }
            return {
                isSupported: isWebRTCSupported,
                ipCount: ipList.length,
                webRTCIPs: ipList,
                ipV4: ipV4 !== null && ipV4 !== void 0 ? ipV4 : null,
                ipV6: ipV6 !== null && ipV6 !== void 0 ? ipV6 : null,
                ipLocal: ipLocal !== null && ipLocal !== void 0 ? ipLocal : null,
            };
        }
        catch (err) {
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

    /**
     * Function to get device information.
     * @returns An object containing device information
     */
    const getDevice = () => {
        var _a, _b, _c;
        const ua = navigator.userAgent.toLowerCase();
        const touchSupport = 'ontouchstart' in window ||
            ((_a = navigator.maxTouchPoints) !== null && _a !== void 0 ? _a : 0) > 0 ||
            ((_b = navigator.msMaxTouchPoints) !== null && _b !== void 0 ? _b : 0) > 0;
        const isMobile = Boolean(/(iPad|iPhone|iPod|android|webOS)/i.exec(navigator.userAgent));
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
        const isWindows = /(win32|win64|windows|wince)/i.test(ua);
        const isMac = /(macintosh|macintel|macppc|mac68k|macos)/i.test(ua);
        const isAndroid = ua.indexOf('android') > -1;
        const isLinux = ua.includes('Linux');
        const isLinux64 = ua.includes('Linux') && ua.includes('x86_64');
        let platform = navigator.platform, macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'], windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'], iosPlatforms = ['iPhone', 'iPad', 'iPod'], os = null;
        if (/android/i.test(ua)) {
            os = 'Android';
        }
        else if (macosPlatforms.indexOf(platform) !== -1 || /Mac/.test(platform)) {
            os = 'Mac OS';
        }
        else if (iosPlatforms.indexOf(platform) !== -1 ||
            (/iPad|iPhone|iPod/.test(ua) && !window.MSStream)) {
            os = 'iOS';
        }
        else if (windowsPlatforms.indexOf(platform) !== -1 ||
            /Win/.test(platform)) {
            os = 'Windows';
        }
        else if (/Linux/.test(platform)) {
            os = 'Linux';
        }
        else {
            os = 'Others';
        }
        return {
            os,
            platform: navigator.platform,
            touchSupport,
            deviceMemory: (_c = navigator.deviceMemory) !== null && _c !== void 0 ? _c : 0,
            hardwareConcurrency: navigator.hardwareConcurrency || 0,
            deviceHash: Hashing(JSON.stringify(navigator.userAgent)),
            deviceTypes: {
                isDesktop: !isMobile && !isTablet,
                isMobile: isMobile,
                isTablet: isTablet,
                isWindows: isWindows,
                isLinux: isLinux,
                isLinux64: isLinux64,
                isAndroid: isAndroid,
                isMac: isMac,
                isIPad: ['iPad Simulator', 'iPad'].includes(navigator.platform),
                isIPhone: ['iPhone Simulator', 'iPhone'].includes(navigator.platform),
                isIPod: ['iPod Simulator', 'iPod'].includes(navigator.platform),
                isSmartTV: /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast\.tv/gi.test(ua.toLowerCase())
            },
        };
    };

    /**
     * Function to get the user's preferred color scheme (dark mode or light mode).
     * @param callback - A function that receives a boolean indicating whether dark mode is enabled.
     */
    const getScreen = () => {
        var _a, _b;
        // Check if the screen object is available
        // If not, use the window object as a fallback
        const screenObj = screen || window.screen;
        let displayResolution = '', availableDisplayResolution = '';
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
            screenAngle: (_a = screenObj.orientation) === null || _a === void 0 ? void 0 : _a.angle,
            screenDepth: screenObj.pixelDepth,
            outerHeight: window.outerHeight,
            outerWidth: window.outerWidth,
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth,
            availLeft: window.screen.availLeft,
            availTop: window.screen.availTop,
            screenOrientation: (_b = screenObj.orientation) === null || _b === void 0 ? void 0 : _b.type,
            screenPixelRatio: window.devicePixelRatio,
            displayResolution: displayResolution,
            availableDisplayResolution: availableDisplayResolution,
            colorDepth: screenObj.colorDepth,
            hasFocus: document.hasFocus(),
        };
    };

    // This file is part of the "cookie" module.
    // It provides functionality to check if cookies are enabled in the browser,
    // retrieve cookie information, and hash the cookie data.
    // It also includes an interface to define the structure of the cookie information object.
    /**
     * Function to get cookie information.
     * @returns An object containing cookie information (enabled status, IDs, hash, and wiped out status).
     */
    const getCookie = () => {
        return {
            cookieEnabled: navigator.cookieEnabled,
            cookieIds: document.cookie,
            cookieHash: document.cookie
                ? Hashing(JSON.stringify(document.cookie))
                : null,
            cookieWipedOut: "undefined" === typeof document
                ? null
                : document.cookie.length === 0,
        };
    };

    // Importing the isBluetoothAvailable function from the bluetooth module
    /**
     * Function to get enabled features in the browser.
     * @returns An object containing information about enabled features (Bluetooth, PDF viewer, Flash, Java).
     */
    const getEnabled = async () => {
        var _a;
        let isFlashEnabled = false;
        if ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.plugins) === null || _a === void 0 ? void 0 : _a.namedItem('Shockwave Flash')) {
            isFlashEnabled = true;
        }
        else {
            try {
                if (typeof ActiveXObject !== 'undefined') {
                    const flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (flash) {
                        isFlashEnabled = true;
                    }
                }
            }
            catch (e) {
                isFlashEnabled = false;
            }
        }
        return {
            bluetoothEnabled: await isBluetoothAvailable(),
            pdfViewerEnabled: navigator.pdfViewerEnabled,
            isFlashEnabled,
            isJavaEnabled: navigator.javaEnabled(),
        };
    };

    // This module provides a function to retrieve information about the plugins installed in the browser.
    /**
     * Function to get plugin information.
     * @returns An object containing plugin information (count, hash, and list of plugins).
     */
    // This interface defines the structure of the object returned by the plugins function
    const plugins = () => {
        const plugin = [];
        const length = navigator.plugins.length;
        for (let i = 0; i < length; i++) {
            plugin.push(navigator.plugins[i].name);
        }
        return {
            pluginCount: plugin.length,
            pluginHash: Hashing(JSON.stringify(plugin)),
            plugins: plugin,
        };
    };

    /**
     * Function to get media information (audio, video devices).
     * @returns An object containing media information (enumeration status, audio, microphone, and video hardware details).
     */
    // This function retrieves information about the media devices (audio, video) available in the browser.
    const getMedia = async () => {
        var _a;
        const audioInputDevices = [], audioOutputDevices = [], videoInputDevices = [], alreadyUsedDevices = {};
        let hasMicrophone = false, hasSpeakers = false, hasWebcam = false, isWebsiteHasMicrophonePermissions = false, isWebsiteHasWebcamPermissions = false;
        if ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((_device) => {
                var _a, _b;
                const device = {};
                for (const d in _device) {
                    try {
                        if (typeof _device[d] !== 'function') {
                            device[d] = _device[d];
                        }
                    }
                    catch (e) { }
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
                (_a = device.deviceId) !== null && _a !== void 0 ? _a : (device.deviceId = device.id);
                (_b = device.id) !== null && _b !== void 0 ? _b : (device.id = device.deviceId);
                if (!device.label) {
                    device.isCustomLabel = true;
                    if (device.kind === 'videoinput') {
                        device.label = 'Camera ' + (videoInputDevices.length + 1);
                    }
                    else if (device.kind === 'audioinput') {
                        device.label = 'Microphone ' + (audioInputDevices.length + 1);
                    }
                    else if (device.kind === 'audiooutput') {
                        device.label = 'Speaker ' + (audioOutputDevices.length + 1);
                    }
                    else {
                        device.label = 'Please invoke getUserMedia once.';
                    }
                    const userAgentMatch = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i.exec(navigator.userAgent);
                    const browserVersion = userAgentMatch
                        ? parseInt(userAgentMatch[2], 10)
                        : 0;
                    if (!!window.chrome &&
                        !(!!window.opera || navigator.userAgent.indexOf('OPR/') >= 0) &&
                        browserVersion >= 46 &&
                        !/^(https:|chrome-extension:)$/g.test(location.protocol || '')) {
                        if (typeof document !== 'undefined' &&
                            typeof document.domain === 'string' &&
                            document.domain.search &&
                            document.domain.search(/localhost|127.0./g) === -1) {
                            device.label =
                                'HTTPs is required to get label of this ' +
                                    device.kind +
                                    ' device.';
                        }
                    }
                }
                else {
                    if (device.kind === 'videoinput' && !isWebsiteHasWebcamPermissions) {
                        isWebsiteHasWebcamPermissions = true;
                    }
                    if (device.kind === 'audioinput' &&
                        !isWebsiteHasMicrophonePermissions) {
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

    const geoLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp,
                        enabled: true,
                    });
                }, (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            resolve({ error: 'User denied the request for Geolocation.' });
                            break;
                        case error.POSITION_UNAVAILABLE:
                            resolve({ error: 'Location information is unavailable.' });
                            break;
                        case error.TIMEOUT:
                            resolve({ error: 'The request to get user location timed out.' });
                            break;
                        default:
                            resolve({ error: 'An unknown error occurred.' });
                            break;
                    }
                });
            }
            else {
                reject(new Error('No support for Geolocation'));
            }
        });
    };

    /*
     * Based on https://github.com/karanlyons/murmurHash3.js/blob/c1778f75792abef7bdd74bc85d2d4e1a3d25cfe9/murmurHash3.js
    */
    function x64Add(m, n) {
        //
        // Given two 64bit ints (as an array of two 32bit ints) returns the two
        // added together as a 64bit int (as an array of two 32bit ints).
        //
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        const o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += m[0] + n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }
    function x64Multiply(m, n) {
        //
        // Given two 64bit ints (as an array of two 32bit ints) returns the two
        // multiplied together as a 64bit int (as an array of two 32bit ints).
        //
        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
        const o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 0xffff;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 0xffff;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 0xffff;
        o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }
    function x64Rotl(m, n) {
        //
        // Given a 64bit int (as an array of two 32bit ints) and an int
        // representing a number of bit positions, returns the 64bit int (as an
        // array of two 32bit ints) rotated left by that number of positions.
        //
        n %= 64;
        if (n === 32) {
            return [m[1], m[0]];
        }
        else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
        }
        else {
            n -= 32;
            return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
        }
    }
    function x64LeftShift(m, n) {
        //
        // Given a 64bit int (as an array of two 32bit ints) and an int
        // representing a number of bit positions, returns the 64bit int (as an
        // array of two 32bit ints) shifted left by that number of positions.
        //
        n %= 64;
        if (n === 0) {
            return m;
        }
        else if (n < 32) {
            return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
        }
        else {
            return [m[1] << (n - 32), 0];
        }
    }
    function x64Xor(m, n) {
        //
        // Given two 64bit ints (as an array of two 32bit ints) returns the two
        // xored together as a 64bit int (as an array of two 32bit ints).
        //
        return [m[0] ^ n[0], m[1] ^ n[1]];
    }
    function x64Fmix(h) {
        //
        // Given a block, returns murmurHash3's final x64 mix of that block.
        // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
        // only place where we need to right shift 64bit ints.)
        //
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        return h;
    }
    function x64hash128(key, seed) {
        //
        // Given a string and an optional seed as an int, returns a 128 bit
        // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
        //
        key = key || '';
        seed = seed !== null && seed !== void 0 ? seed : 0;
        const remainder = key.length % 16;
        const bytes = key.length - remainder;
        let h1 = [0, seed];
        let h2 = [0, seed];
        let k1 = [0, 0];
        let k2 = [0, 0];
        const c1 = [0x87c37b91, 0x114253d5];
        const c2 = [0x4cf5ad43, 0x2745937f];
        for (var i = 0; i < bytes; i = i + 16) {
            k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) &
                    0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
            k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i +
                    9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
            k1 = x64Multiply(k1, c1);
            k1 = x64Rotl(k1, 31);
            k1 = x64Multiply(k1, c2);
            h1 = x64Xor(h1, k1);
            h1 = x64Rotl(h1, 27);
            h1 = x64Add(h1, h2);
            h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
            k2 = x64Multiply(k2, c2);
            k2 = x64Rotl(k2, 33);
            k2 = x64Multiply(k2, c1);
            h2 = x64Xor(h2, k2);
            h2 = x64Rotl(h2, 31);
            h2 = x64Add(h2, h1);
            h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
            case 15:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                break;
            case 14:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                break;
            case 13:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                break;
            case 12:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                break;
            case 11:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                break;
            case 10:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                break;
            case 9:
                k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                k2 = x64Multiply(k2, c2);
                k2 = x64Rotl(k2, 33);
                k2 = x64Multiply(k2, c1);
                h2 = x64Xor(h2, k2);
                break;
            case 8:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                break;
            case 7:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                break;
            case 6:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                break;
            case 5:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                break;
            case 4:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                break;
            case 3:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                break;
            case 2:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                break;
            case 1:
                k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
                k1 = x64Multiply(k1, c1);
                k1 = x64Rotl(k1, 31);
                k1 = x64Multiply(k1, c2);
                h1 = x64Xor(h1, k1);
                break;
        }
        h1 = x64Xor(h1, [0, key.length]);
        h2 = x64Xor(h2, [0, key.length]);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        h1 = x64Fmix(h1);
        h2 = x64Fmix(h2);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + "-" + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + "-" + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + "-" + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }

    /**
     * Converts a string to UTF8 bytes
     * @param str - String to convert to UTF8 bytes
     * @returns - UTF8 bytes
    */
    function getEncodedData(str) {
        let strLength = str.length;
        const data = new Uint8Array(strLength);
        for (let s = 0; s < strLength; s++) {
            const strChar = str.charCodeAt(s);
            if (strChar > 127) {
                return new TextEncoder().encode(str);
            }
            data[s] = strChar;
        }
        return data;
    }

    /**
     * Function to get all Sense details.
     * @returns An object containing all the details (battery, zone, language, network, Bluetooth).
     */
    const initSDK = async (senseInfo) => {
        /**
         * Metadata representing the client's runtime environment importent browser informaion,
         * used for diagnostics, analytics, or feature support checks.
         */
        const deviceMetaInfo = {
            language: getLanguage(),
            bluetooth: await isBluetoothAvailable(),
            device: getDevice(),
            plugins: plugins(),
            media: await getMedia(),
            browser: await getBrowser()
        };
        /**
         * Device Information
         */
        const data = Object.assign(Object.assign({ battery: await getBatteryDetails(), zone: getZoneDetails() }, deviceMetaInfo), { webRTC: await detectWebRTC(), screen: getScreen(), connection: getNetworkConnectionInfo(), cookie: getCookie(), enabled: await getEnabled(), location: senseInfo.allowGeoLocation
                ? await geoLocation()
                : { enabled: 'Not Available' } });
        deviceMetaInfo.browser.isDarkMode = undefined;
        const encodedMeta = getEncodedData(JSON.stringify(deviceMetaInfo));
        try {
            return {
                getSenseDetails: data,
                senseId: x64hash128(JSON.stringify(encodedMeta)),
                score: 0.5
            };
        }
        catch (error) {
            return null; // Return null in case of any error
        } // NOSONAR
    };

    exports.initSDK = initSDK;

    return exports;

})({});
