import util from "./util.js";
import { deCodeCaptcha } from "./lib/azCaptcha/index.js";

async function loginSSO(sso, retry = 1) {
  
    const resCaptcha = await sso.loadCaptcha();
    if (resCaptcha instanceof Error) return resCaptcha;
    if (!resCaptcha) return;

    const captchaBase64 = util.arrayBufferToBase64(await resCaptcha.arrayBuffer());
    const captchaCode = await deCodeCaptcha(captchaBase64);
    if (captchaCode instanceof Error) return captchaCode;
    if (!captchaCode) return;
  
    const resLogin = await sso.login(captchaCode);
    if (resLogin instanceof Error) return resLogin;
    if (!resLogin) return;
  
    if (resLogin.url.includes("login.do")) {
  
        const decodeTextLogin = util.textDecode((await resLogin.arrayBuffer()));
        if (decodeTextLogin.includes("กรอกรหัสรูปภาพไม่ถุกต้อง")) {
            if (retry <= 0) return;
            return loginSSO(sso, retry - 1);
        }
        return;
    }

    return true;
}

export { loginSSO };