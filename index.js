const categoryContainer = document.getElementById("category-container");
const cardContainer = document.getElementById("card-container");
const cartContainer = document.getElementById("cart-container");
const totalContainer = document.getElementById("total-container");
const modalContainer = document.getElementById("modal-container");
const treeDetailsModal = document.getElementById("tree_details_modal");
const loading = document.getElementById("loading");

let cartItems = [];
let totalPrice = 0;

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      showCategoris(data.categories);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showCategoris = (categories) => {
  categoryContainer.innerHTML = "";
  categoryContainer.innerHTML += `
      <li onclick="loadAllPlants()" class="text-lg hover:text-white hover:bg-green-600 rounded-lg pl-2 py-1 cursor-pointer">All Trees</li>
  `;
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <li id="${cat.id}" onclick="loadPlantsByCategory(${cat.id})" class="text-lg hover:text-white hover:bg-green-600 rounded-lg pl-2 py-1 cursor-pointer">${cat.category_name}</li>
    `;
  });
  categoryContainer
    .querySelector("li")
    .classList.add("bg-green-700", "text-white");
};

categoryContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    showLoading()
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
      li.classList.remove("bg-green-700", "text-white");
    });
    e.target.classList.add("bg-green-700", "text-white");
  }
});

const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => showPlantsByCategory(data.plants))
    .catch((err) => {
      console.log(err);
    });
};

const loadPlantsByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      showPlantsByCategory(data.plants);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showPlantsByCategory = (plants) => {
  cardContainer.innerHTML = "";
  plants.forEach((plant) => {
    cardContainer.innerHTML += `
      <div id="${plant.id}" class="card p-3 space-y-4 bg-white rounded-xl shadow-sm">
        <img class="h-[200px] w-full rounded-lg" src="${plant.image}" alt="" />
        <h3 onclick="treeDetailsModal.showModal()" class="name text-dark font-bold text-lg mb-1 cursor-pointer">${plant.name}</h3>
        <p class="h-10  text-gray-700 text-sm line-clamp-2">${plant.description}</p>
        <div class="flex justify-between items-center">
          <span class="bg-green-100 text-green-700 py-1 px-2 rounded-full font-semibold">${plant.category}</span>
          <span class="font-semibold"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</span>
        </div>
        <button class="btn bg-green-700 text-white rounded-full">Add to Cart</button>
      </div>
    `;
  });
};

cardContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") {
    handleAddToCard(e);
  }
  if (e.target.classList[0] === "name") {
    loadPlantsDetails(e);
  }
});

const handleAddToCard = (e) => {
  const name = e.target.parentNode.children[1].innerText;
  const price = e.target.parentNode.children[3].children[1].innerText;

  const sameItem = cartItems.find((item) => item.name === name);
  if (sameItem) {
    sameItem.count++;
  } else {
    cartItems.push({ name, price, count: 1 });
  }

  totalPrice += Number(price);
  showCartItems(cartItems);
};

const showCartItems = (cartItems) => {
  cartContainer.innerHTML = "";
  cartItems.forEach((item) => {
    cartContainer.innerHTML += `
      <div class="p-3 bg-green-100 flex items-center justify-between rounded-lg mt-2">
        <div>
          <h3 class="font-semibold text-lg mb-1">${item.name}</h3>
          <p class="text-gray-700 text-sm">
            <i class="fa-solid fa-bangladeshi-taka-sign"></i>${item.price} x ${item.count} 
          </p>
        </div>
        <i onclick="deleteCartItem('${item.name}', '${item.price}',${item.count})" class="fa-solid fa-xmark cursor-pointer"></i>
      </div>
      `;
  });

  if (totalPrice) {
    totalContainer.innerHTML = `
    <span>Total:</span>
    <span><i class="fa-solid fa-bangladeshi-taka-sign"></i>${totalPrice}</span>
  `;
  } else {
    totalContainer.innerHTML = "";
  }
};

const deleteCartItem = (name, price, count) => {
  const deleteItem = cartItems.filter((item) => item.name !== name);
  cartItems = deleteItem;
  if (cartItems.length !== 0) {
    totalPrice -= price * count;
  } else {
    totalPrice = 0;
  }
  showCartItems(cartItems);
};

const loadPlantsDetails = (e) => {
  const id = e.target.parentNode.id;
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => showPlantsDetails(data.plants))
    .catch((err) => console.log(err));
};

const showPlantsDetails = (plant) => {
  modalContainer.innerHTML = `
    <h3 onclick="treeDetailsModal.showModal()" class="text-green-700 font-bold text-xl mb-3 cursor-pointer">${plant.name}</h3>
    <img class="rounded-lg mb-2" src="${plant.image}" alt="" />
    <p class="font-medium"><span class="text-lg text-green-700 font-bold">Category: </span>${plant.category}</p>
    <p class="font-medium"><span class="text-lg text-green-700 font-bold mt-3">Price: </span><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</p>
    <p class="font-medium"><span class="text-lg text-green-700 font-bold mt-3">Description </span>${plant.description}</p>
  `;
};

const showLoading = () => {
  cardContainer.innerHTML = `
    <div class="absolute inset-0 flex justify-center">
      <span class="loading loading-spinner text-green-600 p-8"></span>
    </div>
  `;
};

loadCategories();
loadAllPlants();
