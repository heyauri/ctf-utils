const letters: Record<string, string> = {
    a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.',
    g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..',
    m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
    s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
    y: '-.--', z: '--..'
};

const numbers: Record<string, string> = {
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
    5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
};

const nonEnglish: Record<string, string> = {
    á: '.--.-', à: '..--.-', ä: '.-.-', å: '..--.-',
    ą: '.-.-', æ: '.-.-', ć: '-.-..', ĉ: '-.-..', ç: '-.-..',
    đ: '..-..', ð: '..--.', é: '..-..', è: '.--.-', ę: '..-..',
    ĝ: '--.-.', ĥ: '----', ĵ: '.---.', ł: '.--.-',
    ń: '--.--', ñ: '--.--', ó: '---.', ö: '---.', ø: '---.',
    ś: '...-...', ŝ: '...-.', š: '----', þ: '.--..',
    ü: '..--', ŭ: '..--', ź: '--..-.', ż: '--..-.'
};

const punctuation: Record<string, string> = {
    '&': '.-...', "'": '.----.', '@': '.--.-.', "$": '...-..-',
    ')': '-.--.-', '(': '-.--.', ':': '---...', ',': '--..--',
    ';': '-.-.-.', '=': '-...-', '!': '-.-.--', '.': '.-.-.-',
    '-': '-....-', '_': '..--.-', '+': '.-.-.', '"': '.-..-.',
    '?': '..--..', '/': '-..-.'
};

const extra: Record<string, string> = {
    ' ': '/', '\n': '.-.-'
};

const toMorse: Record<string, string> = {
    ...letters,
    ...numbers,
    ...nonEnglish,
    ...punctuation,
    ...extra
};

const fromMorse = Object.keys(toMorse).reduce(
    (obj, char) => ({ ...obj, [toMorse[char]]: char }),
    {} as Record<string, string>
);

const en_Morse = (str: string): string =>
    [...str.toLowerCase()].map((letter) => toMorse[letter]).join(' ');

const de_Morse = (str: string, opt?: Record<string, string>): string => {
    if (opt && opt["A"] && opt["B"]) {
        str = str.replace(new RegExp(opt["A"], "gi"), "A");
        str = str.replace(new RegExp(opt["B"], "gi"), "B");
    }
    return str.replace(/A/gi, ".")
        .replace(/B/gi, "-")
        .replace(/0/gi, ".")
        .replace(/1/gi, "-")
        .split(' ')
        .map((morse) => fromMorse[morse])
        .join('');
};

const is_Morse = (str: string): boolean => {
    return /^[\.\-\sAB01\/]+$/gi.test(str);
};

export {
    is_Morse,
    en_Morse,
    de_Morse,
    is_Morse as detect,
    en_Morse as encode,
    de_Morse as decode
};
