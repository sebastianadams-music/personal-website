// below code is stolen and I don't understand itbut it doesn't work if i delete it
webradio.player().volume = 1

webradio.player().addEventListener("volumechange", function (){
    webradio.set_value("playervolume", webradio.player().volume);
}, false);
webradio.player().volume = webradio.get_value("playervolume");



randomStation()