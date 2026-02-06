const combo = function (a: any[], min?: number, max?: number) {
    min = min || 1;
    const maxVal = max !== undefined ? max : a.length;
    max = maxVal < a.length ? maxVal : a.length;
    const fn = function (n: number, src: any[], got: any[], all: any[][]) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (let j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    };
    const all: any[][] = [];
    for (let i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    if (a.length == max) all.push(a);
    return all;
};

const combinate = (obj: Record<number, string[]>): Record<number, string>[] => {
    let combos: Record<number, string>[] = [];
    for (const key in obj) {
        const values = obj[key];
        const all: Record<number, string>[] = [];
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < (combos.length || 1); j++) {
                const newCombo = { ...combos[j], [key]: values[i] };
                all.push(newCombo);
            }
        }
        combos = all;
    }
    return combos;
};

export { combinate, combo };
