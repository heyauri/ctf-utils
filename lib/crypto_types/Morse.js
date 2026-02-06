/**
 *  Modified from npm package (morsee)
 */
const letters = {
    a: '.-',
    b: '-...',
    c: '-.-.',
    d: '-..',
    e: '.',
    f: '..-.',
    g: '--.',
    h: '....',
    i: '..',
    j: '.---',
    k: '-.-',
    l: '.-..',
    m: '--',
    n: '-.',
    o: '---',
    p: '.--.',
    q: '--.-',
    r: '.-.',
    s: '...',
    t: '-',
    u: '..-',
    v: '...-',
    w: '.--',
    x: '-..-',
    y: '-.--',
    z: '--..',
}

const numbers = {
    0: '-----',
    1: '.----',
    2: '..---',
    3: '...--',
    4: '....-',
    5: '.....',
    6: '-....',
    7: '--...',
    8: '---..',
    9: '----.',
}

const nonEnglish = {
    á: '.--.-',
    à: '..--.-',
    ä: '.-.-',
    å: '..--.-',
    ą: '.-.-',
    æ: '.-.-',
    ć: '-.-..',
    ĉ: '-.-..',
    ç: '-.-..',
    đ: '..-..',
    ð: '..--.',
    é: '..-..',
    è: '.--.-',
    ę: '..-..',
    ĝ: '--.-.',
    ĥ: '----',
    ĵ: '.---.',
    ł: '.--.-',
    ń: '--.--',
    ñ: '--.--',
    ó: '---.',
    ö: '---.',
    ø: '---.',
    ś: '...-...',
    ŝ: '...-.',
    š: '----',
    þ: '.--..',
    ü: '..--',
    ŭ: '..--',
    ź: '--..-.',
    ż: '--..-.',
}

const punctuation = {
    '&': '.-...',
    "'": '.----.',
    '@': '.--.-.',
    "$": '...-..-',
    ')': '-.--.-',
    '(': '-.--.',
    ':': '---...',
    ',': '--..--',
    ';': '-.-.-.',
    '=': '-...-',
    '!': '-.-.--',
    '.': '.-.-.-',
    '-': '-....-',
    '_': '..--.-',
    '+': '.-.-.',
    '"': '.-..-.',
    '?': '..--..',
    '/': '-..-.',
}

const extra = {
    ' ': '/',
    '\n': '.-.-',
}

const toMorse = {
    ...letters,
    ...numbers,
    ...nonEnglish,
    ...punctuation,
    ...extra,
}

const fromMorse = Object.keys(toMorse).reduce(
    (obj, char) => ({ ...obj, [toMorse[char]]: char }),
    {}
)

const en_Morse = (str) =>
    [...str.toLowerCase()].map((letter) => toMorse[letter]).join(' ')

const de_Morse = function (str, opt) {
    if (opt && opt["A"] && opt["B"]) {
        str = str.replace(new RegExp(opt["A"], "gi"), "A")
        str = str.replace(new RegExp(opt["B"], "gi"), "B")
    }
    return str.replace(/A/gi, ".")
        .replace(/B/gi, "-")
        .replace(/0/gi, ".")
        .replace(/1/gi, "-")
        .split(' ')
        .map((morse) => fromMorse[morse])
        .join('')
}

const is_Morse = function (str) {
    return /^[\.\-\sAB01\/]+$/gi.test(str);
}

module.exports = {
    is_Morse,
    en_Morse,
    de_Morse,
    detect: is_Morse,
    encode: en_Morse,
    decode: de_Morse
}