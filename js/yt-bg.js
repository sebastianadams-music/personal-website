 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 var playerTwo;
 var playerThree;
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementById('yt-bg-script');
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let players = []

const loopLength = 4000

 const fadeOut = [
  { opacity: 1  },
  { opacity: 0 },
  ]

  const fadeIn = [
    { opacity: 0  },
    { opacity: 1 },
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

  setTimeout(sequencer, loopLength)

}

function playNextVideo() {
  let numPlayers = 2 
  let p = (counter % numPlayers)
  
  let x = getRandomInt(1, idArray.length) - 1
  const video = idArray[x]
  
  console.log("play next video", video)
  // players need to be in an array
  let player = players[p]
  console.log(player)
  player.loadVideoById(video)
  setTimeout( () => {
    console.log("fadeout", p + 2)
    fadeOutPlayer(`player${p + 2}-container`)
    p = 3 ? p = 2 : p = p // horribly stupid hack... :(
    console.log("fadein", p)
    fadeInPlayer(`player${p}-container`)
  }, 600) // delay to allow video to load before it fades in
  console.log("player", `player${p}`)
  let pl = document.getElementById(`player${p + 2}`)
  pl.style.zIndex = 0
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
 
 function NEWonYouTubeIframeAPIReady() {
  console.log("loading players!")
  let max = 2
  let newPlayer
  for (let i = 0; i < max; i++){
    
    if (i === max) {
      console.log("loading last player ", i + 2)

      newPlayer = new YT.Player(`player${i+2}`, {
        height: '390',
        width: '640',
        loop: 1,
        videoId: 'rswxcDyotXA',
        playerVars: {
          'playsinline': 1,
          mute: 1,
          'autoplay': 1,
          controls: 0,
         fs: 0,
         
         modestbranding: 1,
           
        },
        
        events: {
          'onReady':         () => { players.push(newPlayer);
            setTimeout(sequencer, 1000)}
        }
    })
    return
  }

  console.log("loading player ", i + 2)

  newPlayer = new YT.Player(`player${i+2}`, {
    height: '390',
    width: '640',
    loop: 1,
    videoId: 'rswxcDyotXA',
    playerVars: {
      'playsinline': 1,
      mute: 1,
      'autoplay': 1,
      controls: 0,
     fs: 0,
     
     modestbranding: 1,
       
    },
    
    events: {
      'onReady': players.push(newPlayer)
        }
    })
  }
 }
 
 function onYouTubeIframeAPIReady() {

  console.log("loading players!")

playerTwo = new YT.Player('player2', {
 height: '390',
 width: '640',
 loop: 1,
 videoId: 'rswxcDyotXA',
 playerVars: {
   'playsinline': 1,
   mute: 1,
   'autoplay': 1,
   controls: 0,
  fs: 0,
  
  modestbranding: 1,
    
 },
 
 events: {
   'onReady': () => {
    players.push(playerTwo)
    // next player created only when first player is ready

    playerThree = new YT.Player('player3', {
      height: '390',
      width: '640',
      videoId: '8wjAVrohd6E', 
      
   fs: 0,
   loop: 1,
   modestbranding: 1,
      playerVars: {
        playsinline: 1,
        autoplay: 1,
        controls: 0,
        mute: 1,
        fs: 0,
        modestbranding: 1,
        "fs": 0,
        "loop": 1,
        "modestbranding": 1,
 
       
 
      },
      events: {
        'onReady':         () => { players.push(playerThree);
        setTimeout(sequencer, 1000)}
        // 'onStateChange': onPlayer3StateChange
      }
    });
   }
  //  'onStateChange': onPlayerStateChange
 }
}
);



    // starts sequence

 }



 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}