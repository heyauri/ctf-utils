// Wubi (五笔) encoding for Chinese characters

// Basic wubi encoding mapping for common Chinese characters
const WUBI_MAP: { [key: string]: string } = {
    '一': 'ggll',
    '二': 'fgg',
    '三': 'dggg',
    '四': 'lhng',
    '五': 'gghg',
    '六': 'uygy',
    '七': 'agn',
    '八': 'wt',
    '九': 'vt',
    '十': 'fg',
    '百': 'dj',
    '千': 'tfk',
    '万': 'dng',
    '亿': 'wnn',
    '零': 'fwyc',
    '壹': 'fpg',
    '贰': 'afm',
    '叁': 'cdhm',
    '肆': 'dvfh',
    '伍': 'wgg',
    '陆': 'bmg',
    '柒': 'ias',
    '捌': 'rklj',
    '玖': 'gqy',
    '拾': 'rwgk',
    '佰': 'wdj',
    '仟': 'wtfk',
    '你': 'wq',
    '我': 'trnt',
    '他': 'wb',
    '她': 'vbn',
    '它': 'pxb',
    '们': 'wu',
    '人': 'ww',
    '口': 'kkkk',
    '日': 'jjjj',
    '月': 'eeee',
    '水': 'iiii',
    '火': 'oooo',
    '木': 'ssss',
    '金': 'qqqq',
    '土': 'ffff',
    '天': 'gd',
    '地': 'fbn',
    '上': 'h',
    '下': 'ghi',
    '左': 'da',
    '右': 'dk',
    '前': 'ue',
    '后': 'rg',
    '中': 'khk',
    '东': 'aii',
    '南': 'fmuf',
    '西': 'sghg',
    '北': 'uxn',
    '大': 'dd',
    '小': 'ih',
    '多': 'qqu',
    '少': 'ito',
    '高': 'ymk',
    '低': 'wqay',
    '长': 'ta',
    '短': 'tdgu',
    '宽': 'pam',
    '窄': 'pwff',
    '厚': 'djbd',
    '薄': 'aigs',
    '快': 'nnw',
    '慢': 'njy',
    '好': 'vb',
    '坏': 'fgiy',
    '美': 'ugdu',
    '丑': 'nfd',
    '黑': 'lfo',
    '白': 'rrr',
    '红': 'xa',
    '绿': 'xv',
    '蓝': 'ajt',
    '黄': 'amw',
    '紫': 'hxxi',
    '青': 'gef',
    '橙': 'swgu',
    '赤': 'fou',
    '春': 'dwjf',
    '夏': 'dht',
    '秋': 'to',
    '冬': 'tuu',
    '早': 'jhnh',
    '晚': 'jqlq',
    '晨': 'jdf',
    '昏': 'qajf',
    '夜': 'ywty',
    '周': 'mfkd',
    '年': 'rh',
    '时': 'jf',
    '分': 'wv',
    '秒': 'tiit',
    '星期': 'jgfk',
    '周日': 'jgjj',
    '周一': 'jggg',
    '周二': 'jgfg',
    '周三': 'jgdg',
    '周四': 'jglh',
    '周五': 'jggg',
    '周六': 'jguu',
    '今天': 'wygd',
    '明天': 'jegd',
    '昨天': 'kwgd',
    '前天': 'uegd',
    '后天': 'rgdg',
    '上午': 'hhtb',
    '下午': 'ghiw',
    '晚上': 'jqlh',
    '早晨': 'jdfh',
    '中午': 'khwu',
    '黄昏': 'qajf',
    '夜晚': 'ywty',
    '国家': 'lphg',
    '中国': 'khlg',
    '美国': 'ulwg',
    '日本': 'jjgs',
    '韩国': 'ljlg',
    '英国': 'ajlg',
    '法国': 'iflg',
    '德国': 'tflg',
    '加拿大': 'lpld',
    '澳大利亚': 'idld',
    '意大利': 'ugld',
    '西班牙': 'sgld',
    '葡萄牙': 'akld',
    '巴西': 'cnld',
    '印度': 'lfld',
    '埃及': 'fble',
    '南非': 'fmfw',
    '城市': 'fdtc',
    '北京': 'uxyi',
    '上海': 'hnit',
    '广州': 'yyyt',
    '深圳': 'ipdn',
    '杭州': 'syty',
    '南京': 'fmyi',
    '武汉': 'gaul',
    '成都': 'dnnt',
    '重庆': 'tlfk',
    '西安': 'sagf',
    '天津': 'giti',
    '苏州': 'alyt',
    '大连': 'ddb',
    '青岛': 'qgiy',
    '宁波': 'piny',
    '厦门': 'dgc',
    '长沙': 'itys',
    '福州': 'pyym',
    '济南': 'gyqh',
    '哈尔滨': 'kwks',
    '沈阳': 'ibjl',
    '郑州': 'ubey',
    '合肥': 'wfnf',
    '昆明': 'jxey',
    '南宁': 'fmyn',
    '南昌': 'jfiy',
    '贵阳': 'kgym',
    '太原': 'dyii',
    '兰州': 'udyi',
    '西宁': 'sgnn',
    '银川': 'qgqk',
    '乌鲁木齐': 'ltlh',
    '拉萨': 'ifsa',
    '香港': 'jdyk',
    '澳门': 'unqu',
    '台北': 'tbyi'
};

// Reverse mapping for decoding
const REVERSE_WUBI_MAP: { [key: string]: string[] } = {};

// Build reverse mapping
Object.entries(WUBI_MAP).forEach(([char, wubi]) => {
    if (!REVERSE_WUBI_MAP[wubi]) {
        REVERSE_WUBI_MAP[wubi] = [];
    }
    if (!REVERSE_WUBI_MAP[wubi].includes(char)) {
        REVERSE_WUBI_MAP[wubi].push(char);
    }
});

/**
 * Encode Chinese text to wubi
 */
const encode = (text: string): string => {
    return text.split('').map(char => {
        return WUBI_MAP[char] || char;
    }).join(' ');
};

/**
 * Decode wubi to Chinese text (first match)
 */
const decode = (text: string): string => {
    if (text === '') {
        return '';
    }
    let result = '';
    let lastWasSpace = false;
    
    text.split(' ').forEach(wubi => {
        if (wubi === '') {
            if (!lastWasSpace) {
                result += ' ';
                lastWasSpace = true;
            }
        } else {
            result += REVERSE_WUBI_MAP[wubi]?.[0] || wubi;
            lastWasSpace = false;
        }
    });
    
    return result;
};

/**
 * Detect if text contains Chinese characters
 */
const detect = (text: string): boolean => {
    return /[\u4e00-\u9fa5]/.test(text);
};

export {
    encode,
    decode,
    detect
};
