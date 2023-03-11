import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
import {
    getFirestore, collection, getDocs, orderBy, query, where, addDoc, getDoc, doc

 } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js'

//  import $ from "https://code.jquery.com/jquery-3.6.4.js";

const firebaseConfig = {
    apiKey: "AIzaSyCow7QEwQRTPcjXunO2hQvdlRmUBJiqcnU",
    authDomain: "fir-9-dojo-6212c.firebaseapp.com",
    projectId: "fir-9-dojo-6212c",
    storageBucket: "fir-9-dojo-6212c.appspot.com",
    messagingSenderId: "879791884368",
    appId: "1:879791884368:web:645ac75a4f19c50afea955"
  };

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

addCategoryListener()


  
    //Then get its value
  //var selectCategory = selection.value;



//////////////////////////////////////////////////////////////////////////
/* 
next steps:
-> set up user authentication for me only, to bypass score download and expose other functions (or come up with a smart way of basing that on this site and keeping in sync)
-> add script and button to load a random score
-> figure out dynamic script loading to get generative javascipt pieces to load directly
 */

//const colRef = collection(db, 'works')
let ranBefore = 0;
var collectionLength = 0;

addSearchListener();
addSearchBoxListener()
addRandomListener()

var selectedCategory = "all"

init(selectedCategory)


//////////////////////////////////////////////////////////////////////////

function init (selectedCategory){
//formulate the query
const colRef = query(collection(db, 'works'), where("category", "array-contains", `${selectedCategory}`),orderBy(("index"), "desc"))
//get collection data
getDocs(colRef)     
  .then((snapshot) => {
      let worksArray = []
      snapshot.docs.forEach((doc) => {
        worksArray.push({ ...doc.data(), id: doc.id })
        

      })
      
      let  x = 0;   // x is the number which increments for embedded media 
      let scoreform = 0;
      let  excluded = 0;
      let included = 0;
      let dateComposed = 0;
      



      var excludedExists = document.getElementById("noexcluded");
      console.log(`length: ${worksArray.length}`)
      for (const value in worksArray)
      {
            // fieldlist
            let work = Object.values(worksArray)[value].work;
            let index = Object.values(worksArray)[value].id;
            let index_number = Object.values(worksArray)[value].index;
            let instrumentation = Object.values(worksArray)[value].instrumentation;
            let duration = Object.values(worksArray)[value].dur;
            let commissioned = Object.values(worksArray)[value].commissioned;
            let categories = Object.values(worksArray)[value].category;
            let withdrawn = Object.values(worksArray)[value].withdrawn;
            let revised = Object.values(worksArray)[value].rev;
            let yearOfComposition = Object.values(worksArray)[value].yearOfComposition;
            let programmeNote = Object.values(worksArray)[value].programmeNote;
            let embed = Object.values(worksArray)[value].embed;
            let scoreAvail = Object.values(worksArray)[value].scoreAvail;
            let scoreLink = Object.values(worksArray)[value].scoreLink;
            let scoreText = Object.values(worksArray)[value].scoreText;
            let webPage = Object.values(worksArray)[value].webPage;
            let moreInfo = Object.values(worksArray)[value].moreInfo;
            
            var element = document.getElementById("worklist");  
            if (work === undefined) {continue}
            if (withdrawn === "Yes") {continue;}
            
            included = included + 1; //increments count of non-withdrawn pieces
                    
            //start of search section. Searches for match to title, then inst, then year
            if (ranBefore == 0) {
                URLEndToSearch() // if the function already ran, doesnt' run the function to check for a hashlink
              }
                        
            console.log("search", search)
            var search = document.getElementById('link-box').value.toLowerCase(); //gets search box
            search = search.split(" ")
            console.log("search2", search)
            let searchTermsMatched = 0
            for (const item of search){
              console.log("item1", item, "index", `${index_number}`)
              
              if ((`${work}`.toLowerCase().indexOf(item) == -1) && (`${instrumentation}`.toLowerCase().indexOf(item) == -1) && (`${categories}`.toLowerCase().indexOf(item) == -1) && (`${yearOfComposition}`.toLowerCase().indexOf(item) == -1) && (`index${index_number}`.indexOf(item) == -1 )) 
              { console.log("item2", item.replace("index",""))
              
                } else
              
            { searchTermsMatched += 1 }
            }
            if (searchTermsMatched != search.length) 
            {excluded = excluded + 1; continue} 
            else {}
            
            if (dateComposed != yearOfComposition) {
              dateComposed = yearOfComposition
              var yearsep = `<h1>${yearOfComposition} </h1>`;
              element.insertAdjacentHTML('beforeend', yearsep);  
            }
              
            //title, year
            if (revised === "N/A") {
              var worktitle =   `<h3>${work} \(${yearOfComposition}\)</h3>`;
              element.insertAdjacentHTML('beforeend', worktitle);  
            } else {
              var worktitle =   `<h3>${work} \(${yearOfComposition}<i> rev. ${revised}</i>\)</h3)`;
              element.insertAdjacentHTML('beforeend', worktitle);  
            }            

            // Inst + dur
            var instdur = `${instrumentation}
            <br>[${duration}'\]`; 
            element.insertAdjacentHTML('beforeend', instdur);      

            // commissioned
            if (commissioned !== "N/A") {
              var pieceIsCommissioned = `<br><i>Commissioned by ${commissioned}</i><br>`;
              element.insertAdjacentHTML('beforeend', pieceIsCommissioned);  
              }     
            
            // embed link
            if (embed){
               
            if (embed !== "N/A") {
              var embedlink = embed;  
              var embedyoutube = `  <div onClick="openClose(\'a${x}\')" style="cursor:hand; cursor:pointer; "><b>listen [+]</b></div>
              <div id="a${x}" class="texter"> <div class="videoWrapper">${embedlink}</div><span style="cursor:hand; cursor:pointer" onClick="closeAll()"></span> </div>  `;
              var embedcode = `  <div onClick="openClose(\'a${x}\')" style="cursor:hand; cursor:pointer; "><b>listen [+]</b></div>
              <div id="a${x}" class="texter">${embedlink}<span style="cursor:hand; cursor:pointer" onClick="closeAll()"></span> </div>  `;    
              var embedchecker = String(embedlink.indexOf("youtube"));

              if (embedchecker !== -1)
                {    
                element.insertAdjacentHTML('beforeend', embedyoutube);
                } else
                {
                element.insertAdjacentHTML('beforeend', embedcode);
                }      
              x = x + 1;   
              }
            }      

            // score form //////////////////////////////

            if (scoreAvail !== "0") {
              var score = `<div class="scoreDownload" id="index${index}" " style="cursor:hand; cursor:pointer; "><b>score [+]</b></div>` 
              element.insertAdjacentHTML('beforeend', score);         
              scoreform += 1 
              }      
  
              // score text       
              if (scoreText !== "N/A") {
              var scoretexttext = scoreText;  
              var scoreTextCode = `  <div onClick="openClose(\'a${x}\')" style="cursor:hand; cursor:pointer; "><b>read score [+]</b></div>
              <div id="a${x}" class="texter">${scoretexttext}<span style="cursor:hand; cursor:pointer" onClick="closeAll()"></span> </div>  `;    
              element.insertAdjacentHTML('beforeend', scoreTextCode);
              x = x + 1;   
              }       


            // prog note
            if (programmeNote !== "N/A") {
            var prognote = `<div><a href="${programmeNote}"target="_blank">[programme note]</a></div>`;  
            element.insertAdjacentHTML('beforeend', prognote);          
            }
            //more info
            if (moreInfo === undefined){} else{ // try to get this working with formatted text, that would be massive 

              if ((moreInfo !== "N/A") && (moreInfo !== "")){
                var moreinfotext = moreInfo  
              var moreInfoCode = `  <div onClick="openClose(\'a${x}\')" style="cursor:hand; white-space: pre-wrap;
              cursor:pointer; "><b>more info [+]</b></div>
              <div id="a${x}" class="texter"><span style="cursor:hand; cursor:pointer" onClick="closeAll()"></span> </div>  `;
              const moreInfoID = `a${x}`
              console.log(moreInfoID)
              element.insertAdjacentHTML('beforeend', moreInfoCode);
              const infoEl = document.getElementById(moreInfoID) 
              const infoContent = moreinfotext
              console.log(infoEl)
              infoEl.innerHTML = infoContent
              x = x + 1;
              }
            }
            // web page
            if (webPage === undefined){} else{

            if ((webPage !== "N/A") && (webPage !== "")){
              var webpage = `<div><a href="${webPage}"target="_blank">[click for more info]</a></div>`;  
              element.insertAdjacentHTML('beforeend', webpage);     
            }
            }

            // thematic break
            var ruler = `<hr>`;
            element.insertAdjacentHTML('beforeend', ruler);
            console.log(work)

      }
      // main loop ends just above this comment!
      //$(function(){scoreForm()}) // runs the event listener creation on score download forms
      console.log(included, excluded)
      if (excluded == included) 
        {element.innerHTML = `<div id=noresults">No results Found! <br> If you searched with an index number (or by clicking the random button), this piece has been withdrawn. If you searched with a text string, please try another search term. </div>`;} 
      ranBefore = 1; //always runs at the end of iter(), this means that the hashlink will be ignored after first run
      collectionLength = worksArray.length
      console.error("inside at end of loop")
      return scoreForm() 
    },)

    
    
   /*  $(function(){scoreForm()}) // runs the event listener creation on score download forms */
              } 


////////////////////////////////////////////////////////////////////////////////////////////////////////////



function URLEndToSearch(){
  const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
                    var work_url = getLastItem(window.location.href);
                    if (work_url !== '') //if url isn't blank then
                      {
                        if ((work_url != "works") && (work_url != "works.html") && (work_url != "works-testing"))
                        {
                          console.log("url doesn't match, it is: ", work_url)
                          work_url = work_url.replace("works","").replace(".html","").replace(/-/g, ' ').replace(/#/g, '').replace(/_/g, ' ');
                          document.getElementById('link-box').value = work_url;
                          ranBefore = 1
                          
                          createReSet()
                        } 
                    }
                      else {console.log("url is blank")}
                                                                    
}
  
function goTo(selectedCategory) {

    var resetExists = document.getElementById("reset-button");
    if (resetExists == null)
    {createReSet()}
    document.getElementById("category").style.display = "none";
    document.getElementById("worklist").innerHTML = "";  
    $(function() {
        init(selectedCategory);})
     
  }



  function catSelected(categoryHTML){
    var selectedCategory = categoryHTML.options[categoryHTML.selectedIndex].value
      
      
      $(function() {
        document.getElementById("worklist").innerHTML = "";
        init(selectedCategory);})
  }


function createReSet(){
  var node = document.createElement("input");
  var g = document.getElementById("blankdiv");
  g.insertBefore(node, g.children[0]);
  node.setAttribute("id", "reset-button");
  
  node.setAttribute("type", "button");
  node.setAttribute("value", " Reset ");
  //node.setAttribute("padding", "20px");
  node.setAttribute("class", "go");
  node.style.marginTop = ".5rem"
  node.style.padding = ".5rem"
  var reSetButton = document.getElementById("reset-button");
  reSetButton.addEventListener('click', function() { reSet() }, false);
}

function reSet(){
//reset button is dynamically created in js once the search function runs      

document.getElementById("worklist").innerHTML = "";
var g = document.getElementById("blankdiv");
var g_nested = document.getElementById("reset-button");
document.getElementById("link-box").value = "";
g.removeChild(g_nested);
document.getElementById("category").style.display = "block";
$(function() {
  init(selectedCategory);})
   
    }



// LISTENERS



function addCategoryListener() {
    const categoryHTML = document.getElementById("category")
    categoryHTML.addEventListener('change', function() { catSelected(categoryHTML) }, false)
  }


function addSearchListener() {
  
  const searchButton = document.getElementById ("searchButton") 
  searchButton.addEventListener('click', function() { goTo(selectedCategory) }, false);
   //searchListener wrapped in jquery to make sure site is READY. Otherwise there are killer problems!
  
}

function addSearchBoxListener() {
  
    document.getElementById('link-box').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    goTo(selectedCategory) 
  }

  })
}

function addRandomListener() {
  
  const randomButton = document.getElementById ("randomButton")
  console.log("adding Random listner")
  randomButton.addEventListener('click', runRandom, false);
  console.log(" Random listner added")
   //searchListener wrapped in jquery to make sure site is READY. Otherwise there are killer problems!
  
}

function runRandom(){
  const length = collectionLength
  console.log(length)
  let randomWork = 14 + Math.floor(Math.random() * (length - 13));
  document.getElementById('link-box').value = `index${randomWork}`
  goTo(selectedCategory) 

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// link listeners created on all scoreDownload elements; function opened is dynamicForm (only when one isn't already opened)
function scoreForm(){
  
    console.error("scoreForm starts")
    const divs = document.querySelectorAll('.scoreDownload');
  divs.forEach(el => el.addEventListener('click', event => {
      {if (document.getElementById("scoreformname") == null)  {
            dynamicForm(el)
         } else {
          document.getElementById("scoreformname").remove()
          dynamicForm(el)
         } 
      }
    }
    )
  );
  
} 

function dynamicForm(el){
  let calledScore = el // the scoreDownload element
  let p = document.createElement("p")
  var br = document.createElement("br"); 
  var form = document.createElement("form"); //creates form
  form.setAttribute("id", "scoreformname") //names form

      // Create an input element for emailID with a label 
       var EID = document.createElement("input");
       EID.setAttribute("type", "email");
       EID.setAttribute("name", "emailID");
       EID.setAttribute("id", "emailID");
       EID.setAttribute("required", "true")
       EID.setAttribute("size", "32")
       var LID = document.createElement("label");
       LID.setAttribute("for", "emailID")
       LID.innerHTML = "Enter your email: "
      // creates an explanation of the email usage
       var disclaimer = document.createElement("p");
       disclaimer.textContent = `Your email address will be stored in a secure Firestore (Google Cloud Services) database accessible only by me. and you will never be added to a mailing list. I may contact you directly about this score, when I see you have downloaded, but that's all. It's extremely useful for me to know who is downloading my scores (and why) - please excuse the imposition!`
       disclaimer.style.fontStyle = "italic"
       disclaimer.style.color = "BDA09B"
       disclaimer.style.paddingTop = "12px"

       var RID = document.createElement("textarea");
       RID.setAttribute("type", "text");
       RID.setAttribute("class", "field-element")
       RID.setAttribute("name", "reason");
       RID.setAttribute("id", "reason");
       RID.setAttribute("rows", "3")
       RID.setAttribute("cols", "64")
       //RID.setAttribute("height", "2")
       RID.setAttribute("required", "false")
       var RLID = document.createElement("label");
       RLID.setAttribute("for", "reason")
       RLID.innerHTML = "If you'd like, you can let me know why you're interested in downloading this score: "
  
       // create a submit button and a close button.
       // submit calls function to retrieveScore, close calls closeScore
       var s = document.createElement("input");
       s.setAttribute("type", "button");
       s.setAttribute("class", "go")
       s.setAttribute("value", "Download Score");
       s.addEventListener('click', function() {;
       retrieveScore(el, calledScore, s); })
      
       var c = document.createElement("input");
       c.setAttribute("type", "button");
       c.setAttribute("class", "go")
       c.setAttribute("value", "Close");
       c.addEventListener('click', function() {;
       closeScore(); })


       // Append the emailID and reason to the form
       form.appendChild(c); //close button
       form.appendChild(br.cloneNode()); 
       
       form.appendChild(LID);
       form.appendChild(EID); 

       form.appendChild(br.cloneNode()); 

       form.appendChild(disclaimer)
       
       form.appendChild(RLID);

       form.appendChild(br.cloneNode()); 
       
       form.appendChild(RID);

       form.appendChild(br.cloneNode()); 


       // Append the submit and close buttons to the form
       form.appendChild(s); 
        
              

  //adds form (all of above elements) after the called scoreDownload element
  el.after(form)
  
}

// returns a score from database, creates a download link, adds the form details into other database, sends email to admin, removes form
function retrieveScore(el, calledScore, s){
  
  const email =  document.getElementById("emailID").value
  const reason = document.getElementById("reason").value
  if (validateEmail(email) != true) {alert("Please enter a valid email address!"); return}
  document.getElementById("scoreformname").remove()
  let newStr = calledScore.id.replace('index', '') // unique ID of desired score
  console.log(newStr)

  const docRef = doc(db, 'works', `${newStr}`)
  //get document data
  getDoc(docRef)     
    .then((doc) => {
      el.clearHTML
      const b = document.createElement("br")
      const alink = document.createElement('a')
      alink.title = "downloads score in new tab"
      alink.textContent = "[download link]"
      alink.target = "blank"
      alink.href = doc.data().scoreLink
      var requestedWork = doc.data().work
      const requestedWork_ID = `score${requestedWork}`
      alink.id = requestedWork_ID
      alink.addEventListener('click', function() {
        alink.remove;})
      calledScore.append(b)
      console.log(alink)
      calledScore.after(alink)
      const colRef = collection(db, 'score_downloads')
      const date = new Date();


      addDoc(colRef, {
        to: "sebastianadamsforward+firestore@gmail.com",
        message: {
          subject: `Document added by ${email}`,
          html: `${email} has downloaded ${requestedWork}
          the reason they gave was: 
          ${reason}`,
        },
        person: email,
        work: requestedWork,
        reason: reason,
        JStimestamp: date,
        date: "Date: "+ date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString(),
      })
    }
    
    
  
    )
  

}

function closeScore(){
  document.getElementById("scoreformname").remove()

}

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    

// function scrollToTop(){
//   console.log("scrollllll")
//   $(document).ready(function () {
//     $(window).scroll(function () {
//         if ($(this).scrollTop() > 100) {
//             $('.scrollup').fadeIn();
//         } else {
//             $('.scrollup').fadeOut();
//         }
//     });
//     $('.scrollup').click(function () {
//         $("html, body").animate({
//             scrollTop: 0
//         }, 600);
//         return false;
//     });
// });
// }

// this bit is a disaster

// function loadScript(){
//   let myScript = document.createElement("script");
//   myScript.setAttribute("src", "src/gen_chorale.js");
//   document.body.appendChild(myScript);
     
// }

// myScript.addEventListener("load", scriptLoaded, false);

// function scriptLoaded() {
//   //add an event listener (because audio can't autoplay!)   
//   const createButton = document.querySelector('.create-audio');
//   createButton.addEventListener('click', function(){ audioGen()
  
// })
// }


  /* const colRef = query(collection(db, 'works'), where("category", "array-contains", `${selectedCategory}`),orderBy(("index"), "desc"))
  //get collection data
  getDocs(colRef)     
    .then((snapshot) => {
        let worksArray = []
        snapshot.docs.forEach((doc) => {
          worksArray.push({ ...doc.data(), id: doc.id })
          
  
        }) */




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function clicked() {
  console.log("clicked") //for debugging purposes only
}

function toConsole() {
  console.log("eventran");
  }


function getKeyByValue(object, value) {
    return Object.keys(object).filter(key => object[key] === value);
  }

function getKeyByNegativeValue(object, value) {
    return Object.keys(object).filter(key => object[key] !== value);
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

