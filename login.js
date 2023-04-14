$(document).ready(function () {
    $(".header-burger").click(function (event) {
      $(".header-burger,.header-menu").toggleClass("active");
      $("body").toggleClass("lock");
    });
  });

const loginForm = document.querySelector('form')
const emailInput = document.querySelector('input[name="email"]')
const passwordInput = document.querySelector('input[name="pass"]')
const notification = document.querySelector(".notification");
const user = JSON.parse(localStorage.getItem("user"));


const headerUser = document.querySelector(".header-user");
if(localStorage.getItem('user')) {
    headerUser.textContent = user.name;  
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const userInfo = {
        email: emailInput.value,
        password: passwordInput.value
    };
    localStorage.removeItem('user');
    login(userInfo)
    
});

async function login(user) {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const currentUser = await response.json()
        console.log(currentUser.user)
        localStorage.setItem("user", JSON.stringify(currentUser.user));
            if(response.ok) {
                window.location.href = "./index.html"
            }else {
                showNotification("логин или пароль введен неверно", "red");
            }
        }
     catch (error) {
        console.log(error)
    }
}

  function showNotification(text, color) {
    notification.style.display = "block";
    notification.style.backgroundColor = color;
    notification.innerHTML = `<h5 class="notification-text">${text}</h5>`;
    setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
  }