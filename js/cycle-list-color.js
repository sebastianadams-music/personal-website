const matches = document.querySelectorAll("div.thinking-about > p > a");

loopDeLoop()

function changeFontSize(item, size) {
    item.style.fontSize = size
}

function changeColor(item, color) {
    item.style.color = color
}

async function loopDeLoop() {
    loop().then(
        (returned) => loopDeLoop()
    )
    
}

async function loop() {
    for (const match of matches) {
        changeColor(match, "red")
        //  console.log("bim")
         await change().then(() => changeColor(match, "blue"))
         
     }
    return "yeh bb"
}

async function change() {
    return new Promise(function(resolve, reject) {
  
        // Setting 2000 ms time
        setTimeout(resolve, 400);
    })
}
