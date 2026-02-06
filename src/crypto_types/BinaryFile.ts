const hexDict: Record<string, string> = {
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
    "4D546864": "mid",
    "7573746172": "tar"
};

const fast_detect = (buf: Buffer): string[] => {
    const headBuff = buf.slice(0, 512);
    const out: string[] = [];
    for (const k in hexDict) {
        const hexBuffer = Buffer.from(k, "hex");
        if (headBuff.includes(hexBuffer)) {
            out.push(hexDict[k]);
        }
    }
    return out;
};

const full_detect = (buf: Buffer): string[] => {
    const out: string[] = [];
    for (const k in hexDict) {
        const hexBuffer = Buffer.from(k, "hex");
        if (buf.includes(hexBuffer)) {
            out.push(hexDict[k]);
        }
    }
    return out;
};

const is_BinaryFile = (buf: Buffer | string, mode: string = "fast"): string[] => {
    if (typeof buf === "string") {
        buf = Buffer.from(buf, "hex");
    }
    let out: string[] = [];
    switch (mode) {
        case "fast":
            out = fast_detect(buf);
            break;
        case "full":
            out = full_detect(buf);
            break;
    }
    return out;
};

export {
    is_BinaryFile,
    is_BinaryFile as detect
};
