// Hill cipher
// Block cipher based on modular matrix multiplication over Z26.
// The key is a string of n*n letters (n = 2 or 3), row-major, e.g. 'GYBNQGKRA'.

const cleanText = (str: string): string => str.toUpperCase().replace(/[^A-Z]/g, '');

const buildMatrix = (key: string, n: number): number[][] => {
    const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleaned.length !== n * n) {
        throw new Error(`Hill: key must contain exactly ${n * n} letters for a ${n}x${n} matrix`);
    }
    const matrix: number[][] = [];
    for (let i = 0; i < n; i++) {
        matrix.push(Array.from({ length: n }, (_, j) => cleaned[i * n + j].charCodeAt(0) - 65));
    }
    return matrix;
};

const modInverse26 = (value: number): number => {
    for (let x = 1; x < 26; x++) {
        if ((value * x) % 26 === 1) return x;
    }
    throw new Error('Hill: matrix determinant is not invertible modulo 26');
};

const multiplyMatrix = (matrix: number[][], vector: number[]): number[] => {
    const n = matrix.length;
    return Array.from({ length: n }, (_, row) =>
        vector.reduce((sum, v, col) => (sum + matrix[row][col] * v) % 26, 0) % 26
    );
};

const matrixInverse = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    if (n === 2) {
        const [[a, b], [c, d]] = matrix;
        const det = ((a * d - b * c) % 26 + 26) % 26;
        const invDet = modInverse26(det);
        return [
            [(d * invDet) % 26, (((-b % 26) + 26) % 26) * invDet % 26],
            [(((-c % 26) + 26) % 26) * invDet % 26, (a * invDet) % 26]
        ];
    }
    if (n === 3) {
        const m = matrix;
        const cofactor = (r: number, c: number): number => {
            const rows = [0, 1, 2].filter(x => x !== r);
            const cols = [0, 1, 2].filter(x => x !== c);
            const minor = m[rows[0]][cols[0]] * m[rows[1]][cols[1]] - m[rows[0]][cols[1]] * m[rows[1]][cols[0]];
            return (r + c) % 2 === 0 ? minor : -minor;
        };
        const det = (((m[0][0] * cofactor(0, 0) + m[0][1] * cofactor(0, 1) + m[0][2] * cofactor(0, 2)) % 26) + 26) % 26;
        const invDet = modInverse26(det);
        // Adjugate (transposed cofactor matrix), scaled by invDet, mod 26
        return Array.from({ length: 3 }, (_, r) =>
            Array.from({ length: 3 }, (_, c) =>
                (((cofactor(c, r) * invDet) % 26) + 26) % 26
            )
        );
    }
    throw new Error('Hill: only 2x2 and 3x3 key matrices are supported');
};

const hill = (input: string, key: string, inverse: boolean): string => {
    const text = cleanText(input);
    if (!text) return '';
    const size = Math.sqrt(key.replace(/[^A-Za-z]/g, '').length);
    if (!Number.isInteger(size) || (size !== 2 && size !== 3)) {
        throw new Error('Hill: key must be 4 or 9 letters (2x2 or 3x3 matrix)');
    }
    const n = size;
    const matrix = buildMatrix(key, n);
    // Fail fast on non-invertible keys (encryption without decryption is useless)
    matrixInverse(matrix);
    const effectiveMatrix = inverse ? matrixInverse(matrix) : matrix;

    const padded = text + 'X'.repeat((n - (text.length % n)) % n);
    let result = '';
    for (let i = 0; i < padded.length; i += n) {
        const block = Array.from({ length: n }, (_, j) => padded.charCodeAt(i + j) - 65);
        const encrypted = multiplyMatrix(effectiveMatrix, block);
        result += encrypted.map(v => String.fromCharCode(v + 65)).join('');
    }
    return inverse ? result.replace(/X+$/, '') : result;
};

const en_Hill = (input: string, key: string): string => hill(input, key, false);
const de_Hill = (input: string, key: string): string => hill(input, key, true);

export {
    en_Hill,
    de_Hill,
    en_Hill as encode,
    de_Hill as decode
};
