const leftZero4 = (str: string | number): string => {
    if (str != null && str !== '' && str !== undefined) {
        if (String(str).length === 2) {
            return '00' + str;
        }
    }
    return String(str);
};

/*
 * Unicode 编解码函数说明
 * 
 * encode 编码函数（src/encode.ts 中的 unicode1, unicode2, unicode3）:
 *   - unicode1: 将字符编码为 \uXXXX 格式（4位十六进制）
 *   - unicode2: 将字符编码为 &#XXXXX; 格式（十进制数字引用）
 *   - unicode3: 将字符编码为 &#xXXXX; 格式（十六进制数字引用）
 * 
 * decode 解码函数（src/decode.ts 中的 unicode）:
 *   - 支持解码上述三种格式的 Unicode 编码
 *   - unicode1 (\uXXXX) / unicode2 (&#XXXXX;) / unicode3 (&#xXXXX;)
 *   - 注意: 此函数名与 encode 中的函数不同，避免命名冲突
 */

const unicode1 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '\\u' + leftZero4(str.charCodeAt(i).toString(16));
    }
    return value;
};

const unicode2 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '&#' + str.charCodeAt(i) + ';';
    }
    return value;
};

const unicode3 = (str: string): string => {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '&#x' + leftZero4(str.charCodeAt(i).toString(16)) + ';';
    }
    return value;
};

const encode = (str: string, type: number): string => {
    if (type === 1) {
        return unicode1(str);
    } else if (type === 2) {
        return unicode2(str);
    } else if (type === 3) {
        return unicode3(str);
    }
    return str;
};

const decode = (str: string): string => {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0: string) {
        return (String.fromCharCode(parseInt((encodeURIComponent($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0: string) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0: string) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
};

const is_Unicode1 = (str: string): boolean => {
    return /(\\u)(\w{1,4})/gi.test(str);
};

const is_Unicode2 = (str: string): boolean => {
    return /(&#)(\d{1,6});/gi.test(str);
};

const is_Unicode3 = (str: string): boolean => {
    return /(&#x)(\w{1,4});/gi.test(str);
};

const is_Unicode = (str: string): boolean => {
    return is_Unicode1(str) || is_Unicode2(str) || is_Unicode3(str);
};

export {
    encode,
    is_Unicode,
    is_Unicode1,
    is_Unicode2,
    is_Unicode3,
    decode,
    is_Unicode as detect
};
