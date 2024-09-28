
                    
                    
                    console.log("want to happen second")
            var index = 0
            var soundList = []
            var descList = []
            var attributionList = []
    
    
            // FreeSound
            freesound.setToken("hLLHZHTBJqgj8AYPUC8QcnkTgaSGichlISxMvsR0"); //my client key
            
            console.log(freesound)

            createListener()
    
            
    
            // window.onload = function(){ main()
    
                
            
                
                
            // };
    
            
            
    
            function createListener() {
                
                            //add an event listener (because audio can't autoplay!)   
                const createButton = document.querySelector('.create-stack');
                createButton.addEventListener('click', function(){
                            
                            
                            
                        
                            index += 1 // keeps tracks of number of sounds created (note: does not currently track sounds that finished playing)
                            
                            
                            var fields = 'id,name,url,analysis,username';
                            // Example 1
                            // Example of geeting the info of a sound, queying for similar sounds (content-based) and showing some analysis
                            // features. Both similar sounds and analysis features are obtained with additional requests to the api.
                            activated = "true"
                            console.log("activated", activated)
                            if (activated == "true") {
                            document.getElementById("errorDiv").textContent = ""
                            freesound.getSound(getRandomInt(1, 100000),
                                    function(sound){
                                        
                                        console.log(sound)
                                        
    
                                        var msg = "";
                                        document.getElementById("descriptionOfSound").textContent = "" 
                                        console.log("sound", sound)
                                        name = sound.name
                                        user = sound.username
                                        userSays = user + " says: "
                                        desc = sound.description
                                        attribution = name + " by " + user
                                        console.log(attribution)                                      
                                        snd = new Audio(sound.previews['preview-hq-mp3']);
                                        document.body.appendChild(snd)
                                        soundList.push(snd);
                                        attributionList.push(attribution)
                                        // descList.push(desc);
                                        console.log(soundList)
                                        document.getElementById("userSays").textContent = userSays
                                        document.getElementById("printSounds").textContent = attributionList.join(' // ')
                                        
                                        document.getElementById("descriptionOfSound").textContent = desc 
                                        snd.loop = true
                                        snd.play();
                                        return soundList, index
                                        
                                    //    displayMessage(msg,'resp1');                    
                                    }, errorMsg );
    
                                }
                            //return index
                           
                            
            
                        })
                
                document.getElementById("killAudio").addEventListener("click", killAudio);
                document.getElementById("stopButton").addEventListener("click", killAllAudio);
                
            }
            
           
    
            
            function killAudio() {
                
                index = soundList.length - 1
                    console.log("index: ", index)
                    soundList[index].pause()
                    soundList.pop()
                    attributionList.pop()
                    document.getElementById("printSounds").textContent = attributionList.join(' // ')
                    document.getElementById("userSays").textContent = ""
                    document.getElementById("descriptionOfSound").textContent = ""
    
                    return soundList, index
            }
    
            // function killAllListener() {
            //     const killButton = document.querySelector('.stopButton');
    
            // }
    
            function killAllAudio() {
                var audioList = document.getElementsByTagName('audio');
                console.log("audios: ", audioList.length)
                for (let i = 0; i < audioList.length; i++)
                {killAudio()}
            }
    
    
    
    
    
            function errorMsg() {
            document.getElementById("descriptionOfSound").textContent = "" 
            document.getElementById("errorDiv").textContent = "The sound you're looking for has been removed from the internet. Try again, please."
                console.log("The sound you're looking for has been removed from the internet. Try again, please.")
            }
    
            function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            
            //    function displayError(text){
              //      document.getElementById('error').innerHTML=text;
              //  }
            
                function displayMessage(text,place){
                    document.getElementById(place).innerHTML=text;
                }
            
