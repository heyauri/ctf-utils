const hexDict = {
    "FFD8FF": "jpg",
    "89504E47": "png",
    "47494638": "gif",
    "49492A00": "tif",
    "424D": "bmp",
    "41433130": "cad",
    "38425053": "psd",
    "7B5C727466": "rtf",
    "3C3F786D6C": "xml",
    "68746D6C3E": "html",
    "44656C69766572792D646174653A": "eml",
    "CFAD12FEC5FD746F": "dbx",
    "2142444E": "pst",
    "D0CF11E0": "doc / xls",
    "5374616E64617264204A": "mdb",
    "FF575043": "wpd",
    "252150532D41646F6265": "eps",
    "255044462D312E": "pdf",
    "AC9EBD8F": "qdf",
    "E3828596": "pwl",
    "504B0304": "zip",
    "52617221": "rar",
    "57415645": "wav",
    "41564920": "avi",
    "2E7261FD": "ram",
    "2E524D46": "rm",
    "000001BA": "mpg",
    "000001B3": "mpg",
    "6D6F6F76": "mov",
    "3026B2758E66CF11": "asf",
    "4D546864": "mid"
}

// import * as fileType from "file-type";

function is_BinaryFile(buf) {
    if (Object.prototype.toString.call(buf) === "[object String]") {
        buf = Buffer.from(buf, "hex");
    }
    let headBuff = buf.slice(0, 20);
    let out = []
    for (let k in hexDict) {
        headBuff.includes(k, "hex") ? out.push(hexDict[k]) : "";
    }
    return out;
}

module.exports = {
    is_BinaryFile,
    detect: is_BinaryFile
}