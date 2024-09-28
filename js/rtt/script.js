document.getElementById("player").volume = "1.0"

var webradio = {
    player: function () {
        return document.getElementById("player");
    },
    play_station: function (url){
        document.getElementById("player").src = url;
        document.url = url
    },
    get_value: function (key) {
        if (window.localStorage[key] != undefined) {
            return window.localStorage[key];
        }
    },
    set_value: function (key, value) {
        window.localStorage[key] = value;
    }
};

