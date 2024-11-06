let loginbtn = document.querySelector(".login-btn"); 
let divLogin = document.querySelector(".login"); 
let Username = document.getElementById("username");
let Pass = document.getElementById("pass");
let my_span = document.createElement("span");
my_span.innerHTML = "";
loginbtn.onclick = function(){
    if (Username.value === "admin" && Pass.value === "12345") {
        window.location.href = "Quiz.html"
    }
    else{
        
        my_span.classList.add("my_span"); 
        my_span.innerHTML = "The Username or Password Is incorrect !!"
        divLogin.appendChild(my_span);
    }
}
