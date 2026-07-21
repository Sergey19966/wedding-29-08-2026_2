const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4b1dZ5s4rRku7KfzRX1oY9iFRiEuZ-J2OzdSie01wIklQfcO0QUT4u8H9mSQKg96s/exec";

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const submit = form.querySelector('button[type="submit"],input[type="submit"]');

            if (submit) {
                submit.disabled = true;
                submit.dataset.old = submit.innerHTML || submit.value;

                if (submit.tagName === "BUTTON")
                    submit.innerHTML = "Отправка...";
                else
                    submit.value = "Отправка...";
            }

            const formData = {};

            form.querySelectorAll("input,select,textarea").forEach(el => {

                if (!el.name) return;

                switch (el.type) {

                    case "checkbox":
                        formData[el.name] = el.checked;
                        break;

                    case "radio":
                        if (el.checked)
                            formData[el.name] = el.value;
                        break;

                    default:
                        formData[el.name] = el.value;
                }

            });

            try {

                const response = await fetch(SCRIPT_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)

                });

                if (!response.ok)
                    throw new Error();

                showSuccess(form);

                form.reset();

            }
            catch (err) {

                showError(form);

            }

            if (submit) {

                submit.disabled = false;

                if (submit.tagName === "BUTTON")
                    submit.innerHTML = submit.dataset.old;

                else
                    submit.value = submit.dataset.old;

            }

        });

    });

});


function showSuccess(form){

    let div=form.querySelector(".form-result");

    if(!div){

        div=document.createElement("div");

        div.className="form-result";

        form.appendChild(div);

    }

    div.style.color="#228B22";

    div.innerHTML="Спасибо! Мы получили Ваш ответ.";

}


function showError(form){

    let div=form.querySelector(".form-result");

    if(!div){

        div=document.createElement("div");

        div.className="form-result";

        form.appendChild(div);

    }

    div.style.color="red";

    div.innerHTML="Ошибка отправки. Попробуйте ещё раз.";

}