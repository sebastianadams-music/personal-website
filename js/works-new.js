// next step is to create link to category display on each category button
// fix mistakes in database
// improve layout

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import {
    getFirestore, collection, getDocs, orderBy, query, limit, startAfter, where, addDoc, getDoc, doc, 
    connectFirestoreEmulator, enableIndexedDbPersistence,
 } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js'

 document.scriptList = []

 const firebaseConfig = {
    apiKey: "AIzaSyCow7QEwQRTPcjXunO2hQvdlRmUBJiqcnU",
    authDomain: "fir-9-dojo-6212c.firebaseapp.com",
    projectId: "fir-9-dojo-6212c",
    storageBucket: "fir-9-dojo-6212c.appspot.com",
    messagingSenderId: "879791884368",
    appId: "1:879791884368:web:645ac75a4f19c50afea955",
  };

const queryLimit = 250
var visiblePieces

  // init firebase app
initializeApp(firebaseConfig)

// init services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


offlinePersistence(db)

// let selectedCategory = "all"
// start after explained here: https://cloud.google.com/firestore/docs/query-data/query-cursors
const colRef = query(collection(db, 'works'),
                    limit(queryLimit), 
                    // where("category", "array-contains", `${selectedCategory}`),
                    orderBy(("index"), "desc"))
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
    addCategoryListener()
    addSearchListener()
    addRandomListener()
    addResetListener()
    document.worksArray = worksArray
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

}

function processItem(d, itemIndex) // takes an array containing in each position { ...doc.data(), id: doc.id }
{
    if (d.work === undefined) {return}
    if (d.withdrawn === "Yes") {return}
    let e = document.getElementById("category")
    console.log(e.options[e.selectedIndex].value)
    if (!(d.category.includes(e.options[e.selectedIndex].value))) {return}
    var search = document.getElementById('link-box').value.toLowerCase();
    console.log("search is now", search) 
    if (!(searchLogic(d, search))) {return}
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
    //parts
    if (d.parts){
        // add line to check if d.work.zip exists and if not, use the ID number
        linkButton(info, `parts/${d.work}.zip`, "[download instrumental parts]")
    }
    }
    // software
    if (d.softwareLink){
        linkButton(info, `dl/${d.work}.zip`, "[download software]")
    }
    if (d.downloadMedia){
        linkButton(info, d.downloadMedia, "[download media files]")
    }
    if (d.gitHub){
        linkButton(info, d.gitHub, "[gitHub repo]")
    }
    //commissioned
    if (d.commissioned !== "N/A") {
        let comm = document.createElement("p")
        comm.classList.add("commissioned")
        comm.textContent = `Commissioned by ${d.commissioned}`
        info.appendChild(comm)
        }     
    ////media
    if (d.webSnippet && (d.webSnippet !== "N/A") && (d.webSnippet !== ""))
        {
            let s = loadWebSnippet(d.webSnippet)
            media.appendChild(s)
            console.log("trying to load scripts")
            loadScripts(d.loadScripts)

        }
        else if (d.youTubeID) {
            let yt = createYouTubeEmbed(d.youTubeID)
            
            // let img = document.createElement("img")
            // img.setAttribute("src", "/img/teapot.jpeg")
            yt.classList.add("media")
            media.appendChild(yt)
        }
        
        else if (d.spotifyID) {
            // console.log("embed,", d.embed)
            // console.log("d.spo", d.spotifyID)
            let sp = createSpotifyEmbed(d.spotifyID)
            // console.log("sp", sp)
            media.appendChild(sp)
            }
        else if (d.soundcloudID) {
            let sc = createSoundcloudEmbed(d.soundcloudID)
            media.appendChild(sc)
        }
        else if (d.image) {
            let img = createImage(d.image)
            media.appendChild(img)
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
    i.setAttribute("frameborder", 0)
    i.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture")
    i.setAttribute("loading", "lazy")
    i.setAttribute("src", `https://open.spotify.com/embed/track/${trackID}?utm_source=generator`)

    return i
}
// 
/* <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4y18Ubv6t2ybX5OGcHq717?utm_source=generator" width="50%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> */


function createSoundcloudEmbed(trackID){
    let i = document.createElement("iframe")
    i.setAttribute("width", 320)
    i.setAttribute("height", 240)
    i.setAttribute("title", "SoundCloud Player")
    i.setAttribute("frameborder", 0)
    i.setAttribute("scrolling", "no")
    i.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture")
    i.setAttribute("loading", "lazy")
    if (trackID.match("playlist")){
        trackID = trackID.replace(/\D/g, '');
        i.setAttribute("src", `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${trackID}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`)

    }
    else{
        i.setAttribute("src", `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackID}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`)
    }
    
    return i
}
/* 
<iframe width="320" height="240" title="SoundCloud Player" frameborder="0" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/47134797&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"></iframe> */

/* 
<iframe width="100%" height="160" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/471347979&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe> */

function createImage(imageURL){
    let d = document.createElement("div")
    let i = document.createElement("img")
    d.appendChild(i)
    d.setAttribute("width", 320)
    d.setAttribute("height", 240)
    i.setAttribute("src", imageURL)
    i.classList.add("work-image")
    return d
}

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

// need to ensure that no scripts called in this way will re-assign identifiers when the relevant code is deleted and re-created e.g. by changing const or let to var
const getScript=(url)=>{
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    script.async = false
    if(document.body == null){
        document.head.appendChild(script);
        document.scriptList.push(url)
    }else{
        document.body.appendChild(script);
        document.scriptList.push(url)
    }
    console.log(`script ${url} has been added to DOM`)
}

function searchLogic(d, search){
    let searchTermsMatched = 0
    search = search.toLowerCase().split(" ")
    for (const item of search){        
        if (
           !( 
            // if any of these fields match any search term
            (`${d.work}`.toLowerCase().indexOf(item) == -1) && 
            (`${d.instrumentation}`.toLowerCase().indexOf(item) == -1) && 
            (`${d.categories}`.toLowerCase().indexOf(item) == -1) && 
            (`${d.yearOfComposition}`.toLowerCase().indexOf(item) == -1) && 
            (`index${d.index}`.indexOf(item) == -1 )))         
      { searchTermsMatched += 1 }
      }
      if (searchTermsMatched == search.length) 
      { return true}
}

function addCategoryListener() {
    const cat = document.getElementById("category")
    cat.addEventListener(
        'change', function() {
            clearWorks()
            processRequest(document.worksArray) 
        }, false
    )
    
}

function addSearchListener() {
  
            const searchField = document.getElementById ("link-box") 
            searchField.addEventListener(
                'input', function() {
                clearWorks()
                processRequest(document.worksArray) }, false
            );
            
            
          }

function addRandomListener() {
  
            const randomButton = document.getElementById ("randomButton")
            // console.log("adding Random listner")
            randomButton.addEventListener('click', runRandom, false);
            // console.log(" Random listner added")
             //searchListener wrapped in jquery to make sure site is READY. Otherwise there are killer problems!
            
          }

function addResetListener() {
    const resetButton = document.getElementById("resetButton")
    resetButton.addEventListener('click', function() {
                clearWorks()
                resetButton.style.visibility = "hidden"
                processRequest(document.worksArray) }, false)


}
          
          function runRandom(){
            const length = document.worksArray.length
            let randomWorkArray = []
            let randomWork = 14 + Math.floor(Math.random() * (length - 13));
            console.log(randomWork)
            randomWorkArray.push(document.worksArray[randomWork])
            if (!(randomWorkArray)){
                console.log("must re-run")
                runRandom()
            }
            else if ((randomWorkArray[0].withdrawn === "Yes")){
                console.log("must re-run")
                runRandom()
            }
            else {
                console.log("rWA", randomWorkArray)
            clearWorks()
            document.getElementById("resetButton").style.visibility = "visible"
            processRequest(randomWorkArray) 
            }
            
          
          }




          function clearWorks(){
            document.getElementById("worksSection").innerHTML = ""; 
          }

