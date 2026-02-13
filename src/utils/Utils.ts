const stringToCharCodes = (str: string, sep: string = ""): number[] => {
    const chars = str.split(sep);
    return chars.map(item => item.charCodeAt(0));
};

const charCodesToString = (arr: number[], sep: string = ""): string => {
    return arr.map(item => String.fromCharCode(parseInt(item.toString()))).join(sep);
};

const invertNumber = (k: number, mod: number, bf: boolean = false): number => {
    if (k === undefined || k === null || typeof k !== 'number' || isNaN(k)) {
        return 0;
    }
    if (bf) {
        for (let i = 1; i < mod; i += 2) {
            if ((i * k) % mod === 1) {
                return i;
            }
        }
    } else {
        let x1 = 1, x2 = 0, x3 = mod;
        let y1 = 0, y2 = 1, y3 = k;
        let iterations = 0;
        const maxIterations = mod * 2;
        while (1) {
            iterations++;
            if (iterations > maxIterations) {
                return 0;
            }
            if (y3 === 0) {
                break;
            }
            if (y3 === 1) {
                break;
            }
            const q = Math.floor(x3 / y3);
            const t1 = x1 - q * y1;
            const t2 = x2 - q * y2;
            const t3 = x3 - q * y3;
            x1 = y1; x2 = y2; x3 = y3;
            y1 = t1; y2 = t2; y3 = t3;
        }
        return y2;
    }
    return 0;
};

const invertBuffer = (buf: Buffer): Buffer => {
    const newBuf = Buffer.from(buf);
    for (let i = 0; i < buf.length; i++) {
        newBuf[i] = buf[buf.length - 1 - i];
    }
    return newBuf;
};

/**
 * 执行函数并返回Promise，支持同步和异步函数
 * @param fn 要执行的函数
 * @param timeout 超时时间（毫秒），默认无超时
 * @returns Promise<T>
 */
async function asyncExecute<T>(fn: Function, timeout?: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let timeoutId: NodeJS.Timeout | undefined;
        
        // 如果设置了超时，创建超时定时器
        if (timeout) {
            timeoutId = setTimeout(() => {
                reject(new Error(`Execution timed out after ${timeout}ms`));
            }, timeout);
        }
        
        // 执行函数
        const execute = async () => {
            try {
                const result = await fn();
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(result);
            } catch (error) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                reject(error);
            }
        };
        
        execute();
    });
}

/**
 * 带超时控制的函数执行器，适用于solver模块的方法
 * @param fn 要执行的函数
 * @param timeout 超时时间（毫秒），默认30000ms
 * @returns Promise<T>
 */
function executeWithTimeout<T>(fn: Function, timeout: number = 30000): Promise<T> {
    return asyncExecute(fn, timeout);
}

export {
    invertNumber,
    invertBuffer,
    stringToCharCodes,
    charCodesToString,
    asyncExecute,
    executeWithTimeout
};
