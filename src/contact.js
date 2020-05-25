const contactForm = document.getElementById("contact_form");

function alert(color, msg) {
    const contactNotify = document.getElementById("contact_notify");
    contactNotify.innerHTML = `
        <div class="w3-panel w3-${color}">
            <p>${msg}</p>
        </div>
    `;
}

function clearAlert() {
    const contactNotify = document.getElementById("contact_notify");
    contactNotify.innerHTML = "";
}

if(contactForm) {
    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        const contactBtn = document.getElementById("contact_submit");
        const contactBtnValue = contactBtn.value;
        contactBtn.setAttribute('disabled', true);
        clearAlert();
        alert("cyan", "Please wait a moment while your message is being sent...");

        const formToJSON = elements => [].reduce.call(elements, (data, element) => {
            data[element.name] = element.value;
            return data;
        }, {});

        // Display the key/value pairs
        const formData = formToJSON(e.target.elements);
        let res = await fetch("https://contact.cinziamilani.com", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(formData),
        });
        if(res.ok) {
            let json = await res.json();
            alert("green", "Your message has been sent. ");
        } else {
            let json = await res.json();
            console.error(json);
            alert("pale-red", json.message);
        }
        contactBtn.value = contactBtnValue;
        contactBtn.removeAttribute('disabled');
        hcaptcha.reset();
    }, false);




}

