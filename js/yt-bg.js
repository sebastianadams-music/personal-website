let players = []
let playerCount = 0
let numPlayers = 12
document.terminate = 0
let terminateCount = 0
let terminateLimit = getRandomInt(2,5)
createPlayerDivs()
// 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementById('yt-bg-script');
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


document.getElementById("kill-youtube").addEventListener("click", killYouTube, false)




const loopLength = 10000

 const fadeOut = [
  { opacity: .7  },
  { opacity: 0. },
  ]

  const fadeIn = [
    { opacity: 0.  },
    { opacity: .7 },
    ]

const fadeInAndOut = [
      { opacity: 0.  },
      { opacity: .7 },
      { opacity: .0 },
      ]
  

const fadeTiming = {
  duration: loopLength * .85,
  iterations: 1,
  fill: "forwards"

}

const fadeInOutTiming = {
  duration: 3000,
  iterations: 1,
  fill: "forwards"

}

let idArray = ["lGcr5crBXEk", "P4s0oOpvzeM", "JHTQGRaZyTM", "8wjAVrohd6E", "HQP_UGR0UnE", "hincEDrOO7o", "xn5lkF3GCoU", "2W4DvMyVh_8", "ei3Bh1LnF9c", "aBoCL_qfKTk", "TJIZUS4U9Cs", "ePeX3ezFXtc", "U8loUIDYwIY", "i5lXI3cYucg", "T6baQG0ait8", "hxG9LwYVn6M", "ykskH18jzBo"]

let counter = 0

function sequencer(){
  console.log("sequencer ran")
  console.log("sequencer document terminate", document.terminate)
  if (document.terminate === 1) {
    console.log("TERMINATING!")
    return
  }
  counter > (idArray.length - 1) ? counter = 0 : console.log("")
  playNextVideo()
  counter += 1

  setTimeout(sequencer, (loopLength * Math.random()))

}

function playNextVideo() {
  console.log("players play next video started ")
  let p = counter % numPlayers
  let n = (p + 1) % (numPlayers) 
  console.log("players", p, n)
  
  let x = getRandomInt(1, idArray.length) - 1
  const video = idArray[x]
  
  console.log("play next video", video)
  // players need to be in an array
  let previous = (((p - 1) % numPlayers) + numPlayers)  % numPlayers // real modulo bcos % is remainder, not modulo
  console.log(previous)
  let player = players[previous]
  console.log(player)
  player.loadVideoById(video)
  setTimeout( () => {
    console.log("fadeout", p)
    fadeInPlayer(`player${p}-container`)
    console.log("fadein", n)
    fadeOutPlayer(`player${n}-container`)
  }, 600) // delay to allow video to load before it fades in
  console.log("player", `player${p}`)
  let pl = document.getElementById(`player${n}`)
  pl.style.zIndex = 0
  videoSizeRandomisation(pl)

}



 function videoSizeRandomisation(pl) {
  if (window.innerWidth > 700) {
    let top = getRandomInt(-10, 50) + "%"
    let left = getRandomInt(20, 50) + "%"
    let wide = getRandomInt(15, 80) 
    pl.style.top = top
    pl.style.left = left
    pl.style.width = wide + "vw"
    pl.style.height = wide * .66 + "vw"
  }
  else {
    let top = getRandomInt(0, 95) + "%"
    let left = getRandomInt(-10, 50) + "%"
    pl.style.top = top
    pl.style.left = left
  }
 }

 function fadeOutPlayer(player) {
  document.getElementById(player).animate(fadeOut, fadeTiming)
  console.log("faded out", player)
  // Promise.all(document.getElementById(player).getAnimations().map((animation) => animation.finished))
  // .then(
  // () =>   {
  //         console.log("fade out finished for", player)});
 }

 function fadeInPlayer(player) {
  document.getElementById(player).animate(fadeIn, fadeTiming)
  console.log("faded in", player)
  // Promise.all(document.getElementById(player).getAnimations().map((animation) => animation.finished))
  // .then(
  // () =>   {
  //         console.log("fade in finished for", player)});

 }

 function fadeInAndOutPlayer(player) {
  document.getElementById(player).animate(fadeInAndOut, fadeInOutTiming)
  // console.log("faded out", player)

 }

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.

 function killYouTube() {
  
  // document.terminate = 1
  document.querySelectorAll('.player-container')
  .forEach(iframe => iframe.remove())
  playerCount = 0
  players = []
  // createPlayerDivs()
  setTimeout(terminateReset, 1000)
  

  
 }

 function terminateReset() {
  document.terminate = 1
  createPlayerDivs()
  
  
  if (terminateCount < terminateLimit) {
    setTimeout(onYouTubeIframeAPIReady, 1000)
    setTimeout(()=>{document.getElementById("kill-youtube").textContent = "click here a few times if you can't read the text..."}, 500)
    document.terminate = 0

  }
  terminateCount += 1

 }



 function createPlayerDivs() {
  let cont = document.getElementById("master-video-container")
 
  for (let i=0;i<=numPlayers;i++){
    let div = document.createElement("div")
    div.classList.add("player-container")
    div.id = `player${i}-container`
    let subDiv = document.createElement("div")
    subDiv.classList.add("player")
    subDiv.id = `player${i}`
    cont.appendChild(div)
    div.appendChild(subDiv)

  }
 }

 function onYouTubeIframeAPIReady() {
  console.log("loading players!")


  if (document.terminate === 1) {
   
    console.log("TERMINATING!")
    return
  }
  
  
  console.log("loading player ",playerCount)
  
  let newPlayer = new YT.Player(`player${playerCount}`, {
    height: '195',
    width: '320',
    loop: 1,
    autoplay: 1,
    videoId: 'ykskH18jzBo',
    playerVars: {
      playsinline: '1',
      mute: '1',
      autoplay: '1',
      vq: 'sd480',
      controls: '0',
    //  fs: 0,
      
      modestbranding: '1',
        
    },
    
    events: {
      
      'onReady':         () => { 
        // if (document.terminate === 1) {
        //   console.log("TERMINATING!")
        //   return
        // }
        onReadyEvent(newPlayer)
        }
    },
})
    
  
}

function onReadyEvent(newPlayer) {

    newPlayer.mute();
    newPlayer.playVideo()
    console.log("In on ready event")
    players.push(newPlayer);
    let pl = document.getElementById(`player${playerCount}`)
    let plC = document.getElementById(`player${playerCount}-container`)
    let x = getRandomInt(1, idArray.length) - 1
    var rand = idArray[x]
    newPlayer.loadVideoById(idArray[rand])
    console.log(playerCount, " should be loaded now", playerCount)
    videoSizeRandomisation(pl)
    console.log("fadeout", pl)
    fadeInAndOutPlayer(`player${playerCount}-container`)
    // delay to allow video to load before it fades in
    
    let max = numPlayers - 1
    // plC.style.opacity = 0.3
    if (playerCount === max) {
      setTimeout(sequencer, 1000)
      return
    }
    playerCount += 1
    
    onYouTubeIframeAPIReady()
}
 
function youTubeSearch(){
  var arr_search = {
    "part": 'snippet',
    "type": 'video',
    "order": orderby,
    "maxResults": maxresult,
    "q": searchString
};

}



 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}