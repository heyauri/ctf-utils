let Bacon = require("./Bacon");
let BinaryFile = require("./BinaryFile");
let DangPu = require("./DangPu");
let Exponential = require("./Exponential");
let HEX = require("./HEX");
let MD5 = require("./MD5");
let Morse = require("./Morse");
let OCT = require("./OCT");
let Poem = require("./Poem");
let ROT = require("./ROT");
let Unicode = require("./Unicode");
let YuFoLunChan = require("./YuFoLunChan");
let ZaHuoPu = require("./ZaHuoPu");

const types = {
    Bacon,
    BinaryFile,
    DangPu,
    Exponential,
    HEX,
    MD5,
    Morse,
    OCT,
    Poem,
    ROT,
    Unicode,
    YuFoLunChan,
    ZaHuoPu
}

module.exports = {
    ...types
}

