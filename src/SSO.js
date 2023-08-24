import util from "../util.js";
import { TS } from "./lib/TS/index.js";

class SSO extends TS {

    #cacheStotage;
    #cacheDate;
    #username;
    #password;

    constructor(username, password) {

        super(username);

        this.#cacheStotage = [];
        this.#cacheDate = (new Date()).getDate();
        this.#username = username;
        this.#password = password;
    }

    cacheQuery(idCard) {

        const date = (new Date()).getDate();

        if (this.#cacheDate !== date) {
            this.#cacheStotage = [];
            this.#cacheDate = date;
            return;
        }

        return this.#cacheStotage.find(elem => {

            return elem.idCard === idCard;
        });
    }

    cacheSave(data) {

        this.#cacheStotage.push(data);
    }

    async searchData(idCard) {
        
        const formData = util.createForm({
            cmd: "goSearch",
            ssoNo: idCard
        });
        const response = await this.fetch("https://esvh.sso.go.th/esvh/hospital/hospital01SelectHospital.do", {
            method: "POST",
            body: formData
        });

        return response; 
    }

    async login(captcha) {

        const formData = util.createForm({
            cmd: "doLogin",
            login: this.#username,
            password: this.#password,
            captcha: captcha
        });

        const response = await this.fetch("https://esvh.sso.go.th/esvh/hospital/login.do", {
            method: "POST",
            body: formData
        });

        return response;
    }

    async loadCaptcha() {

        const response = await this.fetch("https://esvh.sso.go.th/esvh/captcha");
        return response;
    }

    htmlPaser(html = "") {

        const textError = '<div align="center" class="h5 font-sty-nomal error center">';
        if (html.includes(textError)) {
            const errorText = html.split(textError)[1];
            const dataError = errorText.substring(0, errorText.indexOf("</div>"));
            return {
                error: dataError
            }
        }
    
        const arrayHtml = html.split('<td class="h5 font-sty-nomal">');
        const lastHtml = arrayHtml[arrayHtml.length -1];
        const arrayLast = lastHtml.split('<td class="h5 font-sty-nomal error">')[1];
        arrayHtml.push(arrayLast);
        arrayHtml.shift();
        const dataArray = arrayHtml.map(elem => elem.substring(0, elem.indexOf("</td>")));
    
        return {
            idCard: dataArray[0],
            sex: dataArray[1],
            name: `${dataArray[2]} ${dataArray[3]}`,
            hostpital : dataArray[4],
            area: dataArray[5],
            start: dataArray[6],
            expire: dataArray[7],
            update: dataArray[8]
        }
    }
}

export { SSO };