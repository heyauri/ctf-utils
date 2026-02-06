const is_Unicode1 = (str: string): boolean => {
    return /(\\u)(\w{1,4})/gi.test(str);
};

const is_Unicode2 = (str: string): boolean => {
    return /(&#)(\d{1,6});/gi.test(str);
};

const is_Unicode3 = (str: string): boolean => {
    return /(&#x)(\w{1,4});/gi.test(str);
};

const is_Unicode = (str: string): boolean => {
    return is_Unicode1(str) || is_Unicode2(str) || is_Unicode3(str);
};

export {
    is_Unicode,
    is_Unicode as detect
};
