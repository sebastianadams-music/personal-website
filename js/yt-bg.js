 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementById('yt-bg-script');
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let players = []
let playerCount = 0
let numPlayers = 12


const loopLength = 12000

 const fadeOut = [
  { opacity: .7  },
  { opacity: 0. },
  ]

  const fadeIn = [
    { opacity: 0.  },
    { opacity: .7 },
    ]
  

const fadeTiming = {
  duration: loopLength * .85,
  iterations: 1,
  fill: "forwards"

}

let idArray = ["lGcr5crBXEk", "P4s0oOpvzeM", "JHTQGRaZyTM", "8wjAVrohd6E", "HQP_UGR0UnE", "hincEDrOO7o", "xn5lkF3GCoU", "2W4DvMyVh_8", "ei3Bh1LnF9c", "aBoCL_qfKTk", "TJIZUS4U9Cs", "ePeX3ezFXtc", "U8loUIDYwIY", "i5lXI3cYucg", "T6baQG0ait8", ]

let counter = 0

function sequencer(){
  console.log("sequencer ran")

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


// function playNextVideo_old  () {

//   if ((counter % 2) == 0) {
//       let x = getRandomInt(1, idArray.length) - 1
//       const video = idArray[x]
//       console.log("play next video", video)
//       console.log(playerTwo)
//       playerTwo.loadVideoById(video)
//       setTimeout( () => {
//         fadeOutPlayer("player3-container")
//         fadeInPlayer("player2-container")
//       }, 600) // delay to allow video to load before it fades in
//       let pl = document.getElementById("player2")
//       pl.style.zIndex = 0
//       if (window.innerWidth > 700) {
//         let top = getRandomInt(-10, 50) + "%"
//         let left = getRandomInt(20, 50) + "%"
//         let wide = getRandomInt(15, 80) 
//         pl.style.top = top
//         pl.style.left = left
//         pl.style.width = wide + "vw"
//         pl.style.height = wide * .66 + "vh"
//       }
//       else {
//         let top = getRandomInt(0, 95) + "%"
//         let left = getRandomInt(-10, 50) + "%"
//         pl.style.top = top
//         pl.style.left = left
//       }
//   } 
//   else {
//       console.log(counter, "counter")
//       let x = getRandomInt(1, idArray.length) - 1
//       const video = idArray[x]
//       console.log("play next video", video)
//       playerThree.loadVideoById(video)
//       setTimeout( () => {
//         fadeOutPlayer("player2-container")
//         fadeInPlayer("player3-container")
//       }, 600) // delay to allow video to load before it fades in
//       let pl = document.getElementById("player3")
//       pl.style.zIndex = 0
//       // big window
//       if (window.innerWidth > 700) {
//         let top = getRandomInt(-10, 50) + "%"
//         let left = getRandomInt(20, 50) + "%"
//         let wide = getRandomInt(15, 80)
//         pl.style.top = top
//         pl.style.left = left
//         pl.style.width = wide + "vw"
//         pl.style.height = wide * .66 + "vh"
//       }
//       // small window
//       else {
//         let top = getRandomInt(0, 95) + "%"
//         let left = getRandomInt(-10, 50) + "%"
//         pl.style.top = top
//         pl.style.left = left
//       }
    
//     }

// }

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

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.

 
 function onYouTubeIframeAPIReady() {
  console.log("loading players!")
  let max = numPlayers - 1
  let newPlayer
      console.log("loading player ",playerCount)
      let x = getRandomInt(1, idArray.length) - 1
      var rand = idArray[x]
      newPlayer = new YT.Player(`player${playerCount}`, {
        height: '390',
        width: '640',
        loop: 1,
        autoplay: 1,
        videoId: idArray[rand],
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
            players.push(newPlayer);
            let pl = document.getElementById(`player${playerCount}`)
            let plC = document.getElementById(`player${playerCount}-container`)
            videoSizeRandomisation(pl)
            // plC.style.opacity = 0.3
            if (playerCount === max) {
              setTimeout(sequencer, 1000)
              return
            }
            playerCount += 1
            onYouTubeIframeAPIReady()
            }
        },
    })
    
  
}
 
//  function onYouTubeIframeAPIReady() {

//   console.log("loading players!")

// playerTwo = new YT.Player('player0', {
//  height: '390',
//  width: '640',
//  loop: 1,
//  videoId: 'rswxcDyotXA',
//  playerVars: {
//    'playsinline': 1,
//    mute: 1,
//    'autoplay': 1,
//    controls: 0,
//   fs: 0,
  
//   modestbranding: 1,
    
//  },
 
//  events: {
//    'onReady': () => {
//     players.push(playerTwo)
//     // next player created only when first player is ready

//     playerThree = new YT.Player('player1', {
//       height: '390',
//       width: '640',
//       videoId: '8wjAVrohd6E', 
      
//    fs: 0,
//    loop: 1,
//    modestbranding: 1,
//       playerVars: {
//         playsinline: 1,
//         autoplay: 1,
//         controls: 0,
//         mute: 1,
//         fs: 0,
//         modestbranding: 1,
//         "fs": 0,
//         "loop": 1,
//         "modestbranding": 1,
 
       
 
//       },
//       events: {
//         'onReady':         () => { players.push(playerThree);
//         setTimeout(sequencer, 1000)}
//         // 'onStateChange': onPlayer3StateChange
//       }
//     });
//    }
//   //  'onStateChange': onPlayerStateChange
//  }
// }
// );



//     // starts sequence

//  }



 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}