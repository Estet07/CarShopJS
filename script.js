


$(document).ready(function () {
  $(".header-burger").click(function (event) {
    $(".header-burger,.header-menu").toggleClass("active");
    $("body").toggleClass("lock");
  });
});

$(document).ready(function () {
  $(".spoiler-title").click(function (event) {
    if ($(".spoiler").hasClass("one")) {
      $(".spoiler-title").not($(this)).removeClass("active");
      $(".spoiler-text").not($(this).next()).slideUp(300);
    }
    $(this).toggleClass("active").next().slideToggle(300);
  });
});
//carousel button1
const carouselButton = (offset) => {
  const activeSlide = document.querySelector("[data-active]");
  const slides = [...document.querySelectorAll(".slide")];
  const currentIndex = slides.indexOf(activeSlide);
  let newIndex = currentIndex + offset;

  if (newIndex < 0) newIndex = slides.length - 1;
  if (newIndex >= slides.length) newIndex = 0;

  slides[newIndex].dataset.active = true;
  delete activeSlide.dataset.active;
};

const onNext = () => carouselButton(1);
const onPrev = () => carouselButton(-1);
//carousel2

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
let products = [];
let getUser = [];
const user = JSON.parse(localStorage.getItem("user"));
const logoutBtn = document.querySelector('.logout-btn');
const deleteBtn = document.querySelector('.product-btns')

const API_URL = "http://localhost:3000/products";
const API_URL_USER = "http://localhost:3000/users";

const userActive = document.querySelectorAll('.user-active')
const headerUser = document.querySelector(".header-user");
if(localStorage.getItem('user')) {
  headerUser.textContent = "Личный кабинет";
  for(var i=0; i<userActive.length; i++)userActive[i].style.display='block';
}else{
  for(var i=0; i<userActive.length; i++)userActive[i].style.display='none';
}

async function getProductsAsync() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    products = data;
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

logout();

getProductsAsync();

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
            <div class="products-item" id=${element.id}>
            ${productHTML(
              element.img,
              element.name,
              element.model,
              element.price,
              element.color,
              element.data,
              userName,
              element.id
            )}
            </div>               
        `;
  });
}

function showNotification(text, color) {
  notification.style.display = "block";
  notification.style.backgroundColor = color;
  notification.innerHTML = `<h5 class="notification-text">${text}</h5>`;
  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

productSearch.addEventListener("input", function (e) {
  let queryStr = productSearch.value;
  let filteredProducts = filterProducts(queryStr);
  showProductForEach(filteredProducts);
  
});

function filterProducts(str) {
  return products.filter((product) => {
    return product.name.toLowerCase().includes(str.toLowerCase());
  });
}


document.addEventListener("click", function (e) {
  const classList = e.target.classList;
  if (classList[1] === "delete-btn") {
    deleteProduct(e.target.id)
     try {  
        products = products.filter((product) => {
          return product.id !== +e.target.id;
        });
        showProductForEach(products);
        showNotification("Продукт удален", "violet");
      }
      catch (err) {
        showNotification("Продукт не удален", "red");
      }
  } else if (classList[1] === "edit-btn") {
    const product = document.getElementById(`${e.target.id}`);
    editProduct(product, product.id);
  }
});

function editProduct(product, productId) {
  const productImg = product.querySelector(".product-img").getAttribute("src");
  const productName = product.querySelector(".product-name").innerText;
  const productModel = product.querySelector(".product-model span").innerText;
  const productColor = product.querySelector(".product-color span").innerText;
  const productPrice = product.querySelector(".product-price span").innerText;
  
  
  product.innerHTML = `
    <form class='product-edit'>
        <input type='text' value=${productImg}  name='productImg'/>
        <input type='text' value=${productName}  name='productName'/>
        <input type='text' value=${productModel}  name='productModel'/>
        <input type='number' value=${productPrice} name='productPrice'/>
        <input type='color'  name='productColor'/>
        <div class='form-btns'>
            <input class='btn form-cancelBtn' type='button' value='Отмена' />
            <input class='btn form-saveBtn' type='submit' value='Сохранить'/ >
        </div>
    </form>
      `;

  const btns = document.querySelectorAll(".form-btns input");
  btns.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      if (e.target.value === "Отмена") {
        product.innerHTML = productHTML(
          productImg,
          productName,
          productModel,
          productPrice,
          productColor,
          productAuthor,
          productId
        );
      } else {
        const productEditForm = document.querySelector(".product-edit");
        const editedProduct = {
          img: productEditForm.querySelector('input[name="productImg"').value,
          name: productEditForm.productName.value,
          model: productEditForm.productModel.value,
          price: +productEditForm.productPrice.value,
          color: productEditForm.productColor.value,
          author: productAuthor.value
        };
        try {
          const data = await fetchEditProduct(editedProduct, productId);
          product.innerHTML = productHTML(
            data.img,
            data.name,
            data.model,
            data.price,
            data.color,
            data.author,
            productId
          );
          getProductsAsync();
          showNotification("Вы успешно изменили данные продукта", "blue");
        } catch (err) {
          showNotification("Не удается изменить данные продукта", "red");
        }
      }
    });
  });
  
}

async function fetchEditProduct(product, productId) {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  return await res.json();
}



async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    //обращение к id обьекта
    method: "DELETE",
  });
}

function productHTML(img, name, model, price, color, data, author, id) {
  if (user && user.id === 777) {
  return `
    <a href="" class="products-image">
        <img src="${img}" class="product-img">
    </a>
    <h5 class="product-name">${name}</h5>
    <a class="product-model"><b>Модель</b>: <span>${model}</span></a>
    <p class= "product-color"><b>Цвет</b>: <span>${color}</span></p>
    <p class="product-price"><b>Цена</b>: <span>${price}</span></p>
    <p class="product-data"><b>Дата</b>: <span>${data}</span></p>
    <p class="product-author"><b>Автор</b>: <span>${author}</span></p>
    <div class='product-btns'>
      <button class="btn delete-btn" id=${id}>Удалить</button>
      
    </div>`;
  }else {
    return `
    <a href="" class="products-image">
        <img src="${img}" class="product-img">
    </a>
    <h5 class="product-name">${name}</h5>
    <a class="product-model"><b>Модель</b>: <span>${model}</span></a>
    <p class= "product-color"><b>Цвет</b>: <span>${color}</span></p>
    <p class="product-price"><b>Цена</b>: <span>${price}</span></p>
    <p class="product-data"><b>Дата</b>: <span>${data}</span></p>
    <p class="product-author"><b>Автор</b>: <span>${author}</span></p>
    <div class='product-btns'>
      
      
    </div>`;
  }
}




// {/* <button class="btn edit-btn" id=${id}>Редактировать</button>  */}