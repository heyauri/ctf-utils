const crypto_types = require("./crypto_types/_index");

const detect_dict = Object.keys(crypto_types).reduce((prev, curr) => {
    let crypto_type = crypto_types[curr];
    if (crypto_type["detect"]) {
        prev[curr] = crypto_type["detect"];
    }
    return prev;
}, {});

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