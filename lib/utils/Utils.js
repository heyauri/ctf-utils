const string_to_char_codes = function (str, sep = "") {
    let chars = str.split(sep);
    return chars.map(item => {
        return item.charCodeAt(0);
    })
}

const char_codes_to_string = function (arr, sep = "") {
    return arr.map(item => {
        return String.fromCharCode(parseInt(item));
    }).join(sep)
}

const invert_number = function (k, mod, bf = 0) {
    if (bf) {
        for (let i = 1; i < mod; i += 2) {
            if ((i * k) % mod === 1) {
                return i;
            }
        }
    } else {
        // 求秘钥a的逆元 欧几里得算法   
        let x1 = 1, x2 = 0, x3 = mod;
        let y1 = 0, y2 = 1, y3 = k;
        // console.log(x1, x2, x3);
        let g;
        while (1) {
            if (y3 == 0) {
                g = x3
                break
            }
            if (y3 == 1) {
                g = y3
                break
            }
            q = Math.floor(x3 / y3)//向下取整
            let t1 = x1 - q * y1, t2 = x2 - q * y2, t3 = x3 - q * y3;
            x1 = y1, x2 = y2, x3 = y3;
            y1 = t1, y2 = t2, y3 = t3
            // console.log(x1, x2, x3);
        }
        return y2   // 逆元求得为y2,y3为gcd(a,26),最大公因数  
    }
}

function invert_buffer(buf) {
    let new_buf = Buffer.from(buf);
    for (let i = 0; i < buf.length; i++) {
        new_buf[i] = buf[buf.length - 1 - i]
    }
    return new_buf;
}

module.exports = {
    invert_number,
    invert_buffer,
    string_to_char_codes,
    char_codes_to_string
}