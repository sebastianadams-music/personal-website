import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import {
    getFirestore, collection, getDocs, orderBy, query, limit, startAfter, where, addDoc, getDoc, doc, 
    connectFirestoreEmulator, enableIndexedDbPersistence,
 } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js'


 const firebaseConfig = {
    apiKey: "AIzaSyCow7QEwQRTPcjXunO2hQvdlRmUBJiqcnU",
    authDomain: "fir-9-dojo-6212c.firebaseapp.com",
    projectId: "fir-9-dojo-6212c",
    storageBucket: "fir-9-dojo-6212c.appspot.com",
    messagingSenderId: "879791884368",
    appId: "1:879791884368:web:645ac75a4f19c50afea955",
  };

const queryLimit = 50
var visiblePieces

  // init firebase app
initializeApp(firebaseConfig)

// init services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


offlinePersistence(db)

    let selectedCategory = "all"
    // start after explained here: https://cloud.google.com/firestore/docs/query-data/query-cursors
    const colRef = query(collection(db, 'works'),limit(queryLimit), where("category", "array-contains", `${selectedCategory}`),orderBy(("index"), "desc"))
//get collection data
console.log(colRef)

firebaseRequest(colRef)

function firebaseRequest(colRef){
    getDocs(colRef)     
  .then((snapshot) => {
      let worksArray = []
      snapshot.docs.forEach((doc) => {
        worksArray.push({ ...doc.data(), id: doc.id })
      })
      return worksArray})
.then((worksArray) => {
    console.log("works: ", worksArray)
    processRequest(worksArray)    
})
}

function processRequest(worksArray){
    visiblePieces = 0
    console.group("Work")
    console.groupCollapsed(true)
    console.log(worksArray.forEach(d => {
      // if (d.work === undefined) {continue}
      // if (d.withdrawn === "Yes") {continue}
      console.log(d.work) 
    }))
    console.groupEnd("Work")
    for (let item in worksArray) {
      let d = worksArray[item]
      processItem(d, item)
    }
    document.worksArray = worksArray

}

function processItem(d, itemIndex) // takes an array containing in each position { ...doc.data(), id: doc.id }
{
    if (d.work === undefined) {return}
    if (d.withdrawn === "Yes") {return}
    visiblePieces += 1
    let titleLine = titleHTML(d.work, d.yearOfComposition, d.dur)
    titleLine.setAttribute("data-list-index", itemIndex)
    titleLine.addEventListener("click", (e) => {registerTitleClick(e)}, false)
    document.getElementById("worksSection").appendChild(titleLine)   
    if (visiblePieces < 10){
        titleLine.classList.add("popped") 
        let details = itemDetails(d)
        document.getElementById("worksSection").appendChild(details)   
    }
    else {
        let instrumentationLine = document.createElement("p")
        instrumentationLine.textContent = d.instrumentation
        document.getElementById("worksSection").appendChild(instrumentationLine)
    }

}

function itemDetails(d){
    let ul = document.createElement("ul")
    let info = document.createElement("li")
    let media = document.createElement("li")
    let categories = document.createElement("li")
    ul.appendChild(info)
    ul.appendChild(media)
    ul.appendChild(categories)
    let inst = document.createElement("p")
    inst.classList.add = "instrumentation"
    inst.textContent = d.instrumentation
    info.appendChild(inst)

    // web page
    if ((d.webPage === undefined)||(d.webPage === "")||(d.webPage === "N/A")){} else{
        linkButton(info, d.webPage, "open web page")
        }
    
    // more info
    if (d.moreInfo && (d.moreInfo !== "N/A")){
        let moreInfo = document.createElement("p")
        moreInfo.innerHTML = d.moreInfo
        moreInfo.classList.add("more-info")
        hiddenContentOutsideGrid(info, moreInfo, "[more info]")
    }
    
    //score
    if (d.scoreText && (d.scoreText !== "N/A") && (d.scoreText !== "")){
                let score = document.createElement("p")
                score.textContent = d.scoreText
                score.classList.add("score")
                hiddenContentButton(info, score, "[read score]")
    }
    else if (d.scoreLink && (d.scoreLink !== "N/A")){
        console.log("scorelink")
        linkButton(info, d.scoreLink, "download score")
    }
    //prognote
    if (d.programmeNote && (d.programmeNote !== "N/A")){
        linkButton(info, d.programmeNote, "[programme note]")
    }
    //commissioned
    if (d.commissioned !== "N/A") {
        let comm = document.createElement("p")
        comm.classList.add("commissioned")
        comm.textContent = `Commissioned by ${d.commissioned}`
        info.appendChild(comm)
        }     
    ////media
    if (d.embed){
               
        // if (d.embed !== "N/A") 
            
        {     
            console.log("entered embed", `${d.webSnippet}`, d.work)
            if (d.webSnippet && (d.webSnippet !== "N/A") && (d.webSnippet !== ""))
            {
                let s = loadWebSnippet(d.webSnippet)
                media.appendChild(s)
                console.log("trying to load scripts")
                loadScripts(d.loadScripts)

            }
            else if (d.spotifyStatus !== "Yes" ){
                let yt = createYouTubeEmbed("P6My5ug-EOg")
                
                // let img = document.createElement("img")
                // img.setAttribute("src", "/img/teapot.jpeg")
                yt.classList.add("media")
                media.appendChild(yt)
    
            }
            else {
                // console.log("embed,", d.embed)
                // console.log("d.spo", d.spotifyID)
                let sp = createSpotifyEmbed(d.spotifyID)
                // console.log("sp", sp)
                media.appendChild(sp)

                }
            }
        }
    /////categories    
    let cats = ""
    d.category.forEach(element => {
        if (element !== ""){
            if (element !== "all"){
            cats += `[${element}] `
            }
        }
    });
    categories.textContent = cats
    
    return ul
}









function titleHTML(work, yearOfComposition, dur){
    let e = document.createElement("h1")
    let title = document.createElement("span")
    title.classList.add("title")
    let year = document.createElement("span")
    year.classList.add("year")
    let duration = document.createElement("span")
    duration.classList.add("duration")
    e.appendChild(title)
    e.appendChild(year)
    e.appendChild(duration)
    title.textContent = work
    year.textContent = ` (${yearOfComposition})`
    duration.textContent = ` [${dur}]'`
    return e

}


function createYouTubeEmbed(youTubeID){
    let i = document.createElement("iframe")
    i.setAttribute("width", 320)
    i.setAttribute("height", 240)
    i.setAttribute("title", "YouTube video player")
    i.setAttribute("frameboder", 0)
    i.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    i.setAttribute("allowfullscreen", 1)
    i.setAttribute("src", `https://www.youtube-nocookie.com/embed/${youTubeID}`)
    return i
}

function createSpotifyEmbed(trackID){
    let i = document.createElement("iframe")
    i.setAttribute("width", 320)
    i.setAttribute("height", 240)
    i.setAttribute("title", "Spotify Player")
    i.setAttribute("frameboder", 0)
    i.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture")
    i.setAttribute("loading", "lazy")
    i.setAttribute("src", `https://open.spotify.com/embed/track/${trackID}?utm_source=generator`)

    return i
}

// 
{/* <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4y18Ubv6t2ybX5OGcHq717?utm_source=generator" width="50%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */}

function detailsSummary(details, summary){
    let s = document.createElement("summary")
    let d = document.createElement("details")
    s.textContent = summary
    d.textContent = details
    d.insertAdjacentElement("afterbegin", s)
    return d}


function hiddenContentButton(destination, content, buttonText){
    destination.appendChild(content) // content is already created but not added to DOM
    content.style.display = "none"    
    let b = document.createElement("button")
    b.textContent = buttonText
    b.classList.add("show-btn")
    b.addEventListener("click", () => {if (content.style.display === "none") {content.style.display = "grid"} else {content.style.display = "none"}})
    content.insertAdjacentElement("beforebegin", b) // button is added right before content.
    return content
}

function hiddenContentOutsideGrid(destination, content, buttonText){
    destination.parentElement.appendChild(content) // content is already created but not added to DOM
    content.style.display = "none"    
    let b = document.createElement("button")
    b.textContent = buttonText
    b.classList.add("show-btn")
    b.addEventListener("click", () => {if (content.style.display === "none") {content.style.display = "grid"} else {content.style.display = "none"}})
    destination.appendChild(b)
    return content
}

function linkButton(destination, link, buttonText){
    let b = document.createElement("button")
    b.textContent = buttonText
    b.setAttribute("onclick", `window.open("${link}"), '_blank'`)
    destination.appendChild(b)
    console.log("link is: ", link)

}

function offlinePersistence(db){
    enableIndexedDbPersistence(db)
    .then(() => console.log("Enabled offline persistence"))
    .catch((error) => {
      if (error.code == "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (error.code == "unimplemented") {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });

    console.log("db", db)
}

function registerTitleClick(e){
    let t = e.target.parentElement
    if (!e.target.classList.contains("popped") && !(t.classList.contains("popped")) ) {
    t.nextElementSibling.remove() // removes preview instrumentation line
    e.target.classList.add("popped")
    let d = t.getAttribute("data-list-index")
    let details = itemDetails(document.worksArray[d])
    t.insertAdjacentElement("afterend", details)   
    } 
    
}


function loadScripts(scriptList){
    console.log("SCRIPTLIST", scriptList)
    scriptList = scriptList.split(" ")
    scriptList.forEach((e) => getScript(e))
}

function loadWebSnippet(snippet){
    let d = document.createElement("div")
    d.innerHTML = snippet
    return d
}

const getScript=(url)=>{
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    script.async = false
    if(document.body == null){
        document.head.appendChild(script);
    }else{
        document.body.appendChild(script);
    }
    console.log(`script ${url} has been added to DOM`)
}
