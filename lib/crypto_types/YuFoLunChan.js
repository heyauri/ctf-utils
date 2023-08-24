/**
 *  与佛论禅加解密
 */

const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");


const KEY = CryptoJS.enc.Utf8.parse('XDXDtudou@KeyFansClub^_^Encode!!');
const IV = CryptoJS.enc.Utf8.parse('Potato@Key@_@=_=');

const foYue = [
    '滅', '苦', '婆', '娑', '耶', '陀', '跋', '多', '漫', '都', '殿', '悉', '夜', '爍', '帝', '吉',
    '利', '阿', '無', '南', '那', '怛', '喝', '羯', '勝', '摩', '伽', '謹', '波', '者', '穆', '僧',
    '室', '藝', '尼', '瑟', '地', '彌', '菩', '提', '蘇', '醯', '盧', '呼', '舍', '佛', '參', '沙',
    '伊', '隸', '麼', '遮', '闍', '度', '蒙', '孕', '薩', '夷', '迦', '他', '姪', '豆', '特', '逝',
    '朋', '輸', '楞', '栗', '寫', '數', '曳', '諦', '羅', '曰', '咒', '即', '密', '若', '般', '故',
    '不', '實', '真', '訶', '切', '一', '除', '能', '等', '是', '上', '明', '大', '神', '知', '三',
    '藐', '耨', '得', '依', '諸', '世', '槃', '涅', '竟', '究', '想', '夢', '倒', '顛', '離', '遠',
    '怖', '恐', '有', '礙', '心', '所', '以', '亦', '智', '道', '。', '集', '盡', '死', '老', '至'];

const BYTEMARK = ['冥', '奢', '梵', '呐', '俱', '哆', '怯', '諳', '罰', '侄', '缽', '皤'];

function de_YuFoLunChan(str) {
    if (/[:：]/.test(str)) {
        str = str.replace(/(.*)(:|：)+(.*)/, "$3");
    }
    let buf = Buffer.alloc(0);
    let i = 0;
    while (i < str.length) {
        if (BYTEMARK.indexOf(str[i]) > -1) {
            i++;
            buf = Buffer.concat([buf, Buffer.from([foYue.indexOf(str[i]) + 128])]);
        } else {
            buf = Buffer.concat([buf, Buffer.from([foYue.indexOf(str[i])])]);
        }
        i++;
    }
    cryptor = AES.decrypt(buf.toString("base64"), KEY, { mode: CryptoJS.mode.CBC, iv: IV })
    return cryptor.toString(CryptoJS.enc.Utf16LE);
}

function is_YuFoLunChan(str) {
    return /[滅苦婆娑耶陀跋多漫都殿悉夜爍帝吉利阿無南那怛喝羯勝摩伽謹波者穆僧室藝尼瑟地彌菩提蘇醯盧呼舍佛參沙伊隸麼遮闍度蒙孕薩夷迦他姪豆特逝朋輸楞栗寫數曳諦羅曰咒即密若般故不實真訶切一除能等是上明大神知三藐耨得依諸世槃涅竟究想夢倒顛離遠怖恐有礙心所以亦智道。集盡死老至冥奢梵呐俱哆怯諳罰侄缽皤]{5,}$/.test();
}

module.exports = {
    de_YuFoLunChan,
    is_YuFoLunChan,
    detect: is_YuFoLunChan,
    decode: de_YuFoLunChan
}