/**
 * Classical cipher cracker suite
 *
 * Frequency-analysis based automatic cracking for Caesar, Vigenere and XOR.
 * Complements the FrequencyAnalysis module with ready-to-use attack routines.
 */

import { EnglishFrequency, calculateIC } from './FrequencyAnalysis';
import { decodeSync } from '../../decode';

const ENGLISH_FREQ: Record<string, number> = EnglishFrequency;

export interface CaesarCandidate {
    /** Shift applied for decryption (decode.Caesar(text, shift)) */
    shift: number;
    decrypted: string;
    /** Chi-squared score against English letter frequencies (lower = better) */
    score: number;
}

export interface VigenereKeyLengthCandidate {
    length: number;
    /** Average index of coincidence across columns */
    ic: number;
}

export interface VigenereCrackResult {
    key: string;
    decrypted: string;
    keyLength: number;
    /** Chi-squared score of the decryption (lower = better) */
    score: number;
}

export interface XORCandidate {
    /** Single byte key, or one byte per column for multi-byte keys */
    key: number[];
    result: string;
    /** Score: printable + English-frequency fitness (higher = better) */
    score: number;
}

const chiSquared = (text: string): number => {
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!letters.length) return Infinity;
    let chi = 0;
    for (const letter of Object.keys(ENGLISH_FREQ)) {
        const observed = (letters.match(new RegExp(letter, 'g')) || []).length;
        const expected = (ENGLISH_FREQ[letter] / 100) * letters.length;
        chi += (observed - expected) ** 2 / Math.max(expected, 0.5);
    }
    return chi;
};

/**
 * Brute force all 26 Caesar shifts, ranked by English letter frequency.
 * @param text Ciphertext
 * @returns Candidates sorted best (lowest chi-squared) first
 */
const caesarBrute = (text: string): CaesarCandidate[] => {
    const candidates: CaesarCandidate[] = [];
    for (let shift = 0; shift < 26; shift++) {
        let decrypted: string | Buffer;
        try {
            decrypted = decodeSync.Caesar(text, shift);
        } catch {
            continue;
        }
        const str = typeof decrypted === 'string' ? decrypted : decrypted.toString('utf8');
        candidates.push({ shift, decrypted: str, score: parseFloat(chiSquared(str).toFixed(4)) });
    }
    return candidates.sort((a, b) => a.score - b.score);
};

/**
 * Analyze possible Vigenere key lengths using the index of coincidence.
 * @param text Ciphertext (letters only are considered)
 * @param maxLength Maximum key length to consider (default 20)
 * @returns Key lengths sorted best (highest average IC) first
 */
const vigenereKeyLength = (text: string, maxLength: number = 20): VigenereKeyLengthCandidate[] => {
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    const candidates: VigenereKeyLengthCandidate[] = [];
    for (let len = 1; len <= Math.min(maxLength, Math.floor(letters.length / 2)); len++) {
        let sumIC = 0;
        let columns = 0;
        for (let col = 0; col < len; col++) {
            const column = letters.split('').filter((_, i) => i % len === col).join('');
            if (column.length < 2) continue;
            sumIC += calculateIC(column);
            columns++;
        }
        if (columns > 0) {
            candidates.push({ length: len, ic: parseFloat((sumIC / columns).toFixed(4)) });
        }
    }
    return candidates.sort((a, b) => b.ic - a.ic);
};

// Top English digrams — used to rank full decryptions. Column-wise overfitting
// preserves unigram frequencies but destroys digram structure, so this metric
// reliably separates the true key from per-column overfit candidates.
const TOP_DIGRAMS = [
    'TH', 'HE', 'IN', 'ER', 'AN', 'RE', 'ON', 'AT', 'EN', 'ND',
    'TI', 'ES', 'OR', 'TE', 'OF', 'ED', 'IS', 'IT', 'AL', 'AR',
    'ST', 'TO', 'NT', 'NG', 'SE', 'HA', 'AS', 'OU', 'IO', 'WE'
];

const digramScore = (text: string): number => {
    const upper = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length < 2) return 0;
    let hits = 0;
    for (let i = 0; i < upper.length - 1; i++) {
        if (TOP_DIGRAMS.includes(upper.slice(i, i + 2))) hits++;
    }
    return hits / (upper.length - 1);
};

// Common English trigrams, weighted more heavily to disambiguate near-miss keys
const TOP_TRIGRAMS = [
    'THE', 'AND', 'ING', 'HER', 'HAT', 'HIS', 'THA', 'ERE', 'FOR', 'ENT',
    'ION', 'TER', 'WAS', 'YOU', 'ITH', 'VER', 'ALL', 'WITH', 'THAT', 'THIS'
];

/** Combined fitness: digram rate plus a double-weighted trigram rate */
const fitnessScore = (text: string): number => {
    const upper = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length < 3) return 0;
    let di = 0;
    for (let i = 0; i < upper.length - 1; i++) {
        if (TOP_DIGRAMS.includes(upper.slice(i, i + 2))) di++;
    }
    let tri = 0;
    for (let i = 0; i < upper.length - 2; i++) {
        if (TOP_TRIGRAMS.includes(upper.slice(i, i + 3))) tri++;
    }
    return di / (upper.length - 1) + 2 * (tri / Math.max(upper.length - 2, 1));
};

// Common English words (>= 3 letters) plus CTF vocabulary. Real-word hits are
// far harder to fake by overfitting than n-gram hits, so they are the primary
// signal for ranking full decryptions.
const COMMON_WORDS = [
    'THE', 'AND', 'THAT', 'HAVE', 'FOR', 'NOT', 'WITH', 'YOU', 'THIS', 'BUT',
    'HIS', 'FROM', 'THEY', 'SAY', 'HER', 'SHE', 'WILL', 'ONE', 'ALL', 'WOULD',
    'THERE', 'THEIR', 'WHAT', 'OUT', 'ABOUT', 'WHO', 'GET', 'WHICH', 'WHEN',
    'MAKE', 'CAN', 'LIKE', 'TIME', 'JUST', 'HIM', 'KNOW', 'TAKE', 'PEOPLE',
    'INTO', 'YEAR', 'YOUR', 'GOOD', 'SOME', 'COULD', 'THEM', 'SEE', 'OTHER',
    'THAN', 'THEN', 'NOW', 'LOOK', 'ONLY', 'COME', 'ITS', 'OVER', 'ALSO',
    'BACK', 'AFTER', 'USE', 'TWO', 'HOW', 'OUR', 'WORK', 'FIRST', 'WELL',
    'WAY', 'EVEN', 'NEW', 'WANT', 'ANY', 'THESE', 'GIVE', 'DAY', 'MOST',
    'ATTACK', 'SECRET', 'FLAG', 'KEY', 'PASSWORD', 'ADMIN', 'LOGIN', 'ROOT',
    'SHELL', 'CRYPTO', 'CIPHER', 'ENCODE', 'DECODE', 'SERVER', 'IMAGE',
    'FILE', 'HIDDEN', 'MESSAGE', 'FIND', 'MEET', 'MEETING', 'NIGHT', 'DAWN',
    'DUSK', 'GATE', 'ENTER', 'LEAVE', 'MOVE', 'WAIT', 'SEND', 'HELP', 'CALL',
    'TELL', 'READ', 'WRITE', 'OPEN', 'CLOSE', 'START', 'STOP', 'NEXT', 'LAST',
    'LONG', 'SHORT', 'WORD', 'LETTER', 'NUMBER', 'GROUP', 'SECTION', 'CAREFUL',
    'QUICK', 'BROWN', 'JUMP', 'LAZY', 'DOG', 'FOX', 'DISCOVER', 'FLEE', 'ONCE',
    'UPON', 'SAID', 'ASK', 'ANSWER', 'QUESTION', 'WHERE', 'WHY', 'HERE',
    'WORLD', 'HELLO', 'TEST', 'TEXT', 'DATA', 'CODE', 'CASE', 'SAME', 'MUST',
    'MAN', 'MEN', 'WOMAN', 'CHILD', 'WORLD', 'LIFE', 'PART', 'PLACE', 'RIGHT',
    'THINK', 'SAY', 'GREAT', 'STILL', 'SMALL', 'LARGE', 'POINT', 'END'
];

/** Score text by distinct common-word hits, weighted by word length squared */
const wordScore = (text: string): number => {
    const upper = text.toUpperCase().replace(/[^A-Z]/g, ' ');
    let score = 0;
    for (const word of COMMON_WORDS) {
        if (upper.includes(word)) {
            score += word.length * word.length;
        }
    }
    return score;
};

/**
 * Fully automatic Vigenere crack: seed the key per-column with chi-squared,
 * then hill-climb each column against the digram fitness of the full
 * decryption so every decision uses its surrounding context.
 * @param text Ciphertext
 * @param maxKeyLength Maximum key length to consider (default 20)
 * @returns Best crack result
 */
const vigenereCrack = (text: string, maxKeyLength: number = 20): VigenereCrackResult | null => {
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (letters.length < 8) return null;

    const decryptWith = (key: string): string =>
        letters
            .split('')
            .map((c, i) => {
                const shift = key.charCodeAt(i % key.length) - 65;
                return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            })
            .join('');

    // IC estimates need enough samples per column to be meaningful;
    // this also caps spurious long keys (Occam: shortest plausible key wins)
    // Two-pass: strict per-column sampling first (reliable IC + hill climb);
    // only relax if no candidate looks like real plaintext.
    const maxLen = Math.min(maxKeyLength, Math.floor(letters.length / 5));
    const allLengths = vigenereKeyLength(text, maxLen)
        .filter(c => letters.length / c.length >= 5);
    const strictLengths = allLengths.filter(c => letters.length / c.length >= 10);

    const runPass = (lengthList: VigenereKeyLengthCandidate[]): VigenereCrackResult | null => {
        const candidates: VigenereCrackResult[] = [];

        for (const { length } of lengthList) {
            const hillClimb = (startKey: string): { key: string; score: number } => {
                let key = startKey;
                let score = fitnessScore(decryptWith(key));
                let improved = true;
                while (improved) {
                    improved = false;
                    let bestCol = -1;
                    let bestChar = '';
                    let bestScore = score;
                    for (let col = 0; col < length; col++) {
                        const original = key[col];
                        for (let s = 0; s < 26; s++) {
                            const ch = String.fromCharCode(65 + s);
                            if (ch === original) continue;
                            const trialKey = key.slice(0, col) + ch + key.slice(col + 1);
                            const trialScore = fitnessScore(decryptWith(trialKey));
                            if (trialScore > bestScore) {
                                bestScore = trialScore;
                                bestCol = col;
                                bestChar = ch;
                            }
                        }
                    }
                    if (bestCol >= 0) {
                        key = key.slice(0, bestCol) + bestChar + key.slice(bestCol + 1);
                        score = bestScore;
                        improved = true;
                    }
                }
                return { key, score };
            };

            // Seed 1: per-column chi-squared
            let seed = '';
            for (let col = 0; col < length; col++) {
                const column = letters.split('').filter((_, i) => i % length === col).join('');
                let bestShift = 0;
                let bestChi = Infinity;
                for (let shift = 0; shift < 26; shift++) {
                    const decrypted = column
                        .split('')
                        .map(c => String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65))
                        .join('');
                    const chi = chiSquared(decrypted);
                    if (chi < bestChi) {
                        bestChi = chi;
                        bestShift = shift;
                    }
                }
                seed += String.fromCharCode(65 + bestShift);
            }

            // Multi-start: keep the best of the chi-squared seed and a few
            // deterministic pseudo-random restarts (escape bad local optima)
            let lcg = (length * 7919 + letters.length) % 2147483647;
            const nextRandom = () => {
                lcg = (lcg * 48271) % 2147483647;
                return lcg / 2147483647;
            };
            let best = hillClimb(seed);
            for (let restart = 0; restart < 6; restart++) {
                const randomSeed = Array.from({ length }, () =>
                    String.fromCharCode(65 + Math.floor(nextRandom() * 26))
                ).join('');
                const attempt = hillClimb(randomSeed);
                if (attempt.score > best.score) best = attempt;
            }

            const key = best.key;
            const decrypted = decryptWith(key);
            candidates.push({
                key,
                decrypted,
                keyLength: length,
                score: parseFloat(chiSquared(decrypted).toFixed(4))
            });
        }

        // Rank by distinct real-word hits (primary, hard to overfit), then
        // n-gram fitness (secondary).
        candidates.sort((a, b) => wordScore(b.decrypted) - wordScore(a.decrypted) || fitnessScore(b.decrypted) - fitnessScore(a.decrypted) || a.score - b.score);
        return candidates[0] || null;
    };

    const strictPass = runPass(strictLengths.length > 0 ? strictLengths : allLengths);
    if (strictPass && wordScore(strictPass.decrypted) >= 40) {
        return strictPass;
    }
    const relaxedPass = runPass(allLengths);
    return relaxedPass || strictPass;
};

const printableScore = (bytes: number[]): { text: string; score: number } => {
    let score = 0;
    let text = '';
    for (const b of bytes) {
        if (b === 9 || b === 10 || b === 13) {
            score += 1;
            text += String.fromCharCode(b);
        } else if (b >= 32 && b <= 126) {
            const ch = String.fromCharCode(b);
            text += ch;
            // Letters and spaces are strong signals; punctuation is neutral.
            // Lowercase is preferred: normal English text is mostly lowercase,
            // which breaks the XOR-32 case-flip tie between candidate keys.
            if (/[a-z]/.test(ch)) score += 3;
            else if (/[A-Z]/.test(ch)) score += 2.5;
            else if (ch === ' ') score += 2;
            else if (/[0-9]/.test(ch)) score += 1;
            else score += 0.5;
        } else {
            score -= 3;
            text += '\uFFFD';
        }
    }
    // English frequency fitness on the decodable part
    const upper = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length) {
        let fitness = 0;
        for (const letter of Object.keys(ENGLISH_FREQ)) {
            const observed = (upper.match(new RegExp(letter, 'g')) || []).length;
            const expected = (ENGLISH_FREQ[letter] / 100) * upper.length;
            fitness -= Math.abs(observed - expected);
        }
        score += fitness / Math.max(upper.length, 1);
        // Real-word hits are the decisive signal: letter/space counts alone
        // cannot separate 'The quick brown fox' from letter-soup of equal shape
        score += wordScore(text) / 5;
    }
    return { text, score: parseFloat(score.toFixed(4)) };
};

/**
 * Find the most likely XOR key(s) using printable + English frequency scoring.
 * @param input Encrypted input (string treated as raw bytes, or array of byte values)
 * @param keyLength Key length in bytes (default 1)
 * @param maxResults Maximum number of candidates (default 10)
 * @returns Candidates sorted best first
 */
const bestXORKey = (input: string | number[] | Buffer, keyLength: number = 1, maxResults: number = 10): XORCandidate[] => {
    let bytes: number[];
    if (Buffer.isBuffer(input)) {
        bytes = [...input];
    } else if (Array.isArray(input)) {
        bytes = input;
    } else {
        bytes = [...Buffer.from(input, 'binary')];
    }
    if (!bytes.length) return [];

    const candidates: XORCandidate[] = [];
    const key = new Array<number>(keyLength).fill(0);
    const perColumn = keyLength;

    const solveFrom = (col: number): void => {
        if (col === perColumn) {
            const decoded = bytes.map((b, i) => b ^ key[i % keyLength]);
            const { text, score } = printableScore(decoded);
            candidates.push({ key: [...key], result: text, score });
            return;
        }
        for (let k = 0; k < 256; k++) {
            key[col] = k;
            solveFrom(col + 1);
        }
    };

    if (keyLength === 1) {
        for (let k = 0; k < 256; k++) {
            key[0] = k;
            const decoded = bytes.map(b => b ^ k);
            const { text, score } = printableScore(decoded);
            candidates.push({ key: [k], result: text, score });
        }
    } else if (keyLength <= 4 && bytes.length >= keyLength * 4) {
        // Per-column independent solving as the seed, then steepest-ascent
        // refinement against the full-text score (short columns alone are noisy)
        for (let col = 0; col < perColumn; col++) {
            const columnBytes = bytes.filter((_, i) => i % perColumn === col);
            let bestK = 0;
            let bestScore = -Infinity;
            for (let k = 0; k < 256; k++) {
                const { score } = printableScore(columnBytes.map(b => b ^ k));
                if (score > bestScore) {
                    bestScore = score;
                    bestK = k;
                }
            }
            key[col] = bestK;
        }
        const fullScore = (candidateKey: number[]): number =>
            printableScore(bytes.map((b, i) => b ^ candidateKey[i % candidateKey.length])).score;
        let improved = true;
        while (improved) {
            improved = false;
            let bestCol = -1;
            let bestK = 0;
            let bestScore = fullScore(key);
            for (let col = 0; col < perColumn; col++) {
                const original = key[col];
                for (let k = 0; k < 256; k++) {
                    if (k === original) continue;
                    const trialKey = [...key];
                    trialKey[col] = k;
                    const trial = fullScore(trialKey);
                    if (trial > bestScore) {
                        bestScore = trial;
                        bestCol = col;
                        bestK = k;
                    }
                }
            }
            if (bestCol >= 0) {
                key[bestCol] = bestK;
                improved = true;
            }
        }
        const decoded = bytes.map((b, i) => b ^ key[i % keyLength]);
        const { text, score } = printableScore(decoded);
        candidates.push({ key: [...key], result: text, score });
    } else {
        solveFrom(0);
    }

    return candidates.sort((a, b) => b.score - a.score).slice(0, maxResults);
};

// Common English words/sequences used as a quick readability signal
const COMMON_SEQUENCES = [
    'THE', 'AND', 'ING', 'ION', 'THAT', 'WITH', 'HAVE', 'FROM', 'THIS',
    'FLAG', 'KEY', 'CTF', 'FOR', 'NOT', 'YOU', 'ARE', 'WAS', 'HER', 'ONE',
    'ALL', 'WHEN', 'WHAT', 'CAN', 'HERE', 'HIS'
];

/**
 * Heuristic check whether text looks like readable natural language.
 * Combines a common-word signal with index of coincidence.
 * @param text Text to check
 * @param threshold Minimum IC for the fallback path (default 0.06)
 * @returns Whether the text is likely readable
 */
const isReadable = (text: string, threshold: number = 0.06): boolean => {
    const upper = text.toUpperCase();
    const letters = upper.replace(/[^A-Z]/g, '');
    if (letters.length < 10) return false;
    if (wordScore(upper) >= 16) return true;
    if (COMMON_SEQUENCES.some(seq => upper.includes(seq))) return true;
    return calculateIC(letters) >= threshold && chiSquared(letters) < 350;
};

export {
    caesarBrute,
    vigenereKeyLength,
    vigenereCrack,
    bestXORKey,
    isReadable
};
