const signInForm = document.querySelector("#signin-form");
const errorMessage = document.querySelector("#signin-error");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

let errorText = errorMessage.innerText;

if (errorText !== "") {
  errorMessage.style.color = "red";

  if (errorText.includes("password")) {
    password.style.backgroundColor = "#fff3e0";
  } else {
    email.style.backgroundColor = "#fff3e0";
  }
}
