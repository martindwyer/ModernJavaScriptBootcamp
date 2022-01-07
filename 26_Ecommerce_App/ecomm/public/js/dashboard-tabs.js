let productsTab = document.querySelector("#products");
let usersTab = document.querySelector("#users");
let salesTab = document.querySelector("#sales");

let productSection = document.querySelector("#product-menu");
let usersSection = document.querySelector("#user-menu");
let salesSection = document.querySelector("#sales-menu");

productsTab.addEventListener("click", (evt) => {
  evt.preventDefault();

  productSection.style.display = "block";
  usersSection.style.display = "none";
  salesSection.style.display = "none";

  productsTab.classList.add("is-active");
  usersTab.classList.remove("is-active");
  salesTab.classList.remove("is-active");
});

usersTab.addEventListener("click", (evt) => {
  evt.preventDefault();

  productSection.style.display = "none";
  usersSection.style.display = "block";
  salesSection.style.display = "none";

  productsTab.classList.remove("is-active");
  usersTab.classList.add("is-active");
  salesTab.classList.remove("is-active");
});

salesTab.addEventListener("click", (evt) => {
  evt.preventDefault();

  productSection.style.display = "none";
  usersSection.style.display = "none";
  salesSection.style.display = "block";

  productsTab.classList.remove("is-active");
  usersTab.classList.remove("is-active");
  salesTab.classList.add("is-active");
});
