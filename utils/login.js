const params = new URLSearchParams(window.location.search)
const redireactURL = params.get('redirect_url');
const register_link = document.getElementById("register_link");
let phoneNumber;

register_link.addEventListener('click', () => {
    location.href = `/register.html`
})

const hasInitialToken = localStorage.getItem('token');

if (hasInitialToken) {
    window.location.replace(`${redireactURL}?token=${hasInitialToken}`)
}

const loginRequest = async (e) => {
    e.preventDefault()
    const { phone_number, password } = e.target
    phoneNumber = phone_number.value.replaceAll(' ', '').replaceAll('+', '')
    if (phoneNumber.trim() === '' && password.value.trim() === '') return;

    await fetch(`http://178.79.182.112:3001/auth/login?redirect_url=${redireactURL}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone_number: phoneNumber,
            password: password.value,
        })
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            document.getElementById('login_modal').style.display = "none"
            document.getElementById('verification_modal').style.display = "block"
            return response.json()
        }
        else {
            alert('Something went wrong! Please chech informations!')
        }
    })

}

const confirmHandler = async (e) => {
    e.preventDefault()
    const phoneNumberValue = phoneNumber
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