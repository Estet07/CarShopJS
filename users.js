const user = JSON.parse(localStorage.getItem("user"));
  if(!localStorage.getItem('user') && !user.role === "admin" || user.role === "user") {
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
  

  let notification = document.querySelector(".notification");
  let notificationErr = document.querySelector(".notification-err");
  let userSearch = document.querySelector(".user-search");
  const logoutBtn = document.querySelector('.logout-btn');
 
  let users = [];
  const API_URL = "http://localhost:3000/users";
  
  const headerUser = document.querySelector(".header-user");
  if(localStorage.getItem('user')) {
      headerUser.textContent = user.name;  
  }
  
  
  async function getUsersAsync() {
    try {
      let res = await fetch(API_URL);
      const data = await res.json();
      users = data;
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
  
  getUsersAsync();
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
      productsItems.insertAdjacentHTML('beforeend', `
              <div class="products-item">
                  <a href="" class="products-image">
                  <img src="${element.img}" class="product-img">
                  </a>
                  <a class="product-name"><b>Имя</b>: ${element.name}</a>
                  <a class="product-model"><b>Пол</b>: ${element.gender}</a>
                  <p class= "product-color"><b>Возраст</b>: ${element.age}</p>
                  <p class="product-price"><b>Доступ</b>: ${element.role}</p>
                  <div class='product-btns'>
                    <button class="btn delete-btn" id=${element.id}>Удалить</button>
                  </div>
              </div>               
          `);
    });
  }
  
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
  
 
  
  function showNotification(text, color) {
    notification.style.display = "block";
    notification.style.backgroundColor = color;
    notification.innerHTML = `<h5 class="notification-text">${text}</h5>`;
    setTimeout(function () {
      notification.style.display = "none";
    }, 3000);
  }
  
  userSearch.addEventListener("input", function () {
    let queryStr = userSearch.value;
    let filteredProducts = filterProducts(queryStr);
    showProductForEach(filteredProducts);
    console.log(filteredProducts)
  });
  
  function filterProducts(str) {
    return users.filter((product) => {
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
          getUsersAsync();
          showNotification("Продукт удален", "violet");
        }
        catch (err) {
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