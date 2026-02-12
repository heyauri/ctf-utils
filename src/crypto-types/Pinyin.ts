// Pinyin encoding for Chinese characters

// Basic pinyin mapping for common Chinese characters
const PINYIN_MAP: { [key: string]: string } = {
    '一': 'yi',
    '二': 'er',
    '三': 'san',
    '四': 'si',
    '五': 'wu',
    '六': 'liu',
    '七': 'qi',
    '八': 'ba',
    '九': 'jiu',
    '十': 'shi',
    '百': 'bai',
    '千': 'qian',
    '万': 'wan',
    '亿': 'yi',
    '零': 'ling',
    '壹': 'yi',
    '贰': 'er',
    '叁': 'san',
    '肆': 'si',
    '伍': 'wu',
    '陆': 'liu',
    '柒': 'qi',
    '捌': 'ba',
    '玖': 'jiu',
    '拾': 'shi',
    '佰': 'bai',
    '仟': 'qian',
    '你': 'ni',
    '我': 'wo',
    '他': 'ta',
    '她': 'ta',
    '它': 'ta',
    '们': 'men',
    '人': 'ren',
    '口': 'kou',
    '日': 'ri',
    '月': 'yue',
    '水': 'shui',
    '火': 'huo',
    '木': 'mu',
    '金': 'jin',
    '土': 'tu',
    '天': 'tian',
    '地': 'di',
    '上': 'shang',
    '下': 'xia',
    '左': 'zuo',
    '右': 'you',
    '前': 'qian',
    '后': 'hou',
    '中': 'zhong',
    '东': 'dong',
    '南': 'nan',
    '西': 'xi',
    '北': 'bei',
    '大': 'da',
    '小': 'xiao',
    '多': 'duo',
    '少': 'shao',
    '高': 'gao',
    '低': 'di',
    '长': 'chang',
    '短': 'duan',
    '宽': 'kuan',
    '窄': 'zhai',
    '厚': 'hou',
    '薄': 'bao',
    '快': 'kuai',
    '慢': 'man',
    '好': 'hao',
    '坏': 'huai',
    '美': 'mei',
    '丑': 'chou',
    '黑': 'hei',
    '白': 'bai',
    '红': 'hong',
    '绿': 'lv',
    '蓝': 'lan',
    '黄': 'huang',
    '紫': 'zi',
    '青': 'qing',
    '橙': 'cheng',
    '赤': 'chi',
    '春': 'chun',
    '夏': 'xia',
    '秋': 'qiu',
    '冬': 'dong',
    '早': 'zao',
    '晚': 'wan',
    '晨': 'chen',
    '昏': 'hun',
    '夜': 'ye',
    '周': 'zhou',
    '年': 'nian',
    '时': 'shi',
    '分': 'fen',
    '秒': 'miao',
    '星期': 'xingqi',
    '周日': 'zhouri',
    '周一': 'zhouyi',
    '周二': 'zhouer',
    '周三': 'zhousan',
    '周四': 'zhousi',
    '周五': 'zhouwu',
    '周六': 'zhouliu',
    '今天': 'jintian',
    '明天': 'mingtian',
    '昨天': 'zuotian',
    '前天': 'qiantian',
    '后天': 'houtian',
    '上午': 'shangwu',
    '下午': 'xiawu',
    '晚上': 'wanshang',
    '早晨': 'zaochen',
    '中午': 'zhongwu',
    '黄昏': 'huanghun',
    '夜晚': 'yewan',
    '国家': 'guojia',
    '中国': 'zhongguo',
    '美国': 'meiguo',
    '日本': 'riben',
    '韩国': 'hanguo',
    '英国': 'yingguo',
    '法国': 'faguo',
    '德国': 'deguo',
    '俄罗斯': 'eluosi',
    '加拿大': 'jianada',
    '澳大利亚': 'aodaliya',
    '意大利': 'yidali',
    '西班牙': 'xibanya',
    '葡萄牙': 'putaoya',
    '巴西': 'baxi',
    '印度': 'yindu',
    '印度尼西亚': 'yindunixiya',
    '墨西哥': 'moxige',
    '埃及': 'aiji',
    '南非': 'nanfei',
    '城市': 'chengshi',
    '北京': 'beijing',
    '上海': 'shanghai',
    '广州': 'guangzhou',
    '深圳': 'shenzhen',
    '杭州': 'hangzhou',
    '南京': 'nanjing',
    '武汉': 'wuhan',
    '成都': 'chengdu',
    '重庆': 'chongqing',
    '西安': 'xian',
    '天津': 'tianjin',
    '苏州': 'suzhou',
    '大连': 'dalian',
    '青岛': 'qingdao',
    '宁波': 'ningbo',
    '厦门': 'xiamen',
    '长沙': 'changsha',
    '福州': 'fuzhou',
    '济南': 'jinan',
    '哈尔滨': 'haerbin',
    '沈阳': 'shenyang',
    '郑州': 'zhengzhou',
    '合肥': 'hefei',
    '昆明': 'kunming',
    '南宁': 'nanning',
    '南昌': 'nanchang',
    '贵阳': 'guiyang',
    '太原': 'taiyuan',
    '兰州': 'lanzhou',
    '西宁': 'xining',
    '银川': 'yinchuan',
    '乌鲁木齐': 'wulumuqi',
    '拉萨': 'lasa',
    '香港': 'xianggang',
    '澳门': 'aomen',
    '台北': 'taibei',
    '高雄': 'gaoxiong',
    '台南': 'tainan',
    '台中': 'taizhong',
    '桃园': 'taoyuan',
    '新北': 'xinbei'
};

// Reverse mapping for decoding
const REVERSE_PINYIN_MAP: { [key: string]: string[] } = {};

// Build reverse mapping
Object.entries(PINYIN_MAP).forEach(([char, pinyin]) => {
    if (!REVERSE_PINYIN_MAP[pinyin]) {
        REVERSE_PINYIN_MAP[pinyin] = [];
    }
    if (!REVERSE_PINYIN_MAP[pinyin].includes(char)) {
        REVERSE_PINYIN_MAP[pinyin].push(char);
    }
});

/**
 * Encode Chinese text to pinyin
 */
const encode = (text: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const encoded = PINYIN_MAP[char] || char;
        result += encoded;
        if (i < text.length - 1) {
            result += ' ';
        }
    }
    return result;
};

/**
 * Decode pinyin to Chinese text (first match)
 */
const decode = (text: string): string => {
    if (text === '') {
        return '';
    }
    let result = '';
    let lastWasSpace = false;
    
    text.split(' ').forEach(pinyin => {
        if (pinyin === '') {
            if (!lastWasSpace) {
                result += ' ';
                lastWasSpace = true;
            }
        } else {
            result += REVERSE_PINYIN_MAP[pinyin]?.[0] || pinyin;
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
