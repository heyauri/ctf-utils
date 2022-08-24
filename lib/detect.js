

const detect_dict = {
    OCT: require("./crypyo_types/OCT").is_OCT,
    DangPu: require("./crypyo_types/DangPu").is_DangPu,
    YuFoLunChan: require("./crypyo_types/YuFoLunChan").is_YufoLunChan,
    OCT: require("./crypyo_types/OCT").is_OCT,
    HEX: require("./crypyo_types/HEX").is_HEX,
    Morse: require("./crypyo_types/Morse").is_Morse,
    Bacon: require("./crypyo_types/Bacon").is_Bacon,
    Exponential: require("./crypyo_types/Exponential").is_Exponential,
    BinaryFile: require("./crypyo_types/BinaryFile").is_BinaryFile,
    Poem: require("./crypyo_types/Poem").is_Poem,
    Unicode:require("./crypyo_types/Unicode").is_Unicode,
    MD5:require("./crypyo_types/MD5").is_MD5,
}

function detectAll(str) {
    let results = {};
    for(let crypto_type in detect_dict){
        results[crypto_type] = detect_dict[crypto_type](str);
    }
    return results;
}

module.exports = {
    ...detect_dict,
    detectAll
}