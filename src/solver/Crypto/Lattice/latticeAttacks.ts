/**
 * 格密码学攻击工具
 * 实现LLL算法和常见的格密码学攻击
 */

export interface Vector {
  elements: number[];
}

export interface Matrix {
  rows: Vector[];
}

export interface LLLResult {
  reducedBasis: Matrix;
  determinant: number;
  iterations: number;
}

/**
 * 格密码学攻击工具类
 */
export class LatticeAttacks {
  /**
   * 计算两个向量的点积
   * @param v1 第一个向量
   * @param v2 第二个向量
   * @returns 点积结果
   */
  static dotProduct(v1: Vector, v2: Vector): number {
    if (v1.elements.length !== v2.elements.length) {
      throw new Error('向量长度不匹配');
    }
    
    return v1.elements.reduce((sum, val, index) => sum + val * v2.elements[index], 0);
  }

  /**
   * 计算向量的范数
   * @param v 向量
   * @returns 范数结果
   */
  static norm(v: Vector): number {
    return Math.sqrt(this.dotProduct(v, v));
  }

  /**
   * 向量减法
   * @param v1 第一个向量
   * @param v2 第二个向量
   * @returns 减法结果
   */
  static subtractVectors(v1: Vector, v2: Vector): Vector {
    if (v1.elements.length !== v2.elements.length) {
      throw new Error('向量长度不匹配');
    }
    
    return {
      elements: v1.elements.map((val, index) => val - v2.elements[index])
    };
  }

  /**
   * 向量加法
   * @param v1 第一个向量
   * @param v2 第二个向量
   * @returns 加法结果
   */
  static addVectors(v1: Vector, v2: Vector): Vector {
    if (v1.elements.length !== v2.elements.length) {
      throw new Error('向量长度不匹配');
    }
    
    return {
      elements: v1.elements.map((val, index) => val + v2.elements[index])
    };
  }

  /**
   * 向量数乘
   * @param v 向量
   * @param scalar 标量
   * @returns 数乘结果
   */
  static multiplyVector(v: Vector, scalar: number): Vector {
    return {
      elements: v.elements.map(val => val * scalar)
    };
  }

  /**
   * 执行LLL算法
   * @param basis 输入基矩阵
   * @param delta LLL算法参数，通常为0.75
   * @returns 约简后的基矩阵
   */
  static lllAlgorithm(basis: Matrix, delta: number = 0.75): LLLResult {
    const n = basis.rows.length;
    if (n === 0) {
      return {
        reducedBasis: { rows: [] },
        determinant: 1,
        iterations: 0
      };
    }
    
    const m = basis.rows[0].elements.length;
    if (m < n) {
      throw new Error('矩阵行数大于列数');
    }
    
    // 复制输入矩阵
    const B = basis.rows.map(row => ({ elements: [...row.elements] }));
    let iterations = 0;
    
    // 计算Gram-Schmidt正交化
    let GS = this.gramSchmidt(B);
    
    let k = 1;
    while (k < n) {
      iterations++;
      
      // 第一步：调整第k个向量
      for (let j = k - 1; j >= 0; j--) {
        const mu = this.dotProduct(B[k], GS[j]) / this.dotProduct(GS[j], GS[j]);
        const roundedMu = Math.round(mu);
        
        if (Math.abs(roundedMu) > 0) {
          B[k] = this.subtractVectors(B[k], this.multiplyVector(B[j], roundedMu));
          // 重新计算Gram-Schmidt
          GS = this.gramSchmidt(B);
        }
      }
      
      // 第二步：检查LLL条件
      const mu = this.dotProduct(B[k], GS[k-1]) / this.dotProduct(GS[k-1], GS[k-1]);
      const normSquared = this.dotProduct(GS[k], GS[k]);
      const condition = normSquared >= (delta - mu * mu) * this.dotProduct(GS[k-1], GS[k-1]);
      
      if (condition) {
        k++;
      } else {
        // 交换第k和k-1个向量
        [B[k], B[k-1]] = [B[k-1], B[k]];
        // 重新计算Gram-Schmidt
        GS = this.gramSchmidt(B);
        k = Math.max(1, k - 1);
      }
    }
    
    // 计算行列式
    let determinant = 1;
    for (let i = 0; i < n; i++) {
      determinant *= this.norm(GS[i]);
    }
    
    return {
      reducedBasis: { rows: B },
      determinant,
      iterations
    };
  }

  /**
   * Gram-Schmidt正交化
   * @param basis 输入基矩阵
   * @returns 正交化后的基矩阵
   */
  static gramSchmidt(basis: Vector[]): Vector[] {
    const n = basis.length;
    const GS = basis.map(row => ({ elements: [...row.elements] }));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        const mu = this.dotProduct(GS[i], GS[j]) / this.dotProduct(GS[j], GS[j]);
        GS[i] = this.subtractVectors(GS[i], this.multiplyVector(GS[j], mu));
      }
    }
    
    return GS;
  }

  /**
   * 破解RSA的Hastad广播攻击
   * @param moduli RSA模数数组
   * @param ciphertexts 密文数组
   * @param e 公钥指数
   * @returns 明文
   */
  static hastadBroadcastAttack(moduli: bigint[], ciphertexts: bigint[], e: bigint = 3n): bigint {
    if (moduli.length !== ciphertexts.length) {
      throw new Error('模数和密文数量不匹配');
    }
    
    const n = moduli.length;
    if (n < 2) {
      throw new Error('至少需要两个模数');
    }
    
    // 使用中国剩余定理求解
    let result = 0n;
    let product = 1n;
    
    for (let i = 0; i < n; i++) {
      const mi = moduli[i];
      const ci = ciphertexts[i];
      
      const Mi = product;
      const miInverse = this.modularInverse(BigInt(Mi), BigInt(mi));
      
      if (miInverse === -1n) {
        throw new Error('模数不互质');
      }
      
      let term = ((ci - result) * miInverse) % mi;
      if (term < 0n) {
        term += mi;
      }
      
      result += term * Mi;
      product *= mi;
    }
    
    // 开e次方根
    return this.integerRoot(result, e);
  }

  /**
   * 计算整数的n次方根
   * @param x 整数
   * @param n 根指数
   * @returns 整数根
   */
  static integerRoot(x: bigint, n: bigint): bigint {
    if (x < 0n) {
      throw new Error('不能计算负数的根');
    }
    if (x === 0n || x === 1n) {
      return x;
    }
    if (n === 1n) {
      return x;
    }
    
    let low = 1n;
    let high = x;
    
    while (low < high) {
      const mid = (low + high + 1n) / 2n;
      const midPower = this.bigintPower(mid, n);
      
      if (midPower > x) {
        high = mid - 1n;
      } else {
        low = mid;
      }
    }
    
    return low;
  }

  /**
   * 计算BigInt的幂
   * @param base 底数
   * @param exponent 指数
   * @returns 结果
   */
  static bigintPower(base: bigint, exponent: bigint): bigint {
    if (exponent === 0n) {
      return 1n;
    }
    if (exponent === 1n) {
      return base;
    }
    
    let result = 1n;
    let current = base;
    let remaining = exponent;
    
    while (remaining > 0n) {
      if (remaining % 2n === 1n) {
        result *= current;
      }
      current *= current;
      remaining = remaining / 2n;
    }
    
    return result;
  }

  /**
   * 模逆元计算（数字版本）
   * @param a 数字
   * @param m 模数
   * @returns 模逆元
   */
  static modularInverseNumber(a: number, m: number): number {
    let m0 = m;
    let y = 0;
    let x = 1;
    
    if (m === 1) {
      return 0;
    }
    
    while (a > 1) {
      const q = Math.floor(a / m);
      let t: number = m;
      
      m = a % m;
      a = t;
      t = y;
      
      y = x - q * y;
      x = t;
    }
    
    if (x < 0) {
      x += m0;
    }
    
    return x;
  }

  /**
   * 模逆元计算（BigInt版本）
   * @param a BigInt数字
   * @param m BigInt模数
   * @returns 模逆元
   */
  static modularInverseBigInt(a: bigint, m: bigint): bigint {
    let m0 = m;
    let y = 0n;
    let x = 1n;
    
    if (m === 1n) {
      return 0n;
    }
    
    while (a > 1n) {
      const q = a / m;
      let t: bigint = m;
      
      m = a % m;
      a = t;
      t = y;
      
      y = x - q * y;
      x = t;
    }
    
    if (x < 0n) {
      x += m0;
    }
    
    return x;
  }

  /**
   * 模逆元计算
   * @param a 数字
   * @param m 模数
   * @returns 模逆元
   */
  static modularInverse(a: number, m: number): number;
  static modularInverse(a: bigint, m: bigint): bigint;
  static modularInverse(a: any, m: any): any {
    if (typeof a === 'number' && typeof m === 'number') {
      return this.modularInverseNumber(a, m);
    } else if (typeof a === 'bigint' && typeof m === 'bigint') {
      return this.modularInverseBigInt(a, m);
    } else {
      throw new Error('参数类型不匹配');
    }
  }

  /**
   * 破解低指数RSA
   * @param e 公钥指数
   * @param n 模数
   * @param c 密文
   * @returns 明文
   */
  static lowExponentAttack(e: number, n: number, c: number): number {
    // 对于小e，直接尝试所有可能的明文
    let m = 0;
    while (true) {
      const candidate = this.modularExponentiation(m, e, n);
      if (candidate === c) {
        return m;
      }
      m++;
      
      // 防止无限循环
      if (m > 1000000) {
        throw new Error('未找到明文，可能需要使用格方法');
      }
    }
  }

  /**
   * 破解RSA的 Franklin-Reiter 相关消息攻击
   * @param n 模数
   * @param e 公钥指数
   * @param c1 第一个密文
   * @param c2 第二个密文
   * @param a 线性关系参数
   * @param b 线性关系参数
   * @returns 明文
   */
  static franklinReiterAttack(n: number, e: number, c1: number, c2: number, a: number, b: number): number {
    // 实现Franklin-Reiter攻击
    // 这里使用简化的实现，实际应用中可能需要更复杂的格方法
    
    // 对于e=3的情况，可以使用直接求解
    if (e === 3) {
      // 尝试所有可能的明文
      for (let m = 0; m < 1000000; m++) {
        const m1 = m;
        const m2 = a * m + b;
        
        if (this.modularExponentiation(m1, e, n) === c1 && 
            this.modularExponentiation(m2, e, n) === c2) {
          return m1;
        }
      }
    }
    
    throw new Error('未找到明文，可能需要使用更复杂的格方法');
  }



  /**
   * 模幂运算
   * @param base 底数
   * @param exponent 指数
   * @param modulus 模数
   * @returns 结果
   */
  static modularExponentiation(base: number, exponent: number, modulus: number): number {
    let result = 1;
    base = base % modulus;
    
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
    
    return result;
  }

  /**
   * 生成格基矩阵
   * @param vectors 向量数组
   * @returns 格基矩阵
   */
  static generateLatticeBasis(vectors: number[][]): Matrix {
    const rows = vectors.map(v => ({ elements: v }));
    return { rows };
  }

  /**
   * 寻找格中的短向量
   * @param basis 格基矩阵
   * @returns 短向量
   */
  static findShortVector(basis: Matrix): Vector {
    const result = this.lllAlgorithm(basis);
    return result.reducedBasis.rows[0];
  }
}

export default LatticeAttacks;