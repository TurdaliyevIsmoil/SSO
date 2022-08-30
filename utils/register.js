const params = new URLSearchParams(window.location.search)
const redireactURL = params.get('redirect_url');
const register_form = document.getElementById("register_form");
const register_link = document.getElementById("login_link");

verification_form.style.display = "none";

register_link.addEventListener('click', () => {
    location.replace(`http://178.79.182.112:3001/login.html?redirect_url=${redireactURL}`)
})


const hasInitialToken = localStorage.getItem('token');

if (hasInitialToken) {
    window.location.replace(`${redireactURL}?token=${hasInitialToken}`)
}

let storedPhoneNumber;

async function submitHandler(e) {
    e.preventDefault();
    const firstNameValue = e.target.first_name.value;
    const lastNameValue = e.target.last_name.value;
    const phoneNumberValue = e.target.phone_number.value.replaceAll(' ', '').replaceAll('+', '')
    const passwordValue = e.target.password.value;
    const genderValue = e.target.gender.value;
    const dateOfBirthValue = e.target.date_of_birth.value;
    const district_id = e.target.district_id.value;
    storedPhoneNumber = phoneNumberValue;
    const raw = {
        phone_number: phoneNumberValue,
        password: passwordValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        gender: genderValue,
        date_of_birth: new Date(dateOfBirthValue),
        district_id: "0447a65d-bb7c-4c1f-8009-70532ec9b095",
    };
    await fetch(`http://178.79.182.112:3001/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(raw),
    })
        .then((d) => {
            if (d.status >= 200 && d.status < 300) {
                register_form.style.display = "none";
                verification_form.style.display = "block";
            } else {

            }
        })
        .catch((e) => {
            alert(JSON.stringify(d));
        });
}

const verifyHandler = async (e) => {
    e.preventDefault()
    const phoneNumberValue = storedPhoneNumber
    const codeValue = e.target.code.value
    if (codeValue.trim().length < 6) return;
    const res = await fetch(`http://178.79.182.112:3001/auth/confirm?redirect_url=${redireactURL}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone_number: phoneNumberValue,
            code: codeValue,
        })
    }).then(res => res.json()).catch(e => console.log(e))
    const tokenIndex = res.redirect_url.indexOf('token');
    const token = res.redirect_url.substr(tokenIndex + 6, res.redirect_url.length - tokenIndex + 6)
    localStorage.setItem('token', token)
    window.location.replace(res.redirect_url)

}