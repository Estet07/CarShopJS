if(!localStorage.getItem('user')) {
  window.location.href = './index.html'
}

$(document).ready(function () {
  $(".header-burger").click(function (event) {
    $(".header-burger,.header-menu").toggleClass("active");
    $("body").toggleClass("lock");
  });
});

let productsItems = document.querySelector(".products-items");
let productItem = document.querySelector(".products-item");
let productForm = document.querySelector("form");
let inputName = document.querySelector("[name='product-name']");
let inputModel = document.querySelector("[name='product-model']");
let inputPrice = document.querySelector("[name='product-price']");
let inputColor = document.querySelector("[name='product-color']");
let inputImg = document.querySelector("[name='product-img']");
let notification = document.querySelector(".notification");
let notificationErr = document.querySelector(".notification-err");
let productSearch = document.querySelector(".product-search");
const logoutBtn = document.querySelector('.logout-btn');
const user = JSON.parse(localStorage.getItem("user"));
let products = [];
const API_URL = "http://localhost:3000/products";

const headerUser = document.querySelector(".header-user");
if(localStorage.getItem('user')) {
    headerUser.textContent = user.name;  
}


async function getProductsAsync() {
  try {
    let res = await fetch(API_URL);
    const data = await res.json();
    showProductForEach(data);
  } catch (err) {
    console.log(err);
  }
}

async function getUserName(id) {
  const res = await fetch(`http://localhost:3000/users/${id}`)
  const user = await res.json()
  return user.name
}

getProductsAsync();
logout();

function logout() {
  logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('user');
      window.location.href = './index.html'
  })
}

function showProductForEach(arr) {
  productsItems.innerHTML = "";
  arr.forEach(async function (element) {
    const userName = await getUserName(element.author)
    productsItems.innerHTML += `
            <div class="products-item">
                <a href="" class="products-image">
                <img src="${element.img}" class="product-img">
                </a>
                <a class="product-name"><b>Марка</b>: ${element.name}</a>
                <a class="product-model"><b>Модель</b>: ${element.model}</a>
                <p class= "product-color"><b>Цвет</b>: ${element.color}</p>
                <p class="product-price"><b>Цена</b>: ${element.price}</p>
                <p class="product-data"><b>Дата</b>: <span>${element.data}</span></p>
                <p class="product-author"><b>Автор</b>: <span>${userName}</span></p>
            </div>               
        `;
  });
}

productForm.addEventListener("submit", function (event) {
  event.preventDefault(); /*  отмена действий по умолчанию*/

  let newName = inputName.value;
  let newModel = inputModel.value;
  let newPrice = +inputPrice.value;
  let newColor = inputColor.value;
  let newImg = inputImg.value;
  let newAuthor = user.id;

  let productInfo = {
    name: newName,
    model: newModel,
    price: newPrice,
    color: newColor,
    img: newImg,
    author: newAuthor,
    data: new Date().toLocaleDateString()
  };
  addProduct(productInfo);

  productsItems.innerHTML = "";
  clearInput();
});

async function addProduct(product) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    getProductsAsync();
    showNotification("Продукт добавлен", "green");
  } catch (err) {
    showNotification("Продукт не добавлен", "red");
  }
}

function clearInput() {
  inputName.value = "";
  inputModel.value = "";
  inputPrice.value = "";
  inputColor.value = "#000000";
  inputImg.value = "";
}

function showNotification(text, color) {
  notification.style.display = "block";
  notification.style.backgroundColor = color;
  notification.innerHTML = `<h5 class="notification-text">${text}</h5>`;
  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}


