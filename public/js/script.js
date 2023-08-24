(function() {

    function renderData(data) {

        const thai = {
            idCard: "เลขที่บัตรประชาชน",
            sex: "เพศ",
            name: "ชื่อ-สกุล",
            hostpital: "สถานพยาบาล",
            area: "สปส.รับผิดชอบ",
            start: "วันเริ่มสิทธิ",
            expire: "วันหมดสิทธิ",
            error: "error",
            update: "ข้อมูล ณ วันที่"
        }

        let html = "";

        for (const key in data) {

            if (key === "update") {
                html += `
                    <tr>
                        <th class="text-start" style="width: 40%"></th>
                        <th class="text-end text-danger">${thai[key]} : ${data[key]}</th>
                    </tr>
                `;
                return html;
            }
            html += `
                <tr>
                    <th class="text-start" style="width: 40%">${thai[key]} :</th>
                    <td class="text-start">${data[key]}</td>
                </tr>
            `;
        }
        return html;
    }

    const searchData = document.getElementById("search");
    if (searchData) {
        searchData.addEventListener("submit", (event) => {
            searchSSO(event);
        });
    }
    

    async function searchSSO(event) {

        event.preventDefault();
        
        const button = document.getElementById("submit");
        const idCard = document.getElementById("idCard");

        button.disabled = true;

        if (idCard.value.length !== 13) {
            alert("กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง");
            button.disabled = false;
            return;
        }

        const response = await fetch("./SSO", {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            body: JSON.stringify({
                idCard: idCard.value,
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        const table = document.getElementById("showData");
        table.innerHTML = renderData(data);
        button.disabled = false;

        const note = document.getElementById("note");
        note.className = "mt-5 text-center text-danger";
    }
    
})();