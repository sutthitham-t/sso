import { AZCaptcha } from "./AZCaptcha.js";
import { createForm } from "./util.js";
import { setTimeout } from "timers/promises";

async function deCodeCaptcha(base64Image) {

    const az = new AZCaptcha();
    const API_KEY = "vwpnck2jm74f9vqmnlgdxgcq8rhbjwyd";
    const CREATE_TASK_URL = "https://azcaptcha.com/in.php";
    const RESULT_TASK_URL = "https://azcaptcha.com/res.php";

    const formCreateTask = createForm({
        key: API_KEY,
        method: 'base64',
        body: base64Image 
    });

    const taskId = await az.createTask(CREATE_TASK_URL, formCreateTask);
    if (taskId instanceof Error) return taskId;
    if (!taskId) return;

    await setTimeout(200);

    const searchParam = `key=${API_KEY}&action=get&id=${taskId}`;
    const capchaCode = await az.getResultTask(`${RESULT_TASK_URL}?${searchParam}`);

    return capchaCode;
}

export { deCodeCaptcha };