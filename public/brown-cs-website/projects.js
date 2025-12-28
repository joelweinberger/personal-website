imageNames = new Array ()

imageNames[0] = new String ()
imageNames[0] = "mirror balls"

imageNames[1] = new String ()
imageNames[1] = "cheese balls"

imageNames[2] = new String ()
imageNames[2] = "objects"

imageNames[3] = new String ()
imageNames[3] = "shadow"

imageNames[4] = new String ()
imageNames[4] = "chess"

imageNames[5] = new String ()
imageNames[5] = "kern1"

imageNames[6] = new String ()
imageNames[6] = "kern2"

imageNames[7] = new String ()
imageNames[7] = "kern3"

imageNames[8] = new String ()
imageNames[8] = "kern4"

if (document.images) {
    previewImages = new Array ();

    for (i in imageNames) {
        previewImages[i] = new Image(400, 400);
        previewImages[i].src = "images/small_" + imageNames[i] + ".jpg";
        previewImages[i].title = imageNames[i];
    }
}

function changePic (picNum, imgId) {
    currentPreview.className = "not-selected-image"
    currentPreview = document.getElementById ("img" + picNum)
    currentPreview.className = "selected-image"

    var image = document.getElementById (imgId)
    image.src = "images/" + imageNames[picNum] + ".jpg"
    image.title =  imageNames[picNum]
    image.alt = imageNames[picNum]
}


function getPosX (obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent
        }
    }
    else if (obj.x) {
        curleft += obj.x
    }

    return curleft;
}


function getPosY (obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent
        }
    }
    else if (obj.y) {
        curtop += obj.y
    }

    return curtop;
}

function morphPic (picNum, event) {
    var x = event.clientX
    var y = event.clientY
    var box = document.getElementById ("text-box")
    var image = document.getElementById ("img" + picNum).offsetLeft

    //box.value = getPosX (image)

    lastX = x
    lastY = y
}

var imgs = document.getElementsByTagName('img');
for (var i = 0; i < imgs.length; i++) {
    if (imgs[i].id != 'mainImg') {
        (function(i) {
            imgs[i].onclick = function () {
                changePic(i, 'mainImg');
            };
            imgs[i].onmousemove = function(event) {
                morphPic(i, event);
            };
        })(i);
    }
}

currentPreview = document.getElementById ("img0");
currentPreview.className = "selected-image";
