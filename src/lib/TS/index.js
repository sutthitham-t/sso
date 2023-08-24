class TS {

    #cookie;
    #user;
    #domain;

    /**
     * @param {string} user 
     */
    constructor(user = "public") {
        this.#user = user;
        this.#cookie = {
            [this.#user]: {}
        }
    }

    /**
     * 
     * @param { RequestInfo } input 
     * @param { RequestInit | undefined } init 
     * @returns { Promise<Response> }
     */
    async fetch(input, init = {}) {

        const { hostname, pathname } = new URL(input);
        this.#domain = hostname.substring(hostname.indexOf("//") + 1);

        const cookieValue = this.#getCookie(pathname);
        if (cookieValue) {
            
            if (Object.hasOwn(init, "headers")) {
                Object.assign(init.headers, { cookie: cookieValue });
            } else {
                init.headers = {
                    cookie: cookieValue
                }
            }
        }

        try {

            const response = await fetch(input, init);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const cookieArray = response.headers.getSetCookie();
            this.#saveCookie(cookieArray);

            return response;

        } catch (error) {
            
            return error;
        }
    }

    #getCookie(pathname) {

        const cookieObject = this.#cookie[this.#user][this.#domain];
        if (typeof cookieObject !== "object") return;

        const cookies = [];

        for (const key in cookieObject) {
            const pathCookie = cookieObject[key].path;
            const decodeCookie = decodeURIComponent(cookieObject[key][key]);
            if (pathCookie) {
                if (pathCookie === pathname.substring(0, pathCookie.length)) {
                    cookies.push(`${key}=${decodeCookie}`);
                }
            } else {
                cookies.push(`${key}=${decodeCookie}`);
            }
        }

        return cookies.join("; ");
    }

    #saveCookie(cookieArray = []) {

        if (!Array.isArray(cookieArray)) {
            throw new TypeError();
        }
        if (!cookieArray.length) return;

        cookieArray.forEach(elem => {
            const cookie = elem.split(";").map(elem => {
                const modifyCookie = elem.trim().split(/=(.*)/, 2);
                if (modifyCookie.length === 1) modifyCookie.push(true);
                const cookieLower = modifyCookie[0].toLowerCase();
                if (["path", "exprise", "domain"].includes(cookieLower)) {
                    modifyCookie[0] = cookieLower;
                }
                return modifyCookie;
            });

            if (typeof this.#cookie[this.#user][this.#domain] !== "object") {
                this.#cookie[this.#user][this.#domain] = {};
            }

            this.#cookie[this.#user][this.#domain][cookie[0][0]] = Object.fromEntries(cookie);
        });
    }
}

export { TS };