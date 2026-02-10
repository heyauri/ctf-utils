const getRailFencePattern = (rails: number, length: number): number[] => {
    const pattern: number[] = new Array(length).fill(0);
    let row = 0;
    let direction = 1;
    
    for (let i = 0; i < length; i++) {
        pattern[i] = row;
        if (row === 0) direction = 1;
        if (row === rails - 1) direction = -1;
        row += direction;
    }
    return pattern;
};

const en_RailFence = (input: string, rails: number): string => {
    if (rails <= 1) return input;
    
    const pattern = getRailFencePattern(rails, input.length);
    const railsArr: string[][] = Array.from({ length: rails }, () => []);
    
    for (let i = 0; i < input.length; i++) {
        railsArr[pattern[i]].push(input[i]);
    }
    
    return railsArr.map(r => r.join('')).join('');
};

const de_RailFence = (input: string, rails: number): string => {
    if (rails <= 1) return input;
    
    const length = input.length;
    const pattern = getRailFencePattern(rails, length);
    const railLengths: number[] = Array(rails).fill(0);
    
    for (let i = 0; i < length; i++) {
        railLengths[pattern[i]]++;
    }
    
    const railsArr: string[][] = Array.from({ length: rails }, () => []);
    let idx = 0;
    for (let r = 0; r < rails; r++) {
        railsArr[r] = input.slice(idx, idx + railLengths[r]).split('');
        idx += railLengths[r];
    }
    
    const result: string[] = new Array(length);
    let railIdx: number[] = Array(rails).fill(0);
    
    for (let i = 0; i < length; i++) {
        const r = pattern[i];
        result[i] = railsArr[r][railIdx[r]++];
    }
    
    return result.join('');
};

const is_RailFence = (input: string): boolean => {
    return false;
};

export {
    en_RailFence,
    de_RailFence,
    en_RailFence as encode,
    de_RailFence as decode,
    is_RailFence as detect
};
