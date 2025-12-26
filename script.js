let cart = JSON.parse(localStorage.getItem("cartList")) || [];
let counter = localStorage.getItem("counter") || 0;

function displayList(list) {
  const cartItems = document.querySelector("#items");
  const cartTotal = document.querySelector("#total");
  const cartList = document.querySelector("#cart-list");
  cartList.innerHTML = "";

  let total = 0;
  let subTotal = 0;

  list.forEach(function (item, index) {
    const li = document.createElement("li");
    const illustration = document.createElement("div");
    const img = document.createElement("img");
    const details = document.createElement("div");
    const dot = document.createElement("span");
    const itemName = document.createElement("p");
    const itemPrice = document.createElement("span");
    const itemQuantity = document.createElement("span");
    const itemTotal = document.createElement("p");

    // subTotal = item.price * item.quantity
    subTotal = item.subtotal;
    total += subTotal;

    li.classList.add("list-item");
    dot.innerHTML = " &middot; ";
    illustration.classList.add("illustration");
    details.classList.add("details");
    itemName.classList.add("item-name");
    itemPrice.classList.add("item-price");
    itemQuantity.classList.add("item-quantity");
    itemTotal.classList.add("item-total");

    img.src = "./images/price-tag.png";
    itemName.textContent = item.name;
    itemPrice.textContent = `Price: ${Number(item.price).toLocaleString(
      "en-PH",
      {
        style: "currency",
        currency: "PHP",
      }
    )}`;
    itemQuantity.textContent = `Quantity: ${Number(item.quantity)}`;
    itemTotal.textContent = `${subTotal.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    })}`;

    illustration.appendChild(img);
    details.appendChild(itemName);
    details.appendChild(itemPrice);
    details.appendChild(dot);
    details.appendChild(itemQuantity);
    details.appendChild(itemTotal);
    li.appendChild(illustration);
    li.appendChild(details);
    cartList.appendChild(li);

    li.onclick = function () {
      showUpdateForm(item.id);
    };
  });

  cartItems.textContent =
    list.length > 1 || list.length === 0
      ? `${list.length} Items`
      : `${list.length} Item`;
  cartTotal.textContent = `${total.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  })}`;
}

function showUpdateForm(id) {
  const obj = cart.find(function (item) {
    return item.id === id;
  });
  document.querySelector("#updateName").value = obj.name;
  document.querySelector("#updatePrice").value = obj.price;
  document.querySelector("#updateQuantity").value = obj.quantity;
  const updateForm = document.querySelector("#update-form");
  updateForm.showModal();

  const updateButton = document.querySelector(".update-button");
  const deleteButton = document.querySelector(".delete-button");

  updateForm.onsubmit = function (event) {
    event.preventDefault();
    const name = document.querySelector("#updateName").value.trim();
    const price = document.querySelector("#updatePrice").value;
    const quantity = document.querySelector("#updateQuantity").value;

    if (name && price && quantity) {
      updateItem(id, name, price, quantity);
    }
    updateForm.close();
  };

  deleteButton.onclick = function () {
    deleteItem(id);
    updateForm.close();
  };
}

const sortButton = document.querySelector("#sort");

let index = localStorage.getItem("index") || 0;
sortButton.options[index].selected = true;

sortButton.onchange = function (event) {
  const selection = event.target.value;
  const optionIndex = event.target.selectedIndex;
  
  index = optionIndex;
  localStorage.setItem("index", index);

  sortButton.options[index].selected = true;

  if (selection === "added-first-last") {
    cart.sort(function (a, b) {
      return a.id - b.id;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  } else if (selection === "added-last-first") {
    cart.sort(function (a, b) {
      return b.id - a.id;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  } else if (selection === "subtotal-low-high") {
    cart.sort(function (a, b) {
      return a.subtotal - b.subtotal;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  } else if (selection === "subtotal-high-low") {
    cart.sort(function (a, b) {
      return b.subtotal - a.subtotal;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  } else if (selection === "name-AZ") {
    cart.sort(function (a, b) {
      const itemA = a.name.toLowerCase();
      const itemB = b.name.toLowerCase();

      if (itemA < itemB) {
        return -1;
      }

      if (itemA > itemB) {
        return 1;
      }

      return 0;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  } else if (selection === "name-ZA") {
    cart.sort(function (a, b) {
      const itemA = a.name.toLowerCase();
      const itemB = b.name.toLowerCase();

      if (itemA > itemB) {
        return -1;
      }

      if (itemA < itemB) {
        return 1;
      }

      return 0;
    });

    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
  }
};

const showFormButton = document.querySelector(".show-add-form-button");
const dialog = document.querySelector("dialog");
const addButton = document.querySelector(".add-button");
const addForm = document.querySelector("#add-form");
showFormButton.onclick = function () {
  dialog.showModal();
};

addForm.onsubmit = function (e) {
  e.preventDefault();
  addItem();

  document.querySelector("#addName").value = "";
  document.querySelector("#addPrice").value = "";
  document.querySelector("#addQuantity").value = "";

  dialog.close();
};

dialog.onclick = function (e) {
  if (e.target === dialog) {
    document.querySelector("#addName").value = "";
    document.querySelector("#addPrice").value = "";
    document.querySelector("#addQuantity").value = "";
    dialog.close();
  }
};

function addItem() {
  const id = counter;
  const name = document.querySelector("#addName").value.trim();
  const price = document.querySelector("#addPrice").value;
  const quantity = document.querySelector("#addQuantity").value;
  const subtotal = price * quantity;

  if (name && price && quantity) {
    const obj = { id, name, price, quantity, subtotal };

    cart.push(obj);
    localStorage.setItem("cartList", JSON.stringify(cart));
    displayList(cart);
    counter++;
    localStorage.setItem("counter", counter);
  }
}

const updateForm = document.querySelector("#update-form");
updateForm.onclick = function (e) {
  if (e.target === updateForm) {
    updateForm.close();
  }
};

function deleteItem(id) {
  cart = cart.filter(function (item) {
    return item.id !== id;
  });

  localStorage.setItem("cartList", JSON.stringify(cart));
  displayList(cart);
}

function updateItem(id, name, price, quantity) {
  const subtotal = price * quantity;
  cart = cart.map(function (item) {
    if (item.id === id) {
      return { ...item, name, price, quantity, subtotal };
    }
    return item;
  });
  localStorage.setItem("cartList", JSON.stringify(cart));
  displayList(cart);
}

window.onload = function () {
  displayList(cart);
};
