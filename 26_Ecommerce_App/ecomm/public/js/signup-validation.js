const signUpForm = document.querySelector("#signup-form");

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

signUpForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let email = document.querySelector("#signup-email");
  let password = document.querySelector("#signup-password");
  let passwordConfirm = document.querySelector("#signup-password-confirm");

  emailValid = validateEmail(email.value);

  if (!emailValid) {
    document.querySelector("#signup-error").innerHTML =
      "Please enter a valid email address";

    document.querySelector("#signup-error").style.color = "red";
    email.style.backgroundColor = "#fff3e0";
  } else if (password.value !== passwordConfirm.value) {
    document.querySelector("#signup-error").innerHTML =
      "The passwords do not match";

    document.querySelector("#signup-error").style.color = "red";
    email.style.backgroundColor = "#ffffff";
    password.style.backgroundColor = "#fff3e0";
    passwordConfirm.style.backgroundColor = "#fff3e0";
  } else {
    signUpForm.submit();
  }
});
