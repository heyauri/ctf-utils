const EnglishFrequency = {
    'A': 8.167,
    'B': 1.492,
    'C': 2.782,
    'D': 4.253,
    'E': 12.702,
    'F': 2.228,
    'G': 2.015,
    'H': 6.094,
    'I': 6.966,
    'J': 0.153,
    'K': 0.772,
    'L': 4.025,
    'M': 2.406,
    'N': 6.749,
    'O': 7.507,
    'P': 1.929,
    'Q': 0.095,
    'R': 5.987,
    'S': 6.327,
    'T': 9.056,
    'U': 2.758,
    'V': 0.978,
    'W': 2.360,
    'X': 0.150,
    'Y': 1.974,
    'Z': 0.074
};

interface FrequencyResult {
    char: string;
    count: number;
    frequency: number;
    englishFrequency?: number;
    difference?: number;
}

interface FrequencyAnalysisResult {
    totalChars: number;
    frequencies: FrequencyResult[];
    topChars: string[];
    chiSquared?: number;
}

const analyzeFrequency = (text: string): FrequencyAnalysisResult => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const charCount: Record<string, number> = {};
    let totalChars = cleanText.length;
    
    for (const char of cleanText) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    const frequencies: FrequencyResult[] = Object.entries(charCount).map(([char, count]) => {
        const frequency = (count / totalChars) * 100;
        const englishFreq = EnglishFrequency[char as keyof typeof EnglishFrequency] || 0;
        const difference = Math.abs(frequency - englishFreq);
        
        return {
            char,
            count,
            frequency: parseFloat(frequency.toFixed(4)),
            englishFrequency: englishFreq,
            difference: parseFloat(difference.toFixed(4))
        };
    });
    
    frequencies.sort((a, b) => b.frequency - a.frequency);
    
    const topChars = frequencies.slice(0, 5).map(item => item.char);
    
    let chiSquared = 0;
    for (const item of frequencies) {
        const expected = (EnglishFrequency[item.char as keyof typeof EnglishFrequency] || 0) / 100 * totalChars;
        if (expected > 0) {
            chiSquared += Math.pow(item.count - expected, 2) / expected;
        }
    }
    
    return {
        totalChars,
        frequencies,
        topChars,
        chiSquared: parseFloat(chiSquared.toFixed(4))
    };
};

const compareWithEnglish = (text: string): { char: string; actual: number; expected: number; difference: number }[] => {
    const analysis = analyzeFrequency(text);
    const comparison = analysis.frequencies.map(item => ({
        char: item.char,
        actual: item.frequency,
        expected: item.englishFrequency || 0,
        difference: item.difference || 0
    }));
    
    comparison.sort((a, b) => a.difference - b.difference);
    return comparison;
};

const getMostFrequentChars = (text: string, limit: number = 10): string[] => {
    const analysis = analyzeFrequency(text);
    return analysis.frequencies.slice(0, limit).map(item => item.char);
};

const calculateIC = (text: string): number => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const n = cleanText.length;
    if (n <= 1) return 0;
    
    const charCount: Record<string, number> = {};
    for (const char of cleanText) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    let sum = 0;
    for (const count of Object.values(charCount)) {
        sum += count * (count - 1);
    }
    
    const ic = sum / (n * (n - 1));
    return parseFloat(ic.toFixed(4));
};

const detectLanguage = (text: string): { language: string; confidence: number } => {
    const analysis = analyzeFrequency(text);
    const ic = calculateIC(text);
    
    if (ic > 0.06) {
        return { language: 'English', confidence: parseFloat(((ic - 0.06) / 0.02 * 100).toFixed(2)) };
    } else if (ic > 0.05) {
        return { language: 'Unknown Indo-European', confidence: parseFloat(((ic - 0.05) / 0.01 * 100).toFixed(2)) };
    } else {
        return { language: 'Non-natural language', confidence: 100 - parseFloat((ic / 0.05 * 100).toFixed(2)) };
    }
};

export {
    analyzeFrequency,
    compareWithEnglish,
    getMostFrequentChars,
    calculateIC,
    detectLanguage,
    EnglishFrequency
};
