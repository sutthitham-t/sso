import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import util from "./util.js";
import { sso } from "./src/index.js";

const app = express();
const port = process.env.PORT || 3000;
const checkSSO = sso();

app.use(express.static(util.dirPath(import.meta.url, "public")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", util.dirPath(import.meta.url, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {

    res.render("index");
});

app.post("/SSO", (req, res) => {
    
    const { idCard } = req.body;

    if (idCard.length !== 13) {
        res.json({
            error: "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง"
        });
        return;
    }

    const username = "221004402";
    const password = "emergency";

    checkSSO(idCard, username, password)
        .then(data => {
            if (!data) throw data;
            if (data instanceof Error) throw data;

            res.json(data);
        })
        .catch(error => {

            const errorPath = util.dirPath(import.meta.url, "error.txt");
            util.logError(error, errorPath);
            

            res.json({
                error: "ขณะนี้ระบบเกิดเหตุขัดข้องชั่วคราว..กรุณาลองใหม่อีกครั้งในภายหลัง !!"
            });
        });

});

app.listen(port, () => {
    console.log(`Server running port ${port}`);
});