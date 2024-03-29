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
    à: '·−−·−', // shared by à, å
    ä: '·−·−', // shared by ä, æ, ą
    å: '·−−·−', // shared by à, å
    ą: '·−·−', // shared by ä, æ, ą
    æ: '·−·−', // shared by ä, æ, ą
    ć: '−·−··', // shared by ć, ĉ, ç
    ĉ: '−·−··', // shared by ć, ĉ, ç
    ç: '−·−··', // shared by ć, ĉ, ç
    đ: '··−··', // shared by đ, é, ę
    ð: '··−−·',
    é: '··−··', // shared by đ, é, ę
    è: '·−··−', // shared by è, ł
    ę: '··−··', // shared by đ, é, ę
    ĝ: '−−·−·',
    ĥ: '−−−−', // shared by ĥ, š
    ĵ: '·−−−·',
    ł: '·−··−', // shared by è, ł
    ń: '−−·−−', // shared by ń, ñ
    ñ: '−−·−−', // shared by ń, ñ
    ó: '−−−·', // shared by ó, ö, ø
    ö: '−−−·', // shared by ó, ö, ø
    ø: '−−−·', // shared by ó, ö, ø
    ś: '···−···',
    ŝ: '···−·',
    š: '−−−−', // shared by ĥ, š
    þ: '·−−··',
    ü: '··−−', // shared by ü, ŭ
    ŭ: '··−−', // shared by ü, ŭ
    ź: '−−··−·',
    ż: '−−··−',
}

const punctuation = {
    '&': '.-...',
    "'": '.----.',
    '@': '.--.-.',
    $: '···−··−',
    ')': '-.--.-',
    '(': '-.--.',
    ':': '---...',
    ',': '--..--',
    ';': '−·−·−·',
    '=': '-...-',
    '!': '-.-.--',
    '.': '.-.-.-',
    '-': '-....-',
    _: '··−−·−',
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

const de_Morse = (str) =>
    str.replace(/A/gi, ".")
        .replace(/B/gi, "-")
        .replace(/0/gi, ".")
        .replace(/1/gi, "-")
        .split(' ')
        .map((morse) => fromMorse[morse])
        .join('')

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