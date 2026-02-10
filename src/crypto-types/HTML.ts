const HTML_ENTITIES: Record<string, string> = {
    '&nbsp;': ' ', '&iexcl;': '¡', '&cent;': '¢', '&pound;': '£', '&curren;': '€',
    '&yen;': '¥', '&brvbar;': '¦', '&sect;': '§', '&uml;': '¨', '&copy;': '©',
    '&ordf;': 'ª', '&laquo;': '«', '&not;': '¬', '&shy;': '­', '&reg;': '®',
    '&macr;': '¯', '&deg;': '°', '&plusmn;': '±', '&sup2;': '²', '&sup3;': '³',
    '&acute;': '´', '&micro;': 'µ', '&para;': '¶', '&middot;': '·', '&cedil;': '¸',
    '&sup1;': '¹', '&ordm;': 'º', '&raquo;': '»', '&frac14;': '¼', '&frac12;': '½',
    '&frac34;': '¾', '&iquest;': '¿', '&Agrave;': 'À', '&Aacute;': 'Á', '&Acirc;': 'Â',
    '&Atilde;': 'Ã', '&Auml;': 'Ä', '&Aring;': 'Å', '&AElig;': 'Æ', '&Ccedil;': 'Ç',
    '&Egrave;': 'È', '&Eacute;': 'É', '&Ecirc;': 'Ê', '&Euml;': 'Ë', '&Igrave;': 'Ì',
    '&Iacute;': 'Í', '&Icirc;': 'Î', '&Iuml;': 'Ï', '&ETH;': 'Ð', '&Ntilde;': 'Ñ',
    '&Ograve;': 'Ò', '&Oacute;': 'Ó', '&Ocirc;': 'Ô', '&Otilde;': 'Õ', '&Ouml;': 'Ö',
    '&times;': '×', '&Oslash;': 'Ø', '&Ugrave;': 'Ù', '&Uacute;': 'Ú', '&Ucirc;': 'Û',
    '&Uuml;': 'Ü', '&Yacute;': 'Ý', '&THORN;': 'Þ', '&szlig;': 'ß', '&agrave;': 'à',
    '&aacute;': 'á', '&acirc;': 'â', '&atilde;': 'ã', '&auml;': 'ä', '&aring;': 'å',
    '&aelig;': 'æ', '&ccedil;': 'ç', '&egrave;': 'è', '&eacute;': 'é', '&ecirc;': 'ê',
    '&euml;': 'ë', '&igrave;': 'ì', '&iacute;': 'í', '&icirc;': 'î', '&iuml;': 'ï',
    '&eth;': 'ð', '&ntilde;': 'ñ', '&ograve;': 'ò', '&oacute;': 'ó', '&ocirc;': 'ô',
    '&otilde;': 'õ', '&ouml;': 'ö', '&divide;': '÷', '&oslash;': 'ø', '&ugrave;': 'ù',
    '&uacute;': 'ú', '&ucirc;': 'û', '&uuml;': 'ü', '&yacute;': 'ý', '&thorn;': 'þ',
    '&yuml;': 'ÿ', '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&apos;': "'"
};

const is_HTML = (str: string): boolean => {
    return /&[a-z]+;|&#[0-9]+;|&#x[0-9a-fA-F]+;/.test(str);
};

const de_HTML = (str: string): string => {
    let result = str;
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });
    result = result.replace(/&#([0-9]+);/g, (_, num) => {
        return String.fromCharCode(parseInt(num, 10));
    });
    result = result.replace(/&([a-z]+);/g, (_, name) => {
        const key = '&' + name + ';';
        return HTML_ENTITIES[key] || key;
    });
    return result;
};

const en_HTML = (str: string): string => {
    return str.replace(/[\u00A0-\uFFFF]/g, (char) => {
        return '&#' + char.charCodeAt(0) + ';';
    });
};

export {
    is_HTML,
    de_HTML,
    en_HTML,
    is_HTML as detect,
    de_HTML as decode,
    en_HTML as encode
};