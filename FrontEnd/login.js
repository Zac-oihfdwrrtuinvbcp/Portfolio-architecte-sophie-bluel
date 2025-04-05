import { login } from "./client.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login form');
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();

       const email = loginForm.querySelector('input[type="email"]').value;
       const password = loginForm.querySelector('input[type="password"]').value;
       const loginError = document.querySelector('.login-error');

       

        login({ email, password })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        })
        .catch(error => {
            loginError.textContent = "Adress Mail or password incorrect";
            //popUp(error.message);
        });
    });
});

function popUp(message) {
    let popup = document.createElement('div');
    popup.textContent = message;
    popup.classList.add('popup');

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("fade-out");
    }, 500);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}