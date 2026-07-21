const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx4b1dZ5s4rRku7KfzRX1oY9iFRiEuZ-J2OzdSie01wIklQfcO0QUT4u8H9mSQKg96s/exec";

window.addEventListener("load", function () {

    setTimeout(initForms, 1500);

});

function initForms() {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", submitHandler, true);

    });

}

async function submitHandler(e) {

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const form = e.target;

    const submitBtn =
        form.querySelector('button[type="submit"], input[type="submit"]');

    if (submitBtn) {

        submitBtn.disabled = true;

        if (submitBtn.querySelector(".t-btnflex__text")) {

            submitBtn.querySelector(".t-btnflex__text").innerText =
                "Отправка...";

        } else {

            submitBtn.innerText = "Отправка...";

        }
    }

    const data = {};

    form.querySelectorAll("input, textarea, select").forEach(el => {

        if (el.type === "submit") return;
        if (el.type === "hidden") return;

        let key =
            el.getAttribute("data-tilda-req") ||
            el.getAttribute("name") ||
            el.placeholder ||
            el.id;

        if (!key) return;

        if (el.type === "radio") {

            if (el.checked) {
                data[key] = el.value;
            }

        } else if (el.type === "checkbox") {

            data[key] = el.checked;

        } else {

            data[key] = el.value;
        }

    });

    data.date = new Date().toLocaleString();

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        if (!response.ok)
            throw new Error();

        showSuccess(form);

        form.reset();

    }
    catch (err) {

        showError(form);

        console.error(err);

    }

    if (submitBtn) {

        submitBtn.disabled = false;

        const txt = submitBtn.querySelector(".t-btnflex__text");

        if (txt) {

            txt.innerText = "Отправить";

        } else {

            submitBtn.innerText = "Отправить";

        }
    }
}

function showSuccess(form) {

    let box = form.querySelector(".js-successbox");

    if (box) {

        box.style.display = "block";

        box.innerHTML =
            "Спасибо! Мы получили ваш ответ.";

        const inputs =
            form.querySelector(".t-form__inputsbox");

        if (inputs)
            inputs.style.display = "none";

        return;
    }

    alert("Спасибо! Мы получили ваш ответ.");
}

function showError(form) {

    alert("Ошибка отправки. Попробуйте ещё раз.");
}