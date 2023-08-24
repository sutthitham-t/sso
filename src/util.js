import path from "path";
import url from "url";

/**
 * @param { object } data 
 * @returns { FormData }
 */
function createForm(data = {}) {
    const form = new FormData();
    for (const key in data) {
        form.append(key, data[key]);
    }
    return form;
}

/**
 * @param { BufferSource } input - ArrayBuffer fetch response.
 * @param { String } label - Decode type default tis-620.
 * @returns { String }
 */
function textDecode(input, label = "tis-620") {
    const textCode = new TextDecoder(label);
    return textCode.decode(input);
}

/**
 * for nodejs
 * @param { ArrayBuffer } arrayBuffer 
 * @returns { String } String base64
 */
function arrayBufferToBase64(arrayBuffer) {
    return Buffer.from(arrayBuffer).toString("base64");
}

function dirPath(metaUrl, pathName) {
    const __filename = url.fileURLToPath(metaUrl);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, pathName);
}

export default {
    createForm,
    textDecode,
    arrayBufferToBase64,
    dirPath
};