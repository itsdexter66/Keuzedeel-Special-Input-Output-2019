export function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "module";

    if(script.readyState) {  // only required for IE <9
        script.onreadystatechange = function() {
            if ( script.readyState === "loaded" || script.readyState === "complete" ) {
                script.onreadystatechange = null;
                if(callback != undefined) callback();
            }
        };
    } else {
        script.onload = () => {
            if(callback != undefined) callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

export function loadGame(callback) {
    switch(window.location.pathname) {
        case "/Project/src/snake.html":
            loadScript("snake.js", callback);
            break;
        case "/Project/src/tetris.html":
            loadScript("tetris.js", callback);
            break;
        default:
            console.log("Nothing to load");
            break;
    }
}