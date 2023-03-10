let sidebar = document.querySelector(".sidebar")
let menu = document.getElementById("menu")

// sidebar entries
let menuData = {
    "Home": "index.html",
    "Works": "works.html",
    "Programming & Production": "programming.html",
    "About": "about.html",
    "Viola": "viola.html",
    "Contact": "contact.html"
}

// create entries in DOM: CSS is all set in global.css
for (const [key, value] of Object.entries(menuData)) {
    console.log(`${key}: ${value}`);
    const a = document.createElement("a")
    a.textContent = key
    a.classList.add("menuitem");
    a.href = value
    if (value === window.location.pathname.split("/").pop()){
        a.classList.add("active");
    }
    console.log(a)
    console.log(sidebar)
    sidebar.appendChild(a)

    }

// event listener for mobile
menu.addEventListener("click", menuEventListener, false)

function menuEventListener() {

    if (document.querySelector(".menuitem").style.display === "" || document.querySelector(".menuitem").style.display === "none") 
    // for some reason, the page won't return "none" for style.display until after it's been set in JS, even though it is already set to that. Don't understand why, and this bypasses the issue... 
    {showMenuItems()} else {hideMenuItems()}
}

function showMenuItems() {
    console.log("show")
    let menuItems = document.querySelectorAll(".menuitem")
    menuItems.forEach((item) => item.style.display = 'block')   
}

function hideMenuItems() {
    console.log("hide")
    let menuItems = document.querySelectorAll(".menuitem")
    menuItems.forEach((item) => item.style.display = 'none')   
}