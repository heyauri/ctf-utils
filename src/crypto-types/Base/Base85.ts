const BASE85_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';

const is_Base85 = (str: string): boolean => {
    if (str.length === 0) return false;
    for (const c of str) {
        if (!BASE85_CHARS.includes(c) && c !== 'z') return false;
    }
    return true;
};

const de_Base85 = (str: string, type: number = 0): string | Buffer => {
    const result: number[] = [];
    
    let i = 0;
    while (i < str.length) {
        if (str[i] === 'z') {
            result.push(0, 0, 0, 0);
            i++;
            continue;
        }
        
        let chunkEnd = i;
        while (chunkEnd < str.length && str[chunkEnd] !== 'z') {
            chunkEnd++;
        }
        
        let pos = i;
        while (pos < chunkEnd) {
            const chunk = str.slice(pos, Math.min(pos + 5, chunkEnd));
            const chunkLen = chunk.length;
            
            if (chunkLen === 5) {
                let leadingZeros = 0;
                for (let j = 0; j < chunkLen && chunk[j] === '0'; j++) {
                    leadingZeros++;
                }
                
                const validChars = chunkLen - leadingZeros;
                const nBytes = 5 - leadingZeros - 1;
                
                if (validChars > 0 && nBytes > 0) {
                    let value = BigInt(0);
                    for (let j = 0; j < validChars; j++) {
                        value = value * 85n + BigInt(BASE85_CHARS.indexOf(chunk[leadingZeros + j]));
                    }
                    
                    for (let j = nBytes - 1; j >= 0; j--) {
                        result.push(Number((value >> BigInt(8 * j)) & 255n));
                    }
                }
            } else {
                const leadingZeros = (chunk.match(/^0+/) || [''])[0].length;
                const validChars = chunkLen - leadingZeros;
                const nBytes = validChars;
                
                if (validChars > 0) {
                    let value = BigInt(0);
                    for (let j = 0; j < validChars; j++) {
                        value = value * 85n + BigInt(BASE85_CHARS.indexOf(chunk[leadingZeros + j]));
                    }
                    
                    for (let j = nBytes - 1; j >= 0; j--) {
                        result.push(Number((value >> BigInt(8 * j)) & 255n));
                    }
                }
            }
            
            pos += 5;
        }
        
        i = chunkEnd;
    }
    
    const buf = Buffer.from(result);
    return type === 0 ? buf.toString() : buf;
};

const en_Base85 = (str: string): string => {
    const data = Buffer.from(str);
    const result: string[] = [];

    for (let i = 0; i < data.length; i += 4) {
        const chunk = data.slice(i, i + 4);
        let value = 0;
        for (let j = 0; j < chunk.length; j++) {
            value = (value << 8) | chunk[j];
        }

        if (value === 0) {
            result.push('z');
            continue;
        }

        for (let j = 4; j >= 0; j--) {
            const divisor = Math.pow(85, j);
            const digit = Math.floor(value / divisor) % 85;
            result.push(BASE85_CHARS[digit]);
        }
    }

    return result.join('');
};

export {
    is_Base85,
    de_Base85,
    en_Base85,
    is_Base85 as detect,
    de_Base85 as decode,
    en_Base85 as encode
};
