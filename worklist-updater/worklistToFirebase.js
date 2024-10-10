/* 
When adding new fields to the database, you must make changes in the following places:
1. at the start of the save2FB function
sdsd 
2. in the snapshot section later in save2FB
3. in the addDoc function further down
4. In the HTML file index.html (duplicating a form field in the top part of the document)
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, collection, query, where, doc, setDoc, orderBy, addDoc, onSnapshot, Timestamp} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

window.save2FB = save2FB; // brings this function into the global scope (necessary to use elements of module in other scripts)
window.populateSelect = populateSelect;
window.grabFromFireBase = grabDocumentFromFireBase;
document.getElementById("existingScores").addEventListener('change', function() { grabDocumentFromFireBase()})

let titleList = []
let maxCatNum = 0
let maxIndNum = 0
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCow7QEwQRTPcjXunO2hQvdlRmUBJiqcnU",
  authDomain: "fir-9-dojo-6212c.firebaseapp.com",
  projectId: "fir-9-dojo-6212c",
  storageBucket: "fir-9-dojo-6212c.appspot.com",
  messagingSenderId: "879791884368",
  appId: "1:879791884368:web:645ac75a4f19c50afea955"
};


// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  const provider = new GoogleAuthProvider();

  const googleSignIn = async () => {
        signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        document.getElementById("signin").textContent = `signed in as ${user}`
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  document.getElementById("signin").addEventListener("click", googleSignIn)





const db = getFirestore()



// POPULATE SELECT ////////

populateSelect() // auto-fills select menu

function populateSelect(){ 
   const p = collection(db, "works", );
    const q = query(p, orderBy("index", "desc"));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const comments = [];

  var x = document.getElementById("existingScores");
  while (x.options.length) x.remove(0);
  
  querySnapshot.forEach((docu) => {
    populateFromFirebase(docu.data().work, docu.data().index)
    titleList.push(docu.data().work)
    let cataloguetest = docu.data().catalogueNo
    document.getElementById("highestcat").textContent = maxCatNumber(cataloguetest)
    let indextest = docu.data().index
    document.getElementById("highestindex").textContent = maxIndexNumber(indextest)
    // addRow(docu.data()) // stops the table from filling (causes memory leak)
  });
});

}

function populateFromFirebase(title, index) {
  var x = document.getElementById("existingScores");
    var option = document.createElement("option");
    option.text = title + " " + index;
    option.value = title;
    x.appendChild(option);
}

// END OF POPULATE SELECT ////////

function save2FB() {

/* / / / / / / / / / /
1) Add field here
 */
  var work = document.getElementById("work").value
  var index = Number(document.getElementById("index").value)  
  var instrumentation = document.getElementById("instrumentation").value
  var dur = document.getElementById("dur").value
  var commissioned = document.getElementById("commissioned").value
  // CHANGE CATEGORY TO WORK PROPERLY
  var category = getActiveCategories()
  var withdrawn = document.getElementById("withdrawn").value
  var rev = document.getElementById("rev").value
  var yearOfComposition = document.getElementById("yearOfComposition").value
  var programmeNote = document.getElementById("programmeNote").value
  var embed = document.getElementById("embed").value
  var scoreAvail = document.getElementById("scoreAvail").value
  var scoreLink = document.getElementById("scoreLink").value
  var parts = document.getElementById("parts").value
  var gitHub = document.getElementById("gitHub").value
  var softwareLink = document.getElementById("softwareLink").value
  var downloadMedia = document.getElementById("downloadMedia").value
  var scoreText = document.getElementById("scoreText").value
  var webPage = document.getElementById("webPage").value
  var additionalInfo = document.getElementById("additionalInfo").value
  var moreInfo = document.getElementById("moreInfo").value
  var loadScripts = document.getElementById("loadScripts").value
  var webSnippet = document.getElementById("webSnippet").value
  console.log("websnip", webSnippet)
    // NOT USED ON WEBSITE CURRENTLY [I THINK]:
  var catalogueNo = document.getElementById("catalogueNo").value
  var datesOfComposition = document.getElementById("datesOfComposition").value
  var datesOfCompositionExact = document.getElementById("datesOfCompositionExact").value
  var mvts = document.getElementById("mvts").value
  var recordingLinkWeb = document.getElementById("recordingLinkWeb").value
  var prizes = document.getElementById("prizes").value
  var recordingLink = document.getElementById("recordingLink").value
  var equipment = document.getElementById("equipment").value
  var spotifyStatus = document.getElementById("spotifyStatus").value
  var spotifyID = document.getElementById("spotifyID").value
  var youTubeID = document.getElementById("youTubeID").value
  var soundcloudID = document.getElementById("soundcloudID").value
  var image = document.getElementById("image").value
  var notesOnCompositionDates = document.getElementById("notesOnCompositionDates").value
  var dedication = document.getElementById("dedication").value
  var performed = document.getElementById("performed").value
  var chamber_players = document.getElementById("chamber_players").value


  console.log("before", work)

if (titleList.includes(work))
{

  // this seems like an awful way to get the doc but I can only figure out how to set it using the UID. So I filter for the work and then collect the ID.

  const docsRef = collection(db, "works");

  const q = query(docsRef, where("work", "==", work));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    
    querySnapshot.forEach((docu) => {
      let idOfWork = docu.id
      console.log(idOfWork)
      let docRef = doc(db, "works", idOfWork);
      let data = {
/*  / / / / / / / / / / / / / / / /
        2) Add field here
         */
        work: work,
        id: index,
        index: index,
        instrumentation: instrumentation,
        dur: dur,
        commissioned: commissioned,
        category: category,
        withdrawn: withdrawn,
        rev: rev,
        yearOfComposition: yearOfComposition,
        programmeNote: programmeNote,
        embed: embed,
        scoreAvail: scoreAvail,
        scoreLink: scoreLink,
        scoreText: scoreText,
        parts: parts,
        softwareLink: softwareLink,
        downloadMedia: downloadMedia,
        gitHub: gitHub,
        loadScripts: loadScripts,
        webSnippet: webSnippet,
        webPage: webPage,
        additionalInfo: additionalInfo,
        moreInfo: moreInfo,
        catalogueNo: catalogueNo,
        datesOfComposition: datesOfComposition,
        datesOfCompositionExact: datesOfCompositionExact,
        mvts: mvts,
        recordingLinkWeb: recordingLinkWeb,
        prizes: prizes,
        recordingLink: recordingLink,
        equipment: equipment,
        spotifyStatus: spotifyStatus,
        spotifyID: spotifyID,
        soundcloudID: soundcloudID,
        youTubeID: youTubeID,
        image: image,
        notesOnCompositionDates: notesOnCompositionDates,
        dedication: dedication,
        performed: performed,
        chamber_players: chamber_players
      }
      console.log("data", data)
      setDoc(docRef, data, { merge: true })

      .then(docRef => {
        console.log("Entire Document has been updated successfully");
    })
    .catch(error => {
        console.log(error);
    })

      
     })
    })


    // populateSelect()

  return
}



 console.log("after", work)



const colRef = collection(db, "works")
  addDoc(colRef, {
/* / / / / / / / / / / 
    3) Add field here
 */
    work: work,
    id: index,
    index: index,
    instrumentation: instrumentation,
    dur: dur,
    commissioned: commissioned,
    category: category,
    withdrawn: withdrawn,
    rev: rev,
    yearOfComposition: yearOfComposition,
    programmeNote: programmeNote,
    embed: embed,
    scoreAvail: scoreAvail,
    scoreLink: scoreLink,
    scoreText: scoreText,
    parts: parts,
    softwareLink: softwareLink,
    downloadMedia: downloadMedia,
    gitHub: gitHub,
    webPage: webPage,
    additionalInfo: additionalInfo,
    moreInfo: moreInfo,
    loadScripts: loadScripts,
    webSnippet: webSnippet,
    catalogueNo: catalogueNo,
    datesOfComposition: datesOfComposition,
    datesOfCompositionExact: datesOfCompositionExact,
    mvts: mvts,
    recordingLinkWeb: recordingLinkWeb,
    prizes: prizes,
    recordingLink: recordingLink,
    equipment: equipment,
    spotifyStatus: spotifyStatus,
    spotifyID: spotifyID,
    youTubeID: youTubeID,
    soundcloudID: soundcloudID,
    image: image,
    notesOnCompositionDates: notesOnCompositionDates,
    dedication: dedication,
    performed: performed,
    chamber_players: chamber_players
    },)
    
    populateSelect()




}

function grabDocumentFromFireBase() 
{
  console.log("working")
  const value = document.getElementById("existingScores").value
  // console.log(value)
  
  const docsRef = collection(db, "works");

  const q = query(docsRef, where("work", "==", value));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const comments = [];
    
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      let dataz = doc.data()
      let txt = "";
      clearCheckBoxes("category")
      Object.keys(dataz).forEach(key => {
       // console.log("key", key) // returns the keys in an object
        // console.log(dataz[key])  // returns the appropriate value 
        if (key === "category"){
          console.log("KEY", dataz[key])

          /////////// reset all the category boxes to zero first!
          for (var i = 0; i < dataz[key].length; i++)
            {
            
            if (document.getElementById(dataz[key][i])){
              console.log("EL:", dataz[key][i])
              document.getElementById(dataz[key][i]).checked = true
            }
          }
        } 
        else if (document.getElementById(key))
        { 
          // console.log(dataz[key])
          document.getElementById(key).value = dataz[key]
        }
     })

    // for (let x in dataz) {
    //   console.log(dataz[x].key())
    // let dataString = dataz[x].name
    // if (document.getElementById(dataString))
    // {document.getElementById(dataString).value = dataString
    // }
    //  };

// document.getElementById("whole-entry").textContent = txt;
getActiveCategories()


      // document.getElementById("thoughts").value = doc.data().thoughts
      // document.getElementById("algorithm").value = doc.data().algorithm
      // document.getElementById("piece-title").value = doc.data().title
      // pieceNamePopulate()
      // main() 
    });
  })
}
// 4) add extra cell and then field

function addRow(data) {
  var tableRow = document.getElementById("table");
  var row = tableRow.insertRow(-1);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);
  var cell6 = row.insertCell(6);
  var cell7 = row.insertCell(7);
  var cell8 = row.insertCell(8);
  var cell9 = row.insertCell(9);
  var cell10 = row.insertCell(10);
  var cell11 = row.insertCell(11);
  var cell12 = row.insertCell(12);
  var cell13 = row.insertCell(13);
  var cell14 = row.insertCell(14);
  var cell15 = row.insertCell(15);
  var cell16 = row.insertCell(16);
  var cell17 = row.insertCell(17);
  var cell18 = row.insertCell(18);
  var cell19 = row.insertCell(19);
  var cell20 = row.insertCell(20);
  var cell21 = row.insertCell(21);
  var cell22 = row.insertCell(22);
  var cell23 = row.insertCell(23);
  var cell24 = row.insertCell(24);
  var cell25 = row.insertCell(25);
  var cell26 = row.insertCell(26);
  var cell27 = row.insertCell(27);
  var cell28 = row.insertCell(28);
  var cell29 = row.insertCell(29);  
  var cell30 = row.insertCell(30);
  var cell31 = row.insertCell(31);
  var cell32 = row.insertCell(32);
  var cell33 = row.insertCell(33);
  var cell34 = row.insertCell(34); 
  var cell35 = row.insertCell(35); 
  cell0.innerHTML = data.work;   // work: work,
  cell1.innerHTML = data.index;   //   index: index,
  cell2.innerHTML = data.catalogueNo;
  let cat_text = ""
  for (let x in data.category) {
    if (data.category[x])
    {cat_text += data.category[x] + " " + String.fromCharCode(13);}
    };
  cell3.innerHTML = cat_text //   category: category,
  cell4.innerHTML = data.id   //   id: id,
  cell5.innerHTML = data.yearOfComposition //   yearOfComposition: yearOfComposition
  cell6.innerHTML = data.datesOfComposition
  cell7.innerHTML = data.datesOfCompositionExact
  cell8.innerHTML = data.rev //   rev: rev,
  cell9.innerHTML = data.instrumentation //   instrumentation: instrumentation,
  cell10.innerHTML = data.dur //   dur: dur,
  cell11.innerHTML = data.mvts
  cell12.innerHTML = data.scoreAvail //   scoreAvail: scoreAvail,
  cell13.innerHTML = data.scoreLink //   scoreLink: scoreLink,
  cell14.innerHTML = data.scoreText //   scoreText: scoreText,
  cell15.innerHTML = data.programmeNote //   programmeNote: programmeNote,
  cell16.innerHTML = data.commissioned //   commissioned: commissioned,
  cell17.innerHTML = data.additionalInfo //   moreInfo: moreInfo
  cell18.innerHTML = data.recordingLinkWeb
  cell19.innerHTML = data.prizes 
  cell20.innerHTML = data.recordingLink
  cell21.innerHTML = data.equipment
  cell22.innerHTML = data.programmeNoteNewTab
  cell23.innerHTML = data.spotifyStatus
  cell24.innerHTML = data.embed //   embed: embed,
  cell25.innerHTML = data.formSubmissions
  cell26.innerHTML = data.scoreFormLinkNewTab
  cell27.innerHTML = data.scoreFormLink
  cell28.innerHTML = data.scoreFormEditor
  cell29.innerHTML = data.notesOnCompositionDates
  cell30.innerHTML = data.webPage //   webPage: webPage,
  cell31.innerHTML = data.dedication
  cell32.innerHTML = data.performed
  cell33.innerHTML = data.withdrawn   //   withdrawn: withdrawn,
  cell34.innerHTML = data.chamber_players
  cell35.innerHTML = data.moreInfo


  // work: work,
  //   id: id,
  //   index: index,
  //   instrumentation: instrumentation,
  //   dur: dur,
  //   commissioned: commissioned,
  //   category: category,
  //   withdrawn: withdrawn,
  //   rev: rev,
  //   yearOfComposition: yearOfComposition
  //   programmeNote: programmeNote,
  //   embed: embed,
  //   scoreAvail: scoreAvail,
  //   scoreLink: scoreLink,
  //   scoreText: scoreText,
  //   webPage: webPage,
  //   moreInfo: moreInfo
  // thoughts = document.getElementById("thoughts").value,
  // algorithm = document.getElementById("algorithm").value
  }


  function clearCheckBoxes(cn){

    var cbarray = document.getElementsByClassName(cn);
    for(var i = 0; i < cbarray.length; i++){

        
            cbarray[i].checked = false;
        
}   
  }

//   function queryCheckBoxes(cn){

//     var cbarray = document.getElementsByClassName(cn);
//     let arr = []
//     for(var i = 0; i < cbarray.length; i++){

        
//             if (cbarray[i].checked = true):
//               {arr.push(cbarray[i].value)}
        
// }   
// console.log("values of check boxes: ", arr)
//   }

    function getActiveCategories() {
      let catArray = []
      var cbarray = document.getElementsByClassName("category")
      for(var i = 0; i < cbarray.length; i++){
        if ( cbarray[i].checked) {
          catArray.push(cbarray[i].value)
        }

    
}   
console.log("CATEGORIES:")
    console.log(catArray)
return catArray
  }


  function maxCatNumber(inputNum){
  
    if (Number(inputNum) > maxCatNum) {
      maxCatNum = Number(inputNum)
      
    }
    return maxCatNum
    
  }

  function maxIndexNumber(inputNum){
  
    if (Number(inputNum) > maxIndNum) {
      maxIndNum = Number(inputNum)
      
    }
    return maxIndNum
    
  }