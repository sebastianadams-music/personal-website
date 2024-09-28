import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
        import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"

        // import { getFirestore, collection, getDocs, orderBy, query, where, addDoc, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"


        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyDuuKkn3m-dLDlLBp40j_Qt8jedxHFj84Y",
          authDomain: "activate-freesound.firebaseapp.com",
          projectId: "activate-freesound",
          storageBucket: "activate-freesound.appspot.com",
          messagingSenderId: "824081283497",
          appId: "1:824081283497:web:1eeaf943fb2b6354af6cb8"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore()
        console.log("want to happen first")
        checkFireBase(getDoc)
        createListener()
        document.getElementById('stopButton').addEventListener('click', () => {
        document.querySelectorAll('audio').forEach(el => el.pause());
        });


        function checkFireBase(getDoc){
        // do whatever you like here
        console.log("checking...")

        getDoc(doc(db, "activation", "activate")).then(docSnap => {
            if (docSnap.exists()) {
                const activeStatus = docSnap.data()["activated"]
                console.log("Document data:", activeStatus);
                window.localStorage.setItem('activeStatus', activeStatus);
            } else {
                console.log("No such document!");
            }
            })
        // kill all on false //
        if (window.localStorage.getItem('activeStatus') == "false"){
            var audioList = document.getElementsByTagName('audio');
            console.log("audios: ", audioList.length)
            for (let i = 0; i < audioList.length; i++)
            {killAudio()}
            document.getElementById("activationDiv").textContent = "All audio has been expunged. This webpage is now switched off. Please enjoy the concert! The website will work again later, don't worry"

        }
        else {
            if (document.getElementById("activationDiv").textContent = "All audio has been expunged. This webpage is now switched off. Please enjoy the concert! The website will work again later, don't worry")
            {document.getElementById("activationDiv").textContent =  ""} 

        }


        // const docRef = doc(db, "activation", "activate");
        // const docSnap = getDoc(docRef).then)
        // console.log(docSnap.data())

        setTimeout(checkFireBase.bind(null, getDoc), 5000);
}
