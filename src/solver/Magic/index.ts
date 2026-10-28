/**
 * Magic auto-decoder
 *
 * Tries all keyless decoders against the input, recursively, to discover
 * nested encodings (e.g. hex -> base64 -> plaintext). Results are ranked:
 * flag-like matches first, then shallow decodings.
 */

import { decodeSync } from "../../decode";
import { detectSync } from "../../detect";

export interface MagicOptions {
    /** Maximum decoding depth (default 3) */
    maxDepth?: number;
    /** Maximum number of results to return (default 20) */
    maxResults?: number;
    /** Also try keyed ciphers (Vigenere, ADFGVX, ...) using this key */
    key?: string;
}

export interface MagicResult {
    /** Decoder chain, e.g. ['Base16', 'Base64'] */
    path: string[];
    /** Final decoded string */
    result: string;
    /** Number of decoding steps used */
    depth: number;
    /** Heuristic score: flag-like content and readable text rank higher */
    score: number;
}

// Decoders that work without any key. Order matters for tie-breaking.
const KEYLESS_DECODERS = [
    'Base16', 'HEX', 'Base32', 'Base58', 'Base62', 'Base64', 'Base85', 'Base91',
    'OCT', 'Decimal', 'BinStr', 'URL', 'HTML', 'Unicode', 'JQ',
    'Morse', 'Brainfuck', 'Ook', 'Atbash', 'ROT', 'Caesar',
    'DangPu', 'ZaHuoPu', 'Exponential', 'YuFoLunChan', 'Polybius', 'Bacon'
];

// Ciphers that require a key; only attempted when options.key is provided.
const KEYED_DECODERS: Array<{ name: string; transform?: (key: string) => unknown }> = [
    { name: 'Vigenere' },
    { name: 'ADFGVX' },
    { name: 'Playfair' },
    { name: 'SimpleSub' },
    { name: 'RailFence', transform: (key) => parseInt(key, 10) },
    { name: 'ROT', transform: (key) => parseInt(key, 10) },
    { name: 'Caesar', transform: (key) => parseInt(key, 10) }
];

const isPrintable = (s: string): boolean => {
    if (!s) return false;
    let printable = 0;
    let total = 0;
    for (const ch of s) {
        total++;
        const c = ch.codePointAt(0)!;
        if (c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126) || (c >= 0x4e00 && c <= 0x9fff)) {
            printable++;
        }
    }
    return total > 0 && printable / total >= 0.95;
};

const scoreResult = (s: string): number => {
    let score = 0;
    if (/ctf\{|flag\{|key\{/i.test(s)) score += 100;
    else if (/ctf|flag|secret|pass/i.test(s)) score += 50;
    if (s.includes(' ')) score += 5;
    return score;
};

const lettersAndSpaceRatio = (s: string): number => {
    if (!s.length) return 0;
    const good = (s.match(/[a-zA-Z0-9\s]/g) || []).length;
    return good / s.length;
};

/**
 * Automatically try all keyless decoders (recursively) on the input.
 * @param input Encoded/unknown input string
 * @param options Options
 * @returns Ranked candidate decodings
 */
const autoDecode = (input: string, options: MagicOptions = {}): MagicResult[] => {
    const { maxDepth = 3, maxResults = 20, key } = options;
    const results: MagicResult[] = [];
    const expanded = new Set<string>([input]);

    const tryDecode = (method: string, decoder: (str: string, ...rest: unknown[]) => string | Buffer, text: string, path: string[], depth: number, ...rest: unknown[]): void => {
        let output: string | Buffer;
        try {
            output = decoder(text, ...rest);
        } catch {
            return;
        }
        const str = typeof output === 'string' ? output : output.toString('utf8');
        if (!str || !str.trim() || str === text || !isPrintable(str) || str.includes('Not Expected Format')) {
            return;
        }
        const score = scoreResult(str) + Math.round(lettersAndSpaceRatio(str) * 40) + (depth === 1 ? 10 : 0);
        results.push({ path: [...path, method], result: str, depth, score });
        if (depth < maxDepth && !expanded.has(str)) {
            expanded.add(str);
            walk(str, [...path, method], depth + 1);
        }
    };

    const walk = (text: string, path: string[], depth: number): void => {
        for (const method of KEYLESS_DECODERS) {
            const decoder = (decodeSync as Record<string, (str: string, ...rest: unknown[]) => string | Buffer>)[method];
            if (typeof decoder === 'function') {
                tryDecode(method, decoder, text, path, depth);
            }
        }
        if (key !== undefined) {
            for (const { name, transform } of KEYED_DECODERS) {
                const decoder = (decodeSync as Record<string, (str: string, ...rest: unknown[]) => string | Buffer>)[name];
                if (typeof decoder !== 'function') continue;
                const decodedKey = transform ? transform(key) : key;
                if (typeof decodedKey === 'number' && (isNaN(decodedKey) || (name === 'RailFence' && decodedKey < 2))) continue;
                tryDecode(`${name}(${key})`, decoder, text, path, depth, decodedKey);
            }
        }
    };

    walk(input, [], 1);

    // Deduplicate by output, keeping the shallowest decoding path for each result.
    const best = new Map<string, MagicResult>();
    for (const r of results) {
        const cur = best.get(r.result);
        if (!cur || r.depth < cur.depth || (r.depth === cur.depth && r.path.length < cur.path.length)) {
            best.set(r.result, r);
        }
    }

    return [...best.values()]
        .sort((a, b) => (b.score - a.score) || (a.depth - b.depth))
        .slice(0, maxResults);
};

/**
 * Detect which encodings the input could be (helper around detectSync).
 * @param input Input string
 * @returns Names of encodings whose detect() returns true
 */
const detectAll = (input: string): string[] => {
    const out: string[] = [];
    for (const [name, fn] of Object.entries(detectSync)) {
        if (typeof fn !== 'function') continue;
        try {
            if ((fn as (s: string) => boolean)(input)) out.push(name);
        } catch {
            // ignore detectors that crash on odd input
        }
    }
    return out;
};

export {
    autoDecode,
    autoDecode as magicDecode,
    autoDecode as decode,
    detectAll,
    detectAll as detect
};
