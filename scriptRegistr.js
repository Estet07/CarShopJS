let userForm = document.querySelector("form");
let inputEmail = document.querySelector("[name='email']");
let inputPassword = document.querySelector("[name='pass']");
const addRole = document.querySelector(".form-control-role")
const inputName = document.querySelector('input[name="name"]');
const inputGender = document.querySelector('input[name="gender"]');
const inputAge = document.querySelector('input[name="age"]');
const inputRole = document.querySelector('input[name="role"]');
const notification = document.querySelector(".notification");
const notificationText = document.querySelector(".notification-text")
const API_URL = "http://localhost:3000/users";
const user = JSON.parse(localStorage.getItem("user"));
// let user = [];
let users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];

const userActive = document.querySelectorAll('.user-active')
const headerUser = document.querySelector(".header-user");
if(localStorage.getItem('user')) {
  headerUser.textContent = user.name;  
}

if (user && user.role === "admin") {
  addRole.style.display = "block";
} else {
  addRole.style.display = "none";
  inputRole.value = "user";
}

async function register(userInfo) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const result = await res.json();
  if (res.ok) {
    showNotification("Вы успешно зарегестрировались");
    clearInput();
  } else {
    showNotification(result, true);
  }
}

function clearInput() {
  inputEmail.value = "";
  inputPassword.value = "";
  inputName.value = "";
  inputGender.value = "";
  inputAge.value = "";
}

function showNotification(message, isError = false) {
  notification.style.display = "block";
  notificationText.textContent = message;
  if (isError) {
    notification.style.background = "red";
  } else {
    notification.style.background = "green";
    setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);
    
  }
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

userForm.addEventListener("submit", function (event) {
  event.preventDefault(); 

  let newEmail = inputEmail.value;
  let newPassword = inputPassword.value;
  let newName = inputName.value;
  let newGender = inputGender.value;
  let newAge = inputAge.value;
  let newRole = inputRole.value;
  let userInfo = {
    email: newEmail,
    password: newPassword,
    img: "https://png.pngtree.com/element_our/png_detail/20181206/users-vector-icon-png_260862.jpg",
    name: newName,
    gender: newGender,
    age: newAge,
    role: newRole,
  };
  users.push(userInfo);
  localStorage.setItem("users", JSON.stringify(users));
  register(userInfo);
});