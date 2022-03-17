function is_OCT(str) {
    return /^[0-7\s \/]+$/.test(str);
}

function de_OCT(str) {
    let arr = [];
    for (let c of str.split(/\s \//)) {
        arr.push(String.fromCharCode(parseInt(c, 8)))
    }
    return arr.join("");
}

function en_OCT(str) {
    let arr = [];
    for (let c of str.split("")) {
        arr.push((c.charCodeAt(0)).toString(8))
    }
    return arr.join(" ");
}

module.exports={
    is_OCT,
    de_OCT,
    en_OCT
}