import util from "./util.js";
import { SSO } from "./SSO.js";
import { loginSSO } from "./loginSSO.js";

function sso() {

    let users = {};
    let cache = false;

    async function checkSSO(idCard, username, password) {

        if (!users[username]) users[username] = new SSO(username, password);

        const sso = users[username];

        if (cache) {

            const cacheData = sso.cacheQuery(idCard);
            if (typeof cacheData === "object") {
                return cacheData;
            }
        }

        const resSearchData = await sso.searchData(idCard);
        if (!resSearchData) return;
        if (resSearchData instanceof Error) return resSearchData;
        
        if (resSearchData.url.includes("login.do")) {

            const resLogin = await loginSSO(sso);
            if (resLogin instanceof Error) return resLogin;
            if (!resLogin) return;
            cache = false;
            return checkSSO(idCard, username, password);
        }

        const decodeData = util.textDecode(await resSearchData.arrayBuffer());
        if (!decodeData.includes("ข้อมูลการเลือกสถานพยาบาล")) return;
        
        const result = sso.htmlPaser(decodeData);
        if (Object.keys(result).length === 8) {

            sso.cacheSave(result);
            cache = true;
        }

        return result;
    }

    return checkSSO;
}

export { sso };