let button = document.getElementById("to-top")
button.addEventListener("click", () => { window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })}, false)


button.style.display = "none"
button.style.position = "fixed"
button.style.bottom = 0
button.style.right = 0
button.style.margin = "16px"
button.style.padding = 0
button.style.border = "none"
button.style.background = "none"
button.style.fontSize = "1.5rem"
button.addEventListener("mouseover", () => {button.style.opacity = 0.5}, false);
button.addEventListener("mouseout", () => {button.style.opacity = 1}, false);


let scroll = 0

// better to use setInterval rather than setting up an event listener on scroll because this fires much less often
setInterval(function() {
    scroll = window.scrollY
    scroll > 20 ? button.style.display = "inline" : button.style.display = "none"
    
    }
, 500);

