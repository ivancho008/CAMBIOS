const btnSignIn = document.querySelector(".sign-in-btn");
const btnSignUp = document.querySelector(".sign-up-btn");
const signIn = document.querySelector(".sign-in");
const signUp = document.querySelector(".sign-up");

btnSignIn.addEventListener("click", () => {
    signIn.classList.add("active");
    signUp.classList.remove("active");
});

btnSignUp.addEventListener("click", () => {
    signUp.classList.add("active");
    signIn.classList.remove("active");
});