import { setTimeout } from "timers/promises";

class AZCaptcha {
    
    async createTask(url, formData) {

        try {

            const response = await fetch(url, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.text();
            if (!data.includes("OK")) {
                throw new Error(data);
            }

            const taskId = data.split("|");
            return taskId[1];
            
        } catch (error) {

            return error;
        }
    }

    async getResultTask(url, retry = 3) {

        try {

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.text();
            if (!data.includes("OK")) {

                if (!data.includes("CAPCHA_NOT_READY")) {
                    throw new Error(data);
                }

                if (retry > 0) {
                    await setTimeout(100);
                    return this.getResultTask(url, retry - 1);
                }
            }

            const captchaCode = data.split("|");
            return captchaCode[1];

        } catch (error) {

            return error;
        }
    }
}

export { AZCaptcha };