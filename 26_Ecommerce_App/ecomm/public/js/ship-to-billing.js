let streetAddress = document.querySelector("#streetAddress");
let unitNumber = document.querySelector("#unitNumber");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let zip = document.querySelector("#zip");

let billing = [streetAddress, unitNumber, city, state, zip];

let shipToStreetAddress = document.querySelector("#shipToStreetAddress");
let shipToUnitNumber = document.querySelector("#shipToUnitNumber");
let shipToCity = document.querySelector("#shipToCity");
let shipToState = document.querySelector("#shipToState");
let shipToZip = document.querySelector("#shipToZip");

let shipping = [
  shipToStreetAddress,
  shipToUnitNumber,
  shipToCity,
  shipToState,
  shipToZip,
];

const billingIsShipping = document.querySelector("#billingIsShipping");

billingIsShipping.addEventListener("click", (evt) => {
  if (billingIsShipping.checked) {
    for (let i = 0; i < billing.length; i++) {
      console.log(i, billing[i]);
      shipping[i].value = billing[i].value;
    }
  } else {
    for (let i = 0; i < shipping.length; i++) {
      console.log(i, shipping[i]);
      shipping[i].value = "";
    }
  }
});
