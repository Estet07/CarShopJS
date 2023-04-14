if(!localStorage.getItem('user')) {
    window.location.href = './index.html'
};

$(document).ready(function () {
    $(".header-burger").click(function (event) {
      $(".header-burger,.header-menu").toggleClass("active");
      $("body").toggleClass("lock");
    });
  });

const user = JSON.parse(localStorage.getItem('user'));
const userName = document.querySelector('.user-name');
const userAge = document.querySelector('.user-age');
const userGender = document.querySelector('.user-gender');
const userRole = document.querySelector('.user-role')
const logoutBtn = document.querySelector('.logout-btn');

let inputName = document.querySelector("[name='product-name']");
let inputModel = document.querySelector("[name='product-model']");
let inputPrice = document.querySelector("[name='product-price']");
let inputColor = document.querySelector("[name='product-color']");
let inputImg = document.querySelector("[name='product-img']");
let notification = document.querySelector(".notification");
let notificationErr = document.querySelector(".notification-err");
let products = [];

const API_URL = "http://localhost:3000/products";
const productsContainer = document.querySelector('.products-items');

logout();

const userActive = document.querySelectorAll('.user-active')
const nameUserTitle = document.querySelector(".name-user");
if(user.role === "admin") {
    renderAdminProducts();
    for(var i=0; i<userActive.length; i++)userActive[i].style.display='block';
  }else {
    renderUserProducts();
    for(var i=0; i<userActive.length; i++)userActive[i].style.display='none';
  }
nameUserTitle.textContent = user.name;
userName.textContent = "Имя: " + user.name;
userAge.textContent = "Возраст: " +  user.age;
userGender.textContent = "Пол: " + user.gender;
userRole.textContent = "Доступ:" + user.role;

function logout() {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = './index.html'
    })
}

async function fetchAdminProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data;
}

async function getUserName(id) {
  const res = await fetch(`http://localhost:3000/users/${id}`)
  const user = await res.json()
  return user.name
}

async function renderAdminProducts() {
  productsContainer.innerHTML = "";
  const products = await fetchAdminProducts();
  products.forEach(async function(product) {
    const userName = await getUserName(product.author)
      productsContainer.insertAdjacentHTML('beforeend', `
      <div class="products-item" id=${product.id}>
          <a href="" class="products-image">
              <img src="${product.img}" class="product-img">
          </a>
          <h5 class="product-name">${product.name}</h5>
          <a class="product-model"><b>Модель</b>: <span>${product.model}</span></a>
          <p class= "product-color"><b>Цвет</b>: <span>${product.color}</span></p>
          <p class="product-price"><b>Цена</b>: <span>${product.price}</span></p>
          <p class="product-data"><b>Дата</b>: <span>${product.data}</span></p>
          <p class="product-author"><b>Автор</b>: <span>${userName}</span></p>
          <div class='product-btns'>
              <button class="btn delete-btn" id=${product.id}>Удалить</button>
          </div>
          </div>
      `)
  })
}

async function fetchUserProducts() {
  const res = await fetch(`http://localhost:3000/products?author=${user.id}`);
  const data = await res.json();
  return data;
}

async function renderUserProducts() {
    productsContainer.innerHTML = "";
    const products = await fetchUserProducts();
    products.forEach(async function(product) {
      const userName = await getUserName(product.author)
        productsContainer.insertAdjacentHTML('beforeend', `
        <div class="products-item" id=${product.id}>
            <a href="" class="products-image">
                <img src="${product.img}" class="product-img">
            </a>
            <h5 class="product-name">${product.name}</h5>
            <a class="product-model"><b>Модель</b>: <span>${product.model}</span></a>
            <p class= "product-color"><b>Цвет</b>: <span>${product.color}</span></p>
            <p class="product-price"><b>Цена</b>: <span>${product.price}</span></p>
            <p class="product-data"><b>Дата</b>: <span>${product.data}</span></p>
            <p class="product-author"><b>Автор</b>: <span>${userName}</span></p>
            <div class='product-btns'>
                <button class="btn delete-btn" id=${product.id}>Удалить</button>
            </div>
            </div>
        `)
    })
}

function showNotification(text, color) {
    notification.style.display = "block";
    notification.style.backgroundColor = color;
    notification.innerHTML = `<h5 class="notification-text">${text}</h5>`;
    setTimeout(function () {
      notification.style.display = "none";
    }, 3000);
  }

document.addEventListener("click", function (e) {
    const classList = e.target.classList;
    if (classList[1] === "delete-btn") {
      deleteProduct(e.target.id)
       try {  
          products = products.filter((product) => {
            return product.id !== +e.target.id;
          });
          renderUserProducts();
          showNotification("Продукт удален", "violet");
        }
        catch (err) {
          console.log(err);
          showNotification("Продукт не удален", "red");
        }
    } 
  });



async function deleteProduct(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      //обращение к id обьекта
      method: "DELETE",
    });
  }
  
 