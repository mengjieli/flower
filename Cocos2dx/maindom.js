/*var body = document.body;
 var mainDiv = document.getElementById("Main");
 console.log(mainDiv);
 var image = document.createElement("img");
 mainDiv.appendChild(image);
 image.setAttribute("src", "res/bg.jpg");
 image.setAttribute("width", "100");
 image.setAttribute("height", "100");
 image.style.position = "absolute";
 image.style.left = "100px";
 image.style.top = "50px";

 var image2 = document.createElement("img");
 mainDiv.appendChild(image2);
 image2.setAttribute("src", "res/closeDown.png");
 image2.style.position = "absolute";
 image2.style.left = "100px";
 image2.style.top = "50px";

 mainDiv.style.position = "absolute";
 mainDiv.style.left = "100px";


 var txt = document.createElement("em");
 txt.innerHTML = "aaaaaabbsbssbbs";
 mainDiv.appendChild(txt);
 txt.style.position = "absolute";
 txt.style.left = "100px";
 txt.style.top = "50px";
 txt.style["font-style"] = "normal";


 function disableSelection(element) {
 if (typeof element.onselectstart != 'undefined') {
 element.onselectstart = function() { return false; };
 } else if (typeof element.style.MozUserSelect != 'undefined') {
 element.style.MozUserSelect = 'none';
 } else {
 element.onmousedown = function() { return false; };
 }
 }

 var input = document.createElement("input");
 mainDiv.appendChild(input);


 disableSelection(mainDiv);*/

var body = document.body;
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "src/require.js";
script.onload = function () {
    var scripts = [];
    jsFiles = [
        "src/FlowerDom.js",
        "src/Black.js",
        "src/Binding.js",
        "src/Remote.js"
    ].concat(jsFiles);
    var i = 0;
    var addScript = function() {
        script = document.createElement("script");
        script.loadFlag = false;
        script.type = "text/javascript";
        script.src = jsFiles[i];
        script.onload = function () {
            script.loadFlag = true;
            i++;
            if(i < jsFiles.length) {
                addScript();
            } else {
                new Main();
            }
        }.bind(script);
        scripts.push(script);
        body.appendChild(script);
    }
    addScript();
}
body.appendChild(script);


//console.log(jsFiles);

//var script = document.createElement("script");
//script.src = "src/FlowerDom.js";
//document.