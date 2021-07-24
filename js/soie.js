// TODO
// иконки мыши, рефакторинг, относительный размер рамки выделения изображения, взаимодействие со слоями  и вне холста (перетаскивание изображения за видимую область, непрерывное рисование и т.п.), убрать черную линию по-середине на фоне создания проекта
// артефакты на новом слое (или виртуальном?) при дублированиии слоя изображения

let workspaceWidth = 0;
let workspaceHeight = 0;

//var borderOffset = 2;
let canvasOffsetX = 0;
let canvasOffsetY = 0;

let workspaceScale = 1;
let catchX = 0;
let catchY = 0;
let box = document.getElementById('canvasBox');
let workspaceDiffX = 0;
let workspaceDiffY = 0;

let importImage = new Image();

// Get the modal
var openingMod = document.getElementById('openingModal');
var newProjMod = document.getElementById('newProjModal');

window.onload = function() {
    openingMod.style.display = "block";
};

// Opening modal
document.getElementById('createProjBtn').onclick = function(e) {
    openingMod.style.display = "none";
    newProjMod.style.display = "block";

    document.getElementById('workspaceW').value = '';
    document.getElementById('workspaceH').value = '';
};
document.getElementById('openProjBtn').onclick = function(e) {
    openingMod.style.display = "none";
    //TODO
};

// New project modal
document.getElementById('returnToOpBtn').onclick = function(e) {
    openingMod.style.display = 'block';
    newProjMod.style.display = 'none';
};
document.getElementById('acceptProjBtn').onclick = function(e) {
    let w = parseInt(document.getElementById('workspaceW').value);
    let h = parseInt(document.getElementById('workspaceH').value);
    if(w != NaN && w > 0 && w <= 3841 && h != NaN && h > 0 && h < 2161) {
	workspaceWidth = w;
	workspaceHeight = h;
	setupProject('drawing');
	newProjMod.style.display = 'none';
    }
};

// Create project from image
document.getElementById('createFromImgBtn').onchange = function() {
    importImage.src = URL.createObjectURL(this.files[0]);
    importImage.onload = function() {
	if(importImage.width > 0 && importImage.width <= 3841 && importImage.height > 0 && importImage.height < 2161) {
	    setupProject('image');
	    importImage.onload = null;
	    newProjMod.style.display = 'none';
	}
    };
};

// Adjusting workspace aspect ratio
document.getElementById('workspaceAR').onchange = adjustRatio;
document.getElementById('workspaceW').oninput = adjustRatio;
document.getElementById('workspaceH').oninput = adjustRatio;
function adjustRatio() {
    let ratioMode = document.getElementById('workspaceAR').value;
    if(ratioMode != 'custom') {
	let war = parseInt(ratioMode.match(/\d+(?=:)/)[0]);
	let har = parseInt(ratioMode.match(/(?<=:)\d+/)[0]);
	let activeInputId = document.activeElement.id;
	if(document.getElementById('workspaceW').value != '' && (activeInputId == 'workspaceAR' || activeInputId == 'workspaceW')) {
	    document.getElementById('workspaceH').value = Math.trunc(parseInt(document.getElementById('workspaceW').value) * (har/war));
	}
	else if(document.getElementById('workspaceH').value != '' && activeInputId == 'workspaceH') {
	    document.getElementById('workspaceW').value = Math.trunc(parseInt(document.getElementById('workspaceH').value) * (war/har));
	}
    }
    let w = parseInt(document.getElementById('workspaceW').value);
    let h = parseInt(document.getElementById('workspaceH').value);
    if(w != NaN && w > 0 && w <= 3841 && h != NaN && h > 0 && h < 2161) {
	document.getElementById('acceptProjBtn').disabled = false;
	document.getElementById('acceptProjBtn').parentNode.classList.remove('disabled');
    }
    else {
	document.getElementById('acceptProjBtn').disabled = true;
	document.getElementById('acceptProjBtn').parentNode.classList.add('disabled');
    }
}


// Initializing basic project
function setupProject(firstLayerType) {
    if(firstLayerType == 'image') {
	workspaceWidth = importImage.width;
	workspaceHeight = importImage.height;
    }

    let back = document.getElementById('back');
    back.style.width = (window.innerWidth).toString() + 'px';
    back.style.height = (window.innerHeight).toString() + 'px';
    if(0.362 * window.innerWidth + workspaceWidth > window.innerWidth) {
    	back.style.width = (0.362 * window.innerWidth + workspaceWidth).toString() + 'px';
    }
    if(0.05 * window.innerHeight + workspaceHeight > window.innerHeight) {
	back.style.height = (0.05 * window.innerHeight + workspaceHeight).toString() + 'px';
    }
    
    let cvsBack = document.getElementById('canvasBack');
    cvsBack.style.width = workspaceWidth.toString() + 'px';
    cvsBack.style.height = workspaceHeight.toString() + 'px';
    cvsBack.style.border = 'solid 1px black';

    canvasOffsetX = 0.18 * window.innerWidth;
    canvasOffsetY = 0.03 * window.innerHeight - 5;
    
    addLayer('virtual');
    layers[0].cvs.classList.remove('canvas');
    layers[0].cvs.classList.add('canvas-main');
    layers[0].listElem.classList.add('hidden');


    //canvasOffsetX = layers[0].cvs.clientLeft;
    //canvasOffsetY = layers[0].cvs.clientTop;

    
    //document.getElementById('canvasBox').onmouseover = setCanvasCursor;
    //document.getElementById('canvasBox').onmouseout = unsetCanvasCursor;

    //document.getElementById('canvasBox').onwheel = zoomWorkspace;
    layers[0].cvs.onmouseover = setCanvasCursor;
    layers[0].cvs.onmouseout = unsetCanvasCursor;

    layers[0].cvs.onwheel = zoomWorkspace;
    box.onmousedown = catchWorkspace;

    
    if(firstLayerType == 'image') {
	addLayer('image');
    }
    else if(firstLayerType == 'drawing') {
	addLayer('drawing');
    }

    layers[0].ctx.lineWidth = brushSize.value;
    layers[1].ctx.lineWidth = brushSize.value;


    workspaceScale = Math.min(window.innerWidth / workspaceWidth,
			      window.innerHeight / workspaceHeight);
    zoomWorkspace({deltaY: 0});
    
    //setDrawColor('#000000');
    setDrawColor(cp.value);
    
    document.getElementById('brsVal').innerHTML = 'Size in pixels: ' + brushSize.value;
    document.getElementById('brtVal').innerHTML = 'Transparecy: ' + brushTransp.value;
    document.getElementById('brhVal').innerHTML = 'Shadowness: ' + Math.trunc(brushShad.value / 30.0 * 100.0) + '%';
    
    document.getElementById('hueVal').innerHTML = 'Hue: ' +
	(hue.value >= 0 ? '+' + hue.value : hue.value)  + '°';
    document.getElementById('satVal').innerHTML = 'Saturation: ' +
	(saturation.value >= 0 ? '+' + saturation.value : saturation.value) + '%';
    document.getElementById('lightVal').innerHTML = 'Lightness: ' +
	(lightness.value >= 0 ? '+' + lightness.value : lightness.value)  + '%';

    document.getElementById('contrVal').innerHTML = 'Contrast: ' + contrast.value;
    document.getElementById('expVal').innerHTML = 'Exposure: ' + (parseInt(exposure.value, 10) / 10.0).toString();
    document.getElementById('rLvlVal').innerHTML = 'Red level: ' + (parseInt(redLevel.value, 10)).toString();
    document.getElementById('gLvlVal').innerHTML = 'Green level: ' + (parseInt(greenLevel.value, 10)).toString();
    document.getElementById('bLvlVal').innerHTML = 'Blue level: ' + (parseInt(blueLevel.value, 10)).toString();
    document.getElementById('opVal').innerHTML = 'Opacity: ' + (parseInt(opacity.value, 10)).toString() + '%';
}

// Scaling workspace
function zoomWorkspace(e) {
    workspaceScale += e.deltaY * -0.01;
    let sizeWidth = parseInt(Math.min(Math.max(workspaceWidth / 5.0, workspaceWidth * workspaceScale), workspaceWidth * 5), 10);
    let sizeHeight = parseInt(Math.min(Math.max(workspaceHeight / 5.0, workspaceHeight * workspaceScale), workspaceHeight * 5), 10);
    workspaceScale = Math.min(Math.max(0.2, workspaceScale), 5);
    for(let i = 0; i < layers.length; i++) {
	layers[i].cvs.style.width = (sizeWidth).toString() + 'px';
	layers[i].cvs.style.height = (sizeHeight).toString() + 'px';
    }
    let cvsBack = document.getElementById('canvasBack');
    cvsBack.style.width = (sizeWidth).toString() + 'px';
    cvsBack.style.height = (sizeHeight).toString() + 'px';

    document.getElementById('wpScale').innerHTML = parseInt(workspaceScale*100).toString() + '%';
}

// Moving workspace
function catchWorkspace(e) {
    //console.log('moving workspace');
    let bounds = layers[0].cvs.getBoundingClientRect();
    if(!(e.clientX > bounds.x && e.clientX < bounds.x + bounds.width
	 && e.clientY > bounds.y && e.clientY < bounds.y + bounds.height)) {
	catchX = e.clientX;
	catchY = e.clientY;
	console.log('moving workspace');
	box.onmousemove = moveWorkspace;
	box.onmouseup = releaseWorkspace;
    }
}

function moveWorkspace(e) {
    let diffX = e.clientX - catchX;
    let diffY = e.clientY - catchY;
    for(let i = 0; i < layers.length; i++) {
	layers[i].cvs.style.transform = 'translateY(-50%) translateX(-50%) translateX(' + (workspaceDiffX + diffX).toString() + 'px) translateY(' + (workspaceDiffY + diffY).toString() + 'px)';
    }
    document.getElementById('canvasBack').style.transform = 'translateY(-50%) translateX(-50%) translateX(' + (workspaceDiffX + diffX).toString() + 'px) translateY(' + (workspaceDiffY + diffY).toString() + 'px)';

    document.getElementById('wpPos').innerHTML = (workspaceDiffX + diffX).toString() + ':' + (workspaceDiffY + diffY).toString();
}

function releaseWorkspace(e) {
    workspaceDiffX += e.clientX - catchX;
    workspaceDiffY += e.clientY - catchY;
    box.onmousemove = null;
    box.onmouseup = null;
}

// Reset workspace scale and position
document.getElementById('resetBtn').onclick = resetWorkspace;

function resetWorkspace(e) {
    workspaceDiffX = 0;
    workspaceDiffY = 0;
    workspaceScale = 1;
    let sizeWidth = parseInt(Math.min(Math.max(workspaceWidth / 5.0, workspaceWidth * workspaceScale), workspaceWidth * 5), 10);
    let sizeHeight = parseInt(Math.min(Math.max(workspaceHeight / 5.0, workspaceHeight * workspaceScale), workspaceHeight * 5), 10);
    for(let i = 0; i < layers.length; i++) {
	layers[i].cvs.style.width = (sizeWidth).toString() + 'px';
	layers[i].cvs.style.height = (sizeHeight).toString() + 'px';
	layers[i].cvs.style.transform = 'translateY(-50%) translateX(-50%) translateX(' + (workspaceDiffX).toString() + 'px) translateY(' + (workspaceDiffY).toString() + 'px)';
    }
    let cvsBack = document.getElementById('canvasBack');
    cvsBack.style.width = (sizeWidth).toString() + 'px';
    cvsBack.style.height = (sizeHeight).toString() + 'px';
    cvsBack.style.transform = 'translateY(-50%) translateX(-50%) translateX(' + (workspaceDiffX + diffX).toString() + 'px) translateY(' + (workspaceDiffY + diffY).toString() + 'px)';
    
    document.getElementById('wpScale').innerHTML = parseInt(workspaceScale*100).toString() + '%';
    document.getElementById('wpPos').innerHTML = (workspaceDiffX).toString() + ':' + (workspaceDiffY).toString();
}

// Adjust canvas on browser window resizing
document.defaultView.onresize = function() {
    let back = document.getElementById('back');
    back.style.width = (window.innerWidth).toString() + 'px';
    back.style.height = (window.innerHeight).toString() + 'px';
    if(0.362 * window.innerWidth + workspaceWidth > window.innerWidth) {
	back.style.width = (0.362 * window.innerWidth + workspaceWidth).toString() + 'px';
    }
    if(0.05 * window.innerHeight + workspaceHeight > window.innerHeight) {
	back.style.height = (0.05 * window.innerHeight + workspaceHeight).toString() + 'px';
    }
    
    // let cvsBack = document.getElementById('canvasBack');
    // cvsBack.style.width = workspaceWidth.toString() + 'px';
    // cvsBack.style.height = workspaceHeight.toString() + 'px';

    canvasOffsetX = 0.18 * window.innerWidth;
    canvasOffsetY = 0.03 * window.innerHeight - 5;
};

// Export
var exportMod = document.getElementById('exportModal');
document.getElementById('exportBtn').onclick = function(e) {
    exportMod.style.display = 'block';
};

document.getElementById('returnToProjBtn').onclick = function(e) {
    exportMod.style.display = 'none';
};

document.getElementById('acceptExportBtn').onclick = function(e) {
    let expType = document.getElementById('exportType').value;
    layers[0].ctx.resetTransform();
    layers[0].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
    if(expType == 'jpeg') {
	let imd = layers[0].ctx.getImageData(0, 0, workspaceWidth, workspaceHeight);
	for(let i = 0; i < imd.data.length; i++) {
	    imd.data[i] = 255;
	}
	layers[0].ctx.putImageData(imd, 0, 0);
    }
    for(let i = layers.length-1; i > 0; i--) {
	if(!layers[i].cvs.classList.contains('hidden')) {
	    layers[0].ctx.drawImage(layers[i].cvs, 0, 0);
	}
    }
    let link = document.createElement('a');
    link.download = 'image.' + expType;
    link.href = layers[0].cvs.toDataURL('image/' + expType);
    link.click();
    layers[0].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
    exportMod.style.display = 'none';
};

let layers = [];

var isDrawing = false;
var isErasing = false;

var isImageMoving = false;
var isImageScaling = false;
var isImageRotating = false;


var diffX = 0;
var diffY = 0;
var angle = 0;

let leftDiff = 0;
let topDiff = 0;
let rightDiff = 0;
let bottomDiff = 0;

var x;
var y;
var currCanvIdx = 0;
var maxId = 0;

var lastTouches = [];

// Importing and manipulating images
inputImg = document.getElementById('inputImg');
inputImg.onchange = function() {
    importImage.src = URL.createObjectURL(inputImg.files[0]);
    importImage.onload = function() {
	addLayer('image');
	//importImage.src = null;
	importImage.onload = null;
    };
};

function catchImage(e) {
    let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width / 2;
    let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height / 2;
    layers[currCanvIdx].transform[4] = centreX;
    layers[currCanvIdx].transform[5] = centreY;

    layers[0].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);

    //let tempX = e.pageX - canvasOffsetX - layers[currCanvIdx].cvs.offsetLeft;
    //let tempY = e.pageY - canvasOffsetY - layers[currCanvIdx].cvs.offsetTop;
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    let tempX = (e.clientX - bounds.x) / workspaceScale;
    let tempY = (e.clientY - bounds.y) / workspaceScale;
    //console.log(e.pageX);
    //console.log(layers[0].cvs.getBoundingClientRect());
    //console.log(workspaceScale);

    tempX -= centreX;
    tempY -= centreY;
    catchX = tempX * layers[currCanvIdx].transform[0] +
	tempY * layers[currCanvIdx].transform[1] +
	layers[currCanvIdx].transform[4];
    catchY = tempX * layers[currCanvIdx].transform[2] +
	tempY * layers[currCanvIdx].transform[3] +
	layers[currCanvIdx].transform[5];
    tempX += centreX;
    tempY += centreY;  
    
    let widthLatency = layers[currCanvIdx].img.width * 0.05;
    let heightLatency = layers[currCanvIdx].img.height * 0.05;
    if(catchX > layers[currCanvIdx].xPos &&//+ widthLatency &&
       catchX < layers[currCanvIdx].xPos + layers[currCanvIdx].img.width &&//- widthLatency &&
       catchY > layers[currCanvIdx].yPos &&//+ heightLatency &&
       catchY < layers[currCanvIdx].yPos + layers[currCanvIdx].img.height) {//- heightLatency) {
	catchX = tempX;
	catchY = tempY;
	layers[0].cvs.onmousemove = moveImage;
	isImageMoving = true;
	console.log('moving');
    }
    else if(catchX > layers[currCanvIdx].xPos - widthLatency &&
	    catchX < layers[currCanvIdx].xPos + layers[currCanvIdx].img.width + widthLatency &&
	    catchY > layers[currCanvIdx].yPos - heightLatency &&
	    catchY < layers[currCanvIdx].yPos + layers[currCanvIdx].img.height + heightLatency) {
	catchX = tempX;
	catchY = tempY;
	layers[0].cvs.onmousemove = scaleImage;
	isImageScaling = true;
	console.log('scaling');
    }
    else if(catchX > layers[currCanvIdx].xPos - 2*widthLatency &&
	    catchX < layers[currCanvIdx].xPos + layers[currCanvIdx].img.width + 2*widthLatency
	    && catchY > layers[currCanvIdx].yPos - 2*heightLatency &&
	    catchY < layers[currCanvIdx].yPos + layers[currCanvIdx].img.height + 2*heightLatency) {
	
	catchX = tempX;
	catchY = tempY;
	
	layers[0].cvs.onmousemove = rotateImage;
	isImageRotating = true;
	console.log('rotating');
    }
};

function moveImage(e) {
    //diffX = e.pageX - canvasOffsetX - layers[currCanvIdx].cvs.offsetLeft - catchX;
    //diffY = e.pageY - canvasOffsetY - layers[currCanvIdx].cvs.offsetTop - catchY;
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    diffX = (e.clientX - bounds.x) / workspaceScale - catchX;
    diffY = (e.clientY - bounds.y) / workspaceScale - catchY;
    
    let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2 + diffX;
    let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2 + diffY; 
    layers[currCanvIdx].transform[4] = centreX;
    layers[currCanvIdx].transform[5] = centreY;
    
    //layers[currCanvIdx].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);

    layers[currCanvIdx].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);
    
    layers[currCanvIdx].ctx.setTransform(
	layers[currCanvIdx].transform[0],
	layers[currCanvIdx].transform[1],
	layers[currCanvIdx].transform[2],
	layers[currCanvIdx].transform[3],
	layers[currCanvIdx].transform[4],
	layers[currCanvIdx].transform[5]);
    
    layers[currCanvIdx].ctx.drawImage(
	layers[currCanvIdx].img,
	-layers[currCanvIdx].img.width/2,
	-layers[currCanvIdx].img.height/2,
	layers[currCanvIdx].img.width,
	layers[currCanvIdx].img.height);
    

    // layers[currCanvIdx].ctx.setLineDash([4, 2]);
    // layers[currCanvIdx].ctx.lineWidth = 3;
    // layers[0].ctx.strokeRect(
    // 	-layers[currCanvIdx].img.width/2,
    // 	-layers[currCanvIdx].img.height/2,
    // 	layers[currCanvIdx].img.width,
    // 	layers[currCanvIdx].img.height);
    //layers[currCanvIdx].ctx.resetTransform();
}

function scaleImage(e) {
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    let tempX = (e.clientX - bounds.x) / workspaceScale - catchX;
    let tempY = (e.clientY - bounds.y) / workspaceScale - catchY;
    //let tempX = e.pageX - canvasOffsetX - layers[currCanvIdx].cvs.offsetLeft - catchX;
    //let tempY = e.pageY - canvasOffsetY - layers[currCanvIdx].cvs.offsetTop - catchY;

    //let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2;
    //let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2;
    //layers[currCanvIdx].transform[4] = centreX;
    //layers[currCanvIdx].transform[5] = centreY;

    let widthLatency = layers[currCanvIdx].img.width * 0.05;
    let heightLatency = layers[currCanvIdx].img.height * 0.05;    
    layers[currCanvIdx].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3 + leftDiff,
	-layers[currCanvIdx].img.height/2 - 3 + topDiff,
	layers[currCanvIdx].img.width + 6 + rightDiff,
	layers[currCanvIdx].img.height + 6 + bottomDiff);
    
    diffX = tempX * layers[currCanvIdx].transform[0] + tempY * layers[currCanvIdx].transform[1]; //+ layers[currCanvIdx].transform[4];
    diffY = tempX * layers[currCanvIdx].transform[2] + tempY * layers[currCanvIdx].transform[3]; //+ layers[currCanvIdx].transform[5];

    // if(layers[currCanvIdx].img.width + diffX <= widthLatency) {
    // 	diffX = -layers[currCanvIdx].img.width + widthLatency;
    // }
    // if(layers[currCanvIdx].img.height + diffY <= heightLatency) {
    // 	diffY = -layers[currCanvIdx].img.height + heightLatency;
    // }

    // left catch
    if(catchX < layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2) {
    //if(catchX < xpostrans) {
	leftDiff = diffX;
	rightDiff = -diffX;
	if(layers[currCanvIdx].img.width - leftDiff <= widthLatency) {
	    leftDiff = layers[currCanvIdx].img.width -  widthLatency;
	    rightDiff = -layers[currCanvIdx].img.width + widthLatency;
	}
    }
    else {
	leftDiff = 0;
	rightDiff = diffX;
	if(layers[currCanvIdx].img.width + rightDiff <= widthLatency) {
	    leftDiff = 0;
	    rightDiff = -layers[currCanvIdx].img.width + widthLatency;
	}
    }
    // top catch
    if(catchY < layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2) {
        //if(catchY < ypostrans) {
	topDiff = diffY;
	bottomDiff = -diffY;
	if(layers[currCanvIdx].img.height - topDiff <= heightLatency) {
	    topDiff = layers[currCanvIdx].img.height - heightLatency;
	    bottomDiff = -layers[currCanvIdx].img.height + heightLatency;
	}
    }
    else {
	bottomDiff = diffY;
	topDiff = 0;
	if(layers[currCanvIdx].img.height + bottomDiff <= heightLatency) {
	    topDiff = 0;
	    bottomDiff = -layers[currCanvIdx].img.height + heightLatency;
	}
    }

    
    //layers[currCanvIdx].transform[0] = (layers[currCanvIdx].img.width + diffX) / layers[currCanvIdx].img.width;
    //layers[currCanvIdx].transform[3] = (layers[currCanvIdx].img.height + diffY) / layers[currCanvIdx].img.height;
    
    //layers[currCanvIdx].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);

    layers[currCanvIdx].ctx.setTransform(
	layers[currCanvIdx].transform[0],
	layers[currCanvIdx].transform[1],
	layers[currCanvIdx].transform[2],
	layers[currCanvIdx].transform[3],
	layers[currCanvIdx].transform[4],
	layers[currCanvIdx].transform[5]);
    
    layers[currCanvIdx].ctx.drawImage(
	layers[currCanvIdx].img,
	-layers[currCanvIdx].img.width/2 + leftDiff,
	-layers[currCanvIdx].img.height/2 + topDiff,
	layers[currCanvIdx].img.width + rightDiff,//+ diffX,
	layers[currCanvIdx].img.height + bottomDiff);//+ diffY);


    // layers[currCanvIdx].ctx.setLineDash([4, 2]);
    // layers[currCanvIdx].ctx.lineWidth = 3;
    // layers[0].ctx.strokeRect(
    // 	-layers[currCanvIdx].img.width/2 + leftDiff,
    // 	-layers[currCanvIdx].img.height/2 + topDiff,
    // 	layers[currCanvIdx].img.width + rightDiff,
    // 	layers[currCanvIdx].img.height + bottomDiff);
    //layers[currCanvIdx].ctx.resetTransform();
}

function rotateImage(e) {
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    let currX = (e.clientX - bounds.x) / workspaceScale;
    let currY = (e.clientY - bounds.y) / workspaceScale;
    //let currX = e.pageX - canvasOffsetX - layers[currCanvIdx].cvs.offsetLeft;
    //let currY = e.pageY - canvasOffsetY - layers[currCanvIdx].cvs.offsetTop;

    let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2;
    let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2;

    let newAngle = Math.atan2(currY - centreY, currX - centreX);
    angle = newAngle - Math.atan2(catchY - centreY, catchX - centreX);
    
    layers[currCanvIdx].transform[0] = Math.cos(angle);
    layers[currCanvIdx].transform[1] = Math.sin(angle);
    layers[currCanvIdx].transform[2] = -Math.sin(angle);
    layers[currCanvIdx].transform[3] = Math.cos(angle);
    layers[currCanvIdx].transform[4] = centreX;
    layers[currCanvIdx].transform[5] = centreY;
    
    //layers[currCanvIdx].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
    layers[currCanvIdx].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);
    
    layers[currCanvIdx].ctx.setTransform(
	layers[currCanvIdx].transform[0],
	layers[currCanvIdx].transform[1],
	layers[currCanvIdx].transform[2],
	layers[currCanvIdx].transform[3],
	layers[currCanvIdx].transform[4],
	layers[currCanvIdx].transform[5]);
    layers[currCanvIdx].ctx.drawImage(
	layers[currCanvIdx].img,
	-layers[currCanvIdx].img.width/2,
	-layers[currCanvIdx].img.height/2,
	layers[currCanvIdx].img.width,
	layers[currCanvIdx].img.height);


    layers[0].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);

    // layers[currCanvIdx].ctx.setLineDash([4, 2]);
    // layers[currCanvIdx].ctx.lineWidth = 3;
    // layers[0].ctx.strokeRect(
    // 	-layers[currCanvIdx].img.width/2,
    // 	-layers[currCanvIdx].img.height/2,
    // 	layers[currCanvIdx].img.width,
    // 	layers[currCanvIdx].img.height);
    //layers[currCanvIdx].ctx.resetTransform();
}

function releaseImage(e) {
    layers[0].cvs.onmousemove = null;
    if(isImageMoving) {
	// layers[currCanvIdx].ctx.clearRect(
	//     -layers[currCanvIdx].img.width/2 - 3,
	//     -layers[currCanvIdx].img.height/2 - 3,
	//     layers[currCanvIdx].img.width + 6, //+ diffX,
	//     layers[currCanvIdx].img.height + 6);// + diffY);
	let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2 + diffX;
	let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2 + diffY; 
	layers[currCanvIdx].transform[4] = centreX;
	layers[currCanvIdx].transform[5] = centreY;
	layers[currCanvIdx].xPos += diffX;
	layers[currCanvIdx].yPos += diffY;
	diffX = 0;
	diffY = 0;
	isImageMoving = false;
    }
    else if(isImageScaling) {
	layers[currCanvIdx].ctx.clearRect(
	    -layers[currCanvIdx].img.width/2 - 3 + leftDiff,
	    -layers[currCanvIdx].img.height/2 - 3 + topDiff,
	    layers[currCanvIdx].img.width + 6 + rightDiff,
	    layers[currCanvIdx].img.height + 6 + bottomDiff);
	
	layers[currCanvIdx].xPos += leftDiff;
	layers[currCanvIdx].yPos += topDiff;
	layers[currCanvIdx].img.width += rightDiff;
	layers[currCanvIdx].img.height += bottomDiff;
	
	let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width/2;
	let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height/2;
	layers[currCanvIdx].transform[4] = centreX;
	layers[currCanvIdx].transform[5] = centreY;
	
	leftDiff = 0;
	topDiff = 0;
	rightDiff = 0;
	bottomDiff = 0;
	isImageScaling = false;
    }
    else if(isImageRotating) {
	isImageRotating = false;
    }

    //layers[currCanvIdx].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
    layers[currCanvIdx].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);
    
    layers[currCanvIdx].ctx.setTransform(
	layers[currCanvIdx].transform[0],
	layers[currCanvIdx].transform[1],
	layers[currCanvIdx].transform[2],
	layers[currCanvIdx].transform[3],
	layers[currCanvIdx].transform[4],
	layers[currCanvIdx].transform[5]);

    layers[currCanvIdx].ctx.drawImage(
	layers[currCanvIdx].img,
	-layers[currCanvIdx].img.width/2,
	-layers[currCanvIdx].img.height/2,
	layers[currCanvIdx].img.width,
	layers[currCanvIdx].img.height);

    refreshThumbnail(currCanvIdx);

    
    layers[0].ctx.clearRect(
	-layers[currCanvIdx].img.width/2 - 3,
	-layers[currCanvIdx].img.height/2 - 3,
	layers[currCanvIdx].img.width + 6,
	layers[currCanvIdx].img.height + 6);

    layers[0].ctx.setTransform(
	layers[currCanvIdx].transform[0],
	layers[currCanvIdx].transform[1],
	layers[currCanvIdx].transform[2],
	layers[currCanvIdx].transform[3],
	layers[currCanvIdx].transform[4],
	layers[currCanvIdx].transform[5]);

    layers[0].ctx.setLineDash([4, 2]);
    layers[0].ctx.lineWidth = 3;
    layers[0].ctx.strokeStyle = '#000000FF';
    layers[0].ctx.strokeRect(
	-layers[currCanvIdx].img.width/2,
	-layers[currCanvIdx].img.height/2,
	layers[currCanvIdx].img.width,
	layers[currCanvIdx].img.height);
    //layers[currCanvIdx].ctx.resetTransform();
}

function clamp(min, x, max) {
    return Math.min(Math.max(min, x), max);
}

function rgbToHsl(r, g, b) {
    let rt = r/255.0;
    let gt = g/255.0;
    let bt = b/255.0;

    let max = Math.max(rt, Math.max(gt, bt));
    let min = Math.min(rt, Math.min(gt, bt));

    let d = max - min;

    let h = 0.0;
    if(d == 0) {
	h = 0;
    }
    else if(max == rt) {
	h = 60.0 * (((gt - bt)/d) % 6);
    }
    else if(max == gt) {
	h = 60.0 * ((bt - rt)/d + 2);
    }
    else if(max == bt) {
	h = 60.0 * ((rt - gt)/d + 4);
    }

    let l = 0.0;
    l = (max + min) / 2.0;

    let s = 0.0;
    if(d == 0) {
	s = 0.0;
    }
    else {
	s = d / (1.0 - Math.abs(2.0*l - 1.0));
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let c = (1.0 - Math.abs(2.0*l - 1)) * s;

    let x = c * (1.0 - Math.abs(((h/60.0)%2)-1));

    let m = l - c/2.0;

    let rt, gt, bt;
    if(h < 60) {
	rt = c;
	gt = x;
	bt = 0.0;
    }
    else if(h < 120) {
	rt = x;
	gt = c;
	bt = 0;
    }
    else if(h < 180) {
	rt = 0;
	gt = c;
	bt = x;
    }
    else if(h < 240) {
	rt = 0;
	gt = x;
	bt = c;
    }
    else if(h < 300) {
	rt = x;
	gt = 0;
	bt = c;
    }
    else {
	rt = c;
	gt = 0;
	bt = x;
    }

    return [(rt + m) * 255, (gt + m) * 255, (bt + m) * 255];
}

document.getElementById('invClrBtn').onclick = function() {
    layers[currCanvIdx].effects.isInverted = !(layers[currCanvIdx].effects.isInverted);
    applyEffects();
};

function invertColors() {
    if(layers[currCanvIdx].effects.isInverted) {
	let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i] = 255 - imgData.data[i];
	    imgData.data[i+1] = 255 - imgData.data[i+1];
	    imgData.data[i+2] = 255 - imgData.data[i+2];
	}
	layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
	layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    }
}

let opacity = document.getElementById('opacity');
opacity.onchange = applyEffects;
function adjustOpacity() {
    let clearImd = layers[currCanvIdx].imd;
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let op = parseInt(opacity.value, 10);
    let factor = 255 * op / 100.0;
    for(let i = 0; i < imgData.data.length; i += 4) {
	if(clearImd.data[i+3] != 0) {
	    imgData.data[i+3] = factor;
	}
    }
    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.opacity = op;
    document.getElementById('opVal').innerHTML = 'Opacity: ' + op.toString() + '%';
}

let hue = document.getElementById('hue');
hue.onchange = applyEffects;
let saturation = document.getElementById('saturation');
saturation.onchange = applyEffects;
let lightness = document.getElementById('lightness');
lightness.onchange = applyEffects;

function adjustHsl() {
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let h = parseInt(hue.value, 10);
    let sat = parseInt(saturation.value, 10) / 100.0;
    let lig = parseInt(lightness.value, 10) / 100.0;

    for(let i = 0; i < imgData.data.length; i += 4) {
	let hsl = rgbToHsl(imgData.data[i], imgData.data[i+1], imgData.data[i+2]);
	[imgData.data[i], imgData.data[i+1], imgData.data[i+2]] = hslToRgb(clamp(0, (hsl[0] + h + 359) % 359, 359),
									   clamp(0, hsl[1] + hsl[1]*sat, 1),
									   clamp(0, hsl[2] + hsl[2]*lig, 1));
    }

    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.hue = hue.value;
    layers[currCanvIdx].effects.saturation = saturation.value;
    layers[currCanvIdx].effects.lightness = lightness.value;
    document.getElementById('hueVal').innerHTML = 'Hue: ' +
	(hue.value >= 0 ? '+' + hue.value : hue.value)  + '°';
    document.getElementById('satVal').innerHTML = 'Saturation: ' +
	(saturation.value >= 0 ? '+' + saturation.value : saturation.value) + '%';
    document.getElementById('lightVal').innerHTML = 'Lightness: ' +
	(lightness.value >= 0 ? '+' + lightness.value : lightness.value)  + '%';
}

let contrast = document.getElementById('contrast');
contrast.onchange = applyEffects;
function adjustContrast() {
    function truncateColor(value) {
	if(value < 0) {
	    value = 0;
	}
	else if(value > 255) {
	    value = 255;
	}
	return value;
    }
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let factor = (259.0 * (parseInt(contrast.value, 10) + 255.0)) / (255.0 * (259.0 - parseInt(contrast.value, 10)));
    for(let i = 0; i < imgData.data.length; i += 4) {
	imgData.data[i] = truncateColor(factor * (imgData.data[i] - 128.0) + 128.0);
	imgData.data[i+1] = truncateColor(factor * (imgData.data[i+1] - 128.0) + 128.0);
	imgData.data[i+2] = truncateColor(factor * (imgData.data[i+2] - 128.0) + 128.0);
    }
    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.contrast = parseInt(contrast.value, 10);
    document.getElementById('contrVal').innerHTML = 'Contrast: ' + contrast.value;
};

let exposure = document.getElementById('exposure');
exposure.onchange = applyEffects;
function adjustExposure() {
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let exp = parseInt(exposure.value, 10);
    let factor = Math.pow(2, exp / 10.0);
    for(let i = 0; i < imgData.data.length; i += 4) {
	imgData.data[i] *= factor;
	imgData.data[i+1] *= factor;
	imgData.data[i+2] *= factor;
    }
    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.exposure = exp;
    document.getElementById('expVal').innerHTML = 'Exposure: ' + exp.toString();
};

let redLevel = document.getElementById('rLvl');
redLevel.onchange = applyEffects;
function adjustRedLevel() {
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let rl = parseInt(redLevel.value, 10);
    let rlNorm = rl / 100.0;
    if(rl > 0) {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i] += rlNorm * (255 - imgData.data[i]);
	}
    }
    else {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i] += rlNorm * imgData.data[i];
	}
    }

    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.redLevel = rl;
    document.getElementById('rLvlVal').innerHTML = 'Red level: ' + rl.toString();
}

let greenLevel = document.getElementById('gLvl');
greenLevel.onchange = applyEffects;
function adjustGreenLevel() {
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let gl = parseInt(greenLevel.value, 10);
    let glNorm = gl / 100.0;
    if(gl > 0) {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i+1] += glNorm * (255 - imgData.data[i+1]);
	}
    }
    else {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i+1] += glNorm * imgData.data[i+1];
	}
    }

    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.greenLevel = gl;
    document.getElementById('gLvlVal').innerHTML = 'Green level: ' + gl.toString();
}

let blueLevel = document.getElementById('bLvl');
blueLevel.onchange = applyEffects;
function adjustBlueLevel() {
    let imgData = layers[currCanvIdx].imgCtx.getImageData(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    let bl = parseInt(blueLevel.value, 10);
    let blNorm = bl / 100.0;
    if(bl > 0) {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i+2] += blNorm * (255 - imgData.data[i+2]);
	}
    }
    else {
	for(let i = 0; i < imgData.data.length; i += 4) {
	    imgData.data[i+2] += blNorm * imgData.data[i+2];
	}
    }

    layers[currCanvIdx].imgCtx.clearRect(0, 0, layers[currCanvIdx].imgCvs.width, layers[currCanvIdx].imgCvs.height);
    layers[currCanvIdx].imgCtx.putImageData(imgData, 0, 0);
    layers[currCanvIdx].effects.blueLevel = bl;
    document.getElementById('bLvlVal').innerHTML = 'Blue level: ' + bl.toString();
}

function applyEffects() {
    invertColors();
    adjustRedLevel();
    adjustGreenLevel();
    adjustBlueLevel();
    adjustHsl();
    adjustContrast();
    adjustExposure();
    adjustOpacity();
    
    //TODO
    //сделать правильное убирание и появление выделений, интерфейс и курсоры по возможности, или вообще убрать их пока, а также доделать изменение местами слоев
    
    layers[currCanvIdx].img.src = layers[currCanvIdx].imgCvs.toDataURL('image/png');
    layers[currCanvIdx].imgCtx.putImageData(layers[currCanvIdx].imd, 0, 0);
    layers[currCanvIdx].img.onload = function() {
	layers[currCanvIdx].ctx.clearRect(
	    -layers[currCanvIdx].img.width/2 - 3,
	    -layers[currCanvIdx].img.height/2 - 3,
	    layers[currCanvIdx].img.width + 6,
	    layers[currCanvIdx].img.height + 6);
	//layers[currCanvIdx].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
	
	layers[currCanvIdx].ctx.setTransform(
	    layers[currCanvIdx].transform[0],
	    layers[currCanvIdx].transform[1],
	    layers[currCanvIdx].transform[2],
	    layers[currCanvIdx].transform[3],
	    layers[currCanvIdx].transform[4],
	    layers[currCanvIdx].transform[5]);
	layers[currCanvIdx].ctx.drawImage(
	    layers[currCanvIdx].img,
	    -layers[currCanvIdx].img.width/2,
	    -layers[currCanvIdx].img.height/2,
	    layers[currCanvIdx].img.width,
	    layers[currCanvIdx].img.height);
	//layers[currCanvIdx].ctx.resetTransform();
	
	refreshThumbnail(currCanvIdx);


	layers[0].ctx.clearRect(
	    -layers[currCanvIdx].img.width/2 - 3,
	    -layers[currCanvIdx].img.height/2 - 3,
	    layers[currCanvIdx].img.width + 6,
	    layers[currCanvIdx].img.height + 6);
	
	layers[0].ctx.setTransform(
	    layers[currCanvIdx].transform[0],
	    layers[currCanvIdx].transform[1],
	    layers[currCanvIdx].transform[2],
	    layers[currCanvIdx].transform[3],
	    layers[currCanvIdx].transform[4],
	    layers[currCanvIdx].transform[5]);

	layers[0].ctx.setLineDash([4, 2]);
	layers[0].ctx.lineWidth = 3;
	layers[0].ctx.strokeStyle = '#000000FF';
	layers[0].ctx.strokeRect(
	    -layers[currCanvIdx].img.width/2,
	    -layers[currCanvIdx].img.height/2,
	    layers[currCanvIdx].img.width,
	    layers[currCanvIdx].img.height);
	
	layers[currCanvIdx].img.onload = null;
    };
}

var brushSize = document.getElementById('brushSize');
brushSize.oninput = function() {
    applyBrushStyle();
    document.getElementById('brsVal').innerHTML = 'Size in pixels: ' + brushSize.value;
};

var brushTransp = document.getElementById('brushTransp');
brushTransp.oninput = function() {
    applyBrushStyle();
    document.getElementById('brtVal').innerHTML = 'Transparecy: ' + brushTransp.value;
};

var cp = document.getElementById('cp');
cp.onchange = function() {
    applyBrushStyle();
    setDrawColor(cp.value);
};

function setDrawColor(color) {
    let cpVal = document.getElementById('clrVal');
    cpVal.style.backgroundColor = color;
    cpVal.style.color = color;
    cpVal.onselectstart = function() { return false };
    cpVal.onmousedown = function() { return false };
};

setDrawColor(cp.value);

var brushShad = document.getElementById('brushShad');
brushShad.oninput = function() {
    applyBrushStyle();
    document.getElementById('brhVal').innerHTML = 'Shadowness: ' + Math.trunc(brushShad.value / 30.0 * 100.0) + '%';
};


// Layering
document.getElementById('newLayerBut').onclick = function(e) {
    importImage.src = '';
    addLayer('drawing');
};

function selectLayer(id) {
    let idx = getLayerIdxById(id);
    if(idx != null) {
	layers[0].ctx.resetTransform();
	layers[0].ctx.clearRect(0, 0, workspaceWidth, workspaceHeight);
	
	currCanvIdx = idx;

	if(layers[currCanvIdx].type == 'drawing') {
	    layers[0].cvs.style.zIndex = parseInt(layers[currCanvIdx].cvs.style.zIndex, 10) + 1;
	    
	    layers[0].ctx.setLineDash([]);
	    
	    selectBrushTool();

	    invClrBtn.parentNode.classList.add('disabled');
	    opacity.classList.remove('interface-range');
	    hue.classList.remove('interface-range');
	    saturation.classList.remove('interface-range');
	    lightness.classList.remove('interface-range');
	    contrast.classList.remove('interface-range');
	    exposure.classList.remove('interface-range');
	    rLvl.classList.remove('interface-range');
	    gLvl.classList.remove('interface-range');
	    bLvl.classList.remove('interface-range');
	    opacity.classList.add('interface-range-disabled');
	    hue.classList.add('interface-range-disabled');
	    saturation.classList.add('interface-range-disabled');
	    lightness.classList.add('interface-range-disabled');
	    contrast.classList.add('interface-range-disabled');
	    exposure.classList.add('interface-range-disabled');
	    rLvl.classList.add('interface-range-disabled');
	    gLvl.classList.add('interface-range-disabled');
	    bLvl.classList.add('interface-range-disabled');

	    invClrBtn.disabled = true;
	    opacity.disabled = true;
	    hue.disabled = true;
	    saturation.disabled = true;
	    lightness.disabled = true;
	    contrast.disabled = true;
	    exposure.disabled = true;
	    rLvl.disabled = true;
	    gLvl.disabled = true;
	    bLvl.disabled = true;

	    brushSize.classList.remove('interface-range-disabled');
	    brushTransp.classList.remove('interface-range-disabled');
	    brushShad.classList.remove('interface-range-disabled');
	    brushSize.classList.add('interface-range');
	    brushTransp.classList.add('interface-range');
	    brushShad.classList.add('interface-range');
	    er.parentNode.classList.remove('disabled');
	    br.parentNode.classList.remove('disabled');
	    bkt.parentNode.classList.remove('disabled');
	    cp.parentNode.classList.remove('disabled');

	    brushSize.disabled = false;
	    brushTransp.disabled = false;
	    brushShad.disabled = false;
	    er.disabled = false;
	    br.disabled = false;
	    bkt.disabled = false;
	    cp.disabled = false;
	}
	else if(layers[currCanvIdx].type == 'image') {
	    layers[0].cvs.style.zIndex = 0;

	    let centreX = layers[currCanvIdx].xPos + layers[currCanvIdx].img.width / 2;
	    let centreY = layers[currCanvIdx].yPos + layers[currCanvIdx].img.height / 2;
	    layers[currCanvIdx].transform[4] = centreX;
	    layers[currCanvIdx].transform[5] = centreY;

	    layers[0].ctx.setTransform(
		layers[currCanvIdx].transform[0],
		layers[currCanvIdx].transform[1],
		layers[currCanvIdx].transform[2],
		layers[currCanvIdx].transform[3],
		layers[currCanvIdx].transform[4],
		layers[currCanvIdx].transform[5]);
	    
	    layers[currCanvIdx].ctx.setTransform(
		layers[currCanvIdx].transform[0],
		layers[currCanvIdx].transform[1],
		layers[currCanvIdx].transform[2],
		layers[currCanvIdx].transform[3],
		layers[currCanvIdx].transform[4],
		layers[currCanvIdx].transform[5]);

	    layers[0].ctx.setLineDash([4, 2]);
	    layers[0].ctx.lineWidth = 3;
	    layers[0].ctx.strokeStyle = '#000000FF';
	    layers[0].ctx.strokeRect(
		-layers[currCanvIdx].img.width/2,
		-layers[currCanvIdx].img.height/2,
		layers[currCanvIdx].img.width,
		layers[currCanvIdx].img.height);
	    
	    invClrBtn.parentNode.classList.remove('disabled');
	    opacity.classList.add('interface-range');
	    hue.classList.add('interface-range');
	    saturation.classList.add('interface-range');
	    lightness.classList.add('interface-range');
	    contrast.classList.add('interface-range');
	    exposure.classList.add('interface-range');
	    rLvl.classList.add('interface-range');
	    gLvl.classList.add('interface-range');
	    bLvl.classList.add('interface-range');
	    opacity.classList.remove('interface-range-disabled');
	    hue.classList.remove('interface-range-disabled');
	    saturation.classList.remove('interface-range-disabled');
	    lightness.classList.remove('interface-range-disabled');
	    contrast.classList.remove('interface-range-disabled');
	    exposure.classList.remove('interface-range-disabled');
	    rLvl.classList.remove('interface-range-disabled');
	    gLvl.classList.remove('interface-range-disabled');
	    bLvl.classList.remove('interface-range-disabled');

	    invClrBtn.disabled = false;
	    opacity.disabled = false;
	    hue.disabled = false;
	    saturation.disabled = false;
	    lightness.disabled = false;
	    contrast.disabled = false;
	    exposure.disabled = false;
	    rLvl.disabled = false;
	    gLvl.disabled = false;
	    bLvl.disabled = false;
	    opacity.value = layers[currCanvIdx].effects.opacity;
	    hue.value = layers[currCanvIdx].effects.hue;
	    saturation.value = layers[currCanvIdx].effects.saturation;
	    lightness.value = layers[currCanvIdx].effects.lightness;
	    contrast.value = layers[currCanvIdx].effects.contrast;
	    exposure.value = layers[currCanvIdx].effects.exposure;
	    rLvl.value = layers[currCanvIdx].effects.redLevel;
	    gLvl.value = layers[currCanvIdx].effects.greenLevel;
	    bLvl.value = layers[currCanvIdx].effects.blueLevel;

	    document.getElementById('hueVal').innerHTML = 'Hue: ' +
		(hue.value >= 0 ? '+' + hue.value : hue.value)  + '°';
	    document.getElementById('satVal').innerHTML = 'Saturation: ' +
		(saturation.value >= 0 ? '+' + saturation.value : saturation.value) + '%';
	    document.getElementById('lightVal').innerHTML = 'Lightness: ' +
		(lightness.value >= 0 ? '+' + lightness.value : lightness.value)  + '%';

	    document.getElementById('contrVal').innerHTML = 'Contrast: ' + contrast.value;
	    document.getElementById('expVal').innerHTML = 'Exposure: ' + (parseInt(exposure.value, 10) / 10.0).toString();
	    document.getElementById('rLvlVal').innerHTML = 'Red level: ' + (parseInt(rLvl.value, 10)).toString();
	    document.getElementById('gLvlVal').innerHTML = 'Green level: ' + (parseInt(gLvl.value, 10)).toString();
	    document.getElementById('bLvlVal').innerHTML = 'Blue level: ' + (parseInt(bLvl.value, 10)).toString();
	    document.getElementById('opVal').innerHTML = 'Opacity: ' + (parseInt(opacity.value, 10)).toString() + '%';

	    er.parentNode.style.backgroundColor = '#c2c2c1';
	    br.parentNode.style.backgroundColor = '#c3c2c1';
	    bkt.parentNode.style.backgroundColor = '#c3c2c1';
	    
	    brushSize.classList.add('interface-range-disabled');
	    brushTransp.classList.add('interface-range-disabled');
	    brushShad.classList.add('interface-range-disabled');
	    brushSize.classList.remove('interface-range');
	    brushTransp.classList.remove('interface-range');
	    brushShad.classList.remove('interface-range');
	    er.parentNode.classList.add('disabled');
	    br.parentNode.classList.add('disabled');
	    bkt.parentNode.classList.add('disabled');
	    cp.parentNode.classList.add('disabled');

	    brushSize.disabled = true;
	    brushTransp.disabled = true;
	    brushShad.disabled = true;
	    er.disabled = true;
	    br.disabled = true;
	    bkt.disabled = true;
	    cp.disabled = true;

	    layers[0].cvs.onmousedown = catchImage;
	    layers[0].cvs.onmousemove = null;
	    layers[0].cvs.onmouseup = releaseImage;
	}
	document.getElementById('currLayer').innerHTML = layers[currCanvIdx].listElem.firstChild.innerHTML;
	//console.log('layer' + currCanvIdx);
    }
};

function getLayerIdxById(id) {
    let idx = null;
    for(let i = 0; i < layers.length; i+=1) {
	if(layers[i].cvs.id == id) {
	    idx = i;
	    break;
	}
    }
    return idx;
}

function addLayer(type, xPos = 0, yPos = 0, transform = null, effects = null) {
    layers.push(createLayer(type, xPos, yPos, transform, effects));
    box.appendChild(layers[layers.length-1].cvs);
    selectLayer(layers[layers.length-1].cvs.id);
    refreshThumbnail(layers.length-1);
}

function createLayer(type, xPos = 0, yPos = 0, transform = null, effects = null) {
    let cvs = document.createElement('canvas');
    let ctx = cvs.getContext('2d');
    cvs.id = (maxId++).toString();
    cvs.width = workspaceWidth;
    cvs.height = workspaceHeight;
    cvs.classList.add('canvas');
    cvs.style.zIndex = -maxId;

    let sizeWidth = parseInt(Math.min(Math.max(workspaceWidth / 5.0, workspaceWidth * workspaceScale), workspaceWidth * 5), 10);
    let sizeHeight = parseInt(Math.min(Math.max(workspaceHeight / 5.0, workspaceHeight * workspaceScale), workspaceHeight * 5), 10);
    cvs.style.width = (sizeWidth).toString() + 'px';
    cvs.style.height = (sizeHeight).toString() + 'px';
    cvs.style.transform = 'translateY(-50%) translateX(-50%) translateX(' + (workspaceDiffX).toString() + 'px) translateY(' + (workspaceDiffY).toString() + 'px)';
    
    
    let listElem = document.createElement('div');
    listElem.id = cvs.id;
    listElem.classList.add('lyr-list-element');
    listElem.onclick = function() {
	selectLayer(parseInt(this.id, 10));
    };

    document.getElementById('layer-list').appendChild(listElem);

    let llabel = document.createElement('label');
    llabel.innerHTML = 'layer '+ (cvs.id).toString();
    llabel.onclick = renameLayer;
    listElem.appendChild(llabel);

    function createIconButton(onclickFunc, iconSrc, altName) {
	let llabel = document.createElement('label');
	//llabel.classList.add('interface-button-label');
	llabel.style.width = '18%';
	llabel.onclick = onclickFunc;
	let lblicon = document.createElement('img');
	lblicon.src = iconSrc;
	lblicon.classList.add('icon');
	lblicon.alt = altName;
	llabel.appendChild(lblicon);
	return llabel;
    }

    listElem.appendChild(document.createElement('br'));
    let btnGroup = document.createElement('div');
    btnGroup.classList.add('interface-button-group');
    btnGroup.appendChild(createIconButton(toggleLayerHideness, 'img/eye-icon.png', 'show/hide'));
    btnGroup.appendChild(createIconButton(moveLayerUp, 'img/arrow-up-icon.png', 'up'));
    btnGroup.appendChild(createIconButton(moveLayerDown, 'img/arrow-down-icon.png', 'down'));
    btnGroup.appendChild(createIconButton(duplicateLayer, 'img/dup-icon.png', 'duplicate'));
    btnGroup.appendChild(createIconButton(removeLayer, 'img/cross-icon.png', 'remove'));
    listElem.appendChild(btnGroup);
    listElem.appendChild(document.createElement('br'));
    
    let lthumbnail = document.createElement('img');
    lthumbnail.classList.add('lyr-thumbnail');
    listElem.appendChild(lthumbnail);

    let img = null;
    let imgCvs = null;
    let imgCtx = null;
    let imd = null;

    if(type == 'image') {
	img = new Image();
	img.src = importImage.src;
	imgCvs = document.createElement('canvas');
	imgCtx = imgCvs.getContext('2d');
	imgCvs.width = img.width;
	imgCvs.height = img.height;
	imgCtx.drawImage(img, 0, 0);
	imd = imgCtx.getImageData(0, 0, imgCvs.width.toFixed(2), imgCvs.height.toFixed(2));
	if(effects == null) {
	    xPos = (workspaceWidth - img.width) / 2;
	    yPos = (workspaceHeight - img.height) / 2;
	    transform = [ 1, 0, 0, 1, 0, 0 ];
	    effects = {
		isInverted: false,
		opacity: 100,
		hue: 0,
		saturation: 0,
		lightness: 0,
		contrast: 0,
		exposure: 0,
		redLvl: 0,
		greenLvl: 0,
		blueLvl: 0
	    };
	}
	ctx.drawImage(img, xPos, yPos);

	imgCtx.imageSmoothingEnabled = false;
    }
    else if(type == 'drawing') {
	if(importImage.src != '') {
	    ctx.drawImage(importImage, 0, 0);
	}
    }
    ctx.imageSmoothingEnabled = false;
    
    return {
	cvs,
	ctx,
	listElem,
	img,
	imd,
	type,
	imgCvs,
	imgCtx,
	xPos,
	yPos,
	//TODO
	//snapshots: [],
	transform,
	effects
    };
};

function redrawLayer(lyrIdx) {
    if(layers[lyrIdx] == 'image') {
	layers[lyrIdx].ctx.setTransform([ 1, 0, 0, 1, 0, 0 ]);
	layers[lyrIdx].ctx.clearRect(0, 0, layers[lyrIdx].cvs.width, layers[lyrIdx].cvs.height);
	
	layers[lyrIdx].ctx.setTransform(
	    layers[lyrIdx].transform[0],
	    layers[lyrIdx].transform[1],
	    layers[lyrIdx].transform[2],
	    layers[lyrIdx].transform[3],
	    layers[lyrIdx].transform[4],
	    layers[lyrIdx].transform[5]);

	layers[lyrIdx].ctx.drawImage(
	    layers[lyrIdx].img,
	    -layers[lyrIdx].img.width/2,
	    -layers[lyrIdx].img.height/2,
	    layers[lyrIdx].img.width,
	    layers[lyrIdx].img.height);

	refreshThumbnail(lyrIdx);

	layers[0].ctx.setTransform([ 1, 0, 0, 1, 0, 0 ]);
	layers[0].ctx.clearRect(0, 0, layers[0].cvs.width, layers[0].cvs.height);

	layers[0].ctx.setTransform(
	    layers[lyrIdx].transform[0],
	    layers[lyrIdx].transform[1],
	    layers[lyrIdx].transform[2],
	    layers[lyrIdx].transform[3],
	    layers[lyrIdx].transform[4],
	    layers[lyrIdx].transform[5]);

	layers[0].ctx.setLineDash([4, 2]);
	layers[0].ctx.lineWidth = 3;
	layers[0].ctx.strokeStyle = '#000000FF';
	layers[0].ctx.strokeRect(
	    -layers[lyrIdx].img.width/2,
	    -layers[lyrIdx].img.height/2,
	    layers[lyrIdx].img.width,
	    layers[lyrIdx].img.height);
    }
}

function duplicateLayer(e) {
    let idx = getLayerIdxById(parseInt(this.parentNode.parentNode.id, 10));

    if(layers[idx].type == 'image') {
	importImage.src = layers[idx].imgCvs.toDataURL('image/png');

	importImage.onload = function() {
	    addLayer('image', layers[idx].xPos, layers[idx].yPos, [...layers[idx].transform], {...layers[idx].effects});
	    layers[currCanvIdx].img.width = layers[idx].img.width;
	    layers[currCanvIdx].img.height = layers[idx].img.height;
	    applyEffects();
	    redrawLayer(currCanvIdx);
	    //importImage.src = null;
	    importImage.onload = null;
	};
    }
    else if(layers[idx].type == 'drawing') {
	importImage.src = layers[idx].cvs.toDataURL('image/png');

	importImage.onload = function() {
	    addLayer('drawing');
	    //importImage.src = null;
	    importImage.onload = null;
	};
    }
}

function removeLayer(e) {
    if(layers.length > 2) {
	let id = parseInt(this.parentNode.parentNode.id, 10);
	this.parentNode.parentNode.onclick = null;
	let idx = getLayerIdxById(id);
	layers[idx].listElem.remove();
	layers[idx].cvs.remove();
	layers.splice(idx, 1);
	
	if(idx > 1) {
	    selectLayer(layers[idx-1].cvs.id);
	}
	else {
	    selectLayer(layers[idx].cvs.id);
	}
    }
}

function renameLayer(e) {
    let label = this;
    let prevName = label.innerHTML;
    let tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.classList.add('interface-input-text');
    tempInput.style.height = '10px';
    tempInput.value = prevName;
    tempInput.onkeyup = function(e) {
	if(e.keyCode == 13) {
	    e.preventDefault();
	    if(tempInput.value != '') {
		label.innerHTML = tempInput.value;
		label.classList.remove('hidden');
		tempInput.remove();
		document.getElementById('currLayer').innerHTML = label.innerHTML;
	    }
	}
	else if(e.keyCode == 27) {
	    label.classList.remove('hidden');
	    tempInput.remove();
	    document.getElementById('currLayer').innerHTML = label.innerHTML;
	}
    };
    label.classList.add('hidden');
    label.parentElement.prepend(tempInput);
};

function moveLayerUp(e) {
    let id = parseInt(this.parentNode.parentNode.id, 10);
    let idx = getLayerIdxById(id);
    if(idx > 1) {
	layers[idx-1].listElem.remove();
	layers[idx].listElem.after(layers[idx-1].listElem);
	[ layers[idx].cvs.style.zIndex, layers[idx-1].cvs.style.zIndex ] = [ layers[idx-1].cvs.style.zIndex, layers[idx].cvs.style.zIndex ];
	[ layers[idx], layers[idx-1] ] = [ layers[idx-1], layers[idx] ];
    }
};

function moveLayerDown(e) {
    let id = parseInt(this.parentNode.parentNode.id, 10);
    let idx = getLayerIdxById(id);
    if(idx < layers.length-1) {
	layers[idx].listElem.remove();
	layers[idx+1].listElem.after(layers[idx].listElem);
	[ layers[idx].cvs.style.zIndex, layers[idx+1].cvs.style.zIndex ] = [ layers[idx+1].cvs.style.zIndex, layers[idx].cvs.style.zIndex ];
	[ layers[idx], layers[idx+1] ] = [ layers[idx+1], layers[idx] ];
    }
};

function toggleLayerHideness(e) {
    if(this.style.backgroundColor == '') {
	this.style.backgroundColor = '#c3c2c1';
    }
    else {
	this.style.backgroundColor = '';
    }
    layers[getLayerIdxById(parseInt(this.parentNode.parentNode.id, 10))].cvs.classList.toggle('hidden');
};

function refreshThumbnail(layerIdx) {
    layers[layerIdx].listElem.lastChild.src = layers[layerIdx].cvs.toDataURL('image/png');
};

// Bucket tool
let bkt = document.getElementById('bkt');
bkt.onclick = selectPaintTool;

function selectPaintTool() {
    //layers[currCanvIdx].ctx.globalCompositeOperation = 'source-over';
    layers[0].ctx.clearRect(0, 0, layers[0].ctx.canvas.width, layers[0].ctx.canvas.height);
    layers[0].cvs.onmousedown = paint;
    layers[0].cvs.onmousemove = null;
    layers[0].cvs.onmouseup = null;

    let bgl = bkt.parentNode.parentNode.getElementsByTagName('*');
    for(let i = 0; i < bgl.length; i+=2) {
	bgl[i].style.backgroundColor = '';
    }
    bkt.parentNode.style.backgroundColor = '#c3c2c1';
};

// при таком залитии "квадратами" возникает проблема прозрачности залития, так как по сути рисующиеся квадраты друг на друга накладываются. Также оно недостаточно точное при залитии небольших областей, но все еще лучший на текущий момент.

function paint(e) {
    layers[currCanvIdx].ctx.globalCompositeOperation = 'source-over';

    var toFill = [];
    
    var tolerance = 255;
    
    var imd = layers[currCanvIdx].ctx.getImageData(0, 0, workspaceWidth, workspaceHeight);
    var drawingBoundTop = 0;
    
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    var startClr = layers[currCanvIdx].ctx.getImageData(parseInt((e.clientX - bounds.x) / workspaceScale, 10), parseInt((e.clientY - bounds.y) / workspaceScale, 10), 1, 1);
    var targetClr = [ parseInt('0x'+cp.value[1]+cp.value[2]), parseInt('0x'+cp.value[3]+cp.value[4]), parseInt('0x'+cp.value[5]+cp.value[6]),  parseInt(brushTransp.value, 10) ];

    pixelStack = [[parseInt((e.clientX - bounds.x) / workspaceScale, 10), parseInt((e.clientY - bounds.y) / workspaceScale, 10)]];

    if(startClr.data[0] == targetClr[0] && startClr.data[1] == targetClr[1] && startClr.data[2] == targetClr[2] && startClr.data[3] == targetClr[3]) {
	return;
    }
    
    while(pixelStack.length) {
	var newPos, x, y, pixelPos, reachLeft, reachRight;
	newPos = pixelStack.pop();
	x = newPos[0];
	y = newPos[1];
	
	pixelPos = (y*workspaceWidth + x) * 4;
	while(y-- >= drawingBoundTop && isMatchesStartColorInPaint(imd, pixelPos, startClr, tolerance)) {
	    pixelPos -= workspaceWidth * 4;
	}
	pixelPos += workspaceWidth * 4;
	++y;
	reachLeft = false;
	reachRight = false;
	while(y++ < workspaceHeight-1 && isMatchesStartColorInPaint(imd, pixelPos, startClr, tolerance)) {
	    toFill.push([x, y]);
	    
	    //layers[currCanvIdx].ctx.fillStyle = cp.value + parseInt(brushTransp.value, 10).toString(16);
	    //layers[currCanvIdx].ctx.beginPath();
	    //layers[currCanvIdx].ctx.arc(x, y, 3, 0, 2 * Math.PI);
	    //layers[currCanvIdx].ctx.fill();
	    
	    imd.data[pixelPos] = targetClr[0]
	    imd.data[pixelPos+1] = targetClr[1];
	    imd.data[pixelPos+2] = targetClr[2];
	    imd.data[pixelPos+3] = targetClr[3];
	    if(x > 0) {
		if(isMatchesStartColorInPaint(imd, pixelPos - 4, startClr, tolerance)) {
		    if(!reachLeft) {
			pixelStack.push([x - 1, y]);
			reachLeft = true;
		    }
		}
		else if(reachLeft) {
		    reachLeft = false;
		}
	    }
	    if(x < workspaceWidth-1) {
		if(isMatchesStartColorInPaint(imd, pixelPos + 4, startClr, tolerance)) {
		    if(!reachRight) {
			pixelStack.push([x + 1, y]);
			reachRight = true;
		    }
		}
		else if(reachRight) {
		    reachRight = false;
		}
	    }
	    pixelPos += workspaceWidth * 4;
	}
    }
    //layers[currCanvIdx].ctx.putImageData(imd, 0, 0);

    layers[currCanvIdx].ctx.fillStyle = cp.value + parseInt(brushTransp.value, 10).toString(16);
    var i = 0;
    while(i < toFill.length) {
	layers[currCanvIdx].ctx.beginPath();
	layers[currCanvIdx].ctx.fillRect(toFill[i][0] == 0 ? toFill[i][0] : toFill[i][0]-2, toFill[i][1] == 0 ? toFill[i][1] : toFill[i][1]-2, 5, 5);
	i += 1;
    }

    refreshThumbnail(currCanvIdx);
};
function isMatchesStartColorInPaint(imd, pixelPos, startClr, toler)
{
    var r = imd.data[pixelPos];
    var g = imd.data[pixelPos+1];
    var b = imd.data[pixelPos+2];
    var a = imd.data[pixelPos+3];

    return (r == startClr.data[0] && g == startClr.data[1] && b == startClr.data[2] && a == startClr.data[3]);
    //return (Math.abs(r - startClr.data[0]) <= toler &&
//	    Math.abs(g - startClr.data[1]) <= toler &&
//	    Math.abs(b - startClr.data[2]) <= toler &&
    //	    Math.abs(a - startClr.data[3]) <= toler);
};


// Erase tool
let er = document.getElementById('er');
er.onclick = selectEraseTool;

function selectEraseTool() {
    //layers[currCanvIdx].ctx.globalCompositeOperation = 'destination-out';
    layers[0].cvs.onmousedown = prepareErase;
    layers[0].cvs.onmousemove = erase;
    layers[0].cvs.onmouseup = endErase;

    let bgl = er.parentNode.parentNode.getElementsByTagName('*');
    for(let i = 0; i < bgl.length; i+=2) {
	bgl[i].style.backgroundColor = '';
    }
    er.parentNode.style.backgroundColor = '#c3c2c1';
};

function prepareErase(e) {
    //layers[currCanvIdx].ctx.globalCompositeOperation = 'destination-out';
    isErasing = true;
    applyBrushStyle();
    layers[0].ctx.strokeStyle = cp.value + parseInt(255, 10).toString(16);
    layers[currCanvIdx].ctx.strokeStyle = cp.value + parseInt(255, 10).toString(16);

    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    x = (e.clientX - bounds.x) / workspaceScale;
    y = (e.clientY - bounds.y) / workspaceScale;
    layers[currCanvIdx].ctx.beginPath();
    layers[currCanvIdx].ctx.moveTo(x, y);
    layers[currCanvIdx].ctx.stroke();
};

function erase(e) {
    layers[0].ctx.lineWidth = 1;
    layers[0].ctx.strokeStyle = '#000000FF';
    layers[0].ctx.shadowBlur = 0;
    layers[0].ctx.clearRect(0, 0, layers[0].ctx.canvas.width, layers[0].ctx.canvas.height);
    layers[0].ctx.beginPath();
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    layers[0].ctx.arc((e.clientX - bounds.x) / workspaceScale,
		    (e.clientY - bounds.y) / workspaceScale,
		    parseInt(brushSize.value) / 2, 0, 2 * Math.PI, false);
    layers[0].ctx.stroke();
    if (isErasing) {
	layers[currCanvIdx].ctx.beginPath();
	layers[currCanvIdx].ctx.moveTo(x, y);
	layers[currCanvIdx].ctx.lineTo((e.clientX - bounds.x) / workspaceScale, (e.clientY - bounds.y) / workspaceScale);
	layers[currCanvIdx].ctx.stroke();
	x = (e.clientX - bounds.x) / workspaceScale;
	y = (e.clientY - bounds.y) / workspaceScale;
    }
};

function endErase(e) {
    isErasing = false;
    layers[currCanvIdx].ctx.stroke();
    applyBrushStyle();

    refreshThumbnail(currCanvIdx);
};


// Brush tool
let br = document.getElementById('br');
br.onclick = selectBrushTool;

function selectBrushTool() {
    //layers[currCanvIdx].ctx.globalCompositeOperation = 'source-over';
    layers[0].cvs.onmousedown = prepareBrush;
    layers[0].cvs.onmousemove = brush;
    layers[0].cvs.onmouseup = endBrush;

    let bgl = br.parentNode.parentNode.getElementsByTagName('*');
    for(let i = 0; i < bgl.length; i+=2) {
	bgl[i].style.backgroundColor = '';
    }
    br.parentNode.style.backgroundColor = '#c3c2c1';
};

function applyBrushStyle() {
    if(isDrawing) {
	layers[currCanvIdx].ctx.globalCompositeOperation = 'source-over';
    }
    else if(isErasing) {
	layers[currCanvIdx].ctx.globalCompositeOperation = 'destination-out';
    }
    
    layers[0].ctx.lineCap = 'round';
    layers[0].ctx.lineJoin = 'round';
    layers[currCanvIdx].ctx.lineCap = 'round';
    layers[currCanvIdx].ctx.lineJoin = 'round';

    let transp = parseInt(brushTransp.value - (brushTransp.value * (brushShad.value / 100.0)));
    if(transp < 16) {
	transp = '0' + transp.toString(16);
    }
    else {
	transp = transp.toString(16);
    }
    layers[0].ctx.strokeStyle = cp.value + transp;
    layers[currCanvIdx].ctx.strokeStyle = cp.value + transp;

    layers[0].ctx.shadowColor = cp.value + 'FF';
    layers[currCanvIdx].ctx.shadowColor = cp.value + 'FF';
    layers[0].ctx.lineWidth = parseInt(brushSize.value - (brushSize.value * (brushShad.value / 100.0)));
    layers[currCanvIdx].ctx.lineWidth = parseInt(brushSize.value - (brushSize.value * (brushShad.value / 100.0)));
    layers[0].ctx.shadowBlur = brushSize.value - layers[0].ctx.lineWidth;
    layers[currCanvIdx].ctx.shadowBlur = brushSize.value - layers[currCanvIdx].ctx.lineWidth;
};

function prepareBrush(e) {
    isDrawing = true;
    applyBrushStyle();
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    x = [(e.clientX - bounds.x) / workspaceScale];
    y = [(e.clientY - bounds.y) / workspaceScale];
};

function brush(e) {
    let bounds = layers[currCanvIdx].cvs.getBoundingClientRect();
    if (isDrawing) {
	x.push((e.clientX - bounds.x) / workspaceScale);
        y.push((e.clientY - bounds.y) / workspaceScale);
        layers[0].ctx.clearRect(0, 0, layers[0].ctx.canvas.width, layers[0].ctx.canvas.height);
        drawStroke(layers[0].ctx);
    }
    else {
	layers[0].ctx.lineWidth = 1;
	layers[0].ctx.strokeStyle = '#000000FF';
	layers[0].ctx.shadowBlur = 0;
        layers[0].ctx.clearRect(0, 0, layers[0].ctx.canvas.width, layers[0].ctx.canvas.height);
	layers[0].ctx.beginPath();
	layers[0].ctx.arc((e.clientX - bounds.x) / workspaceScale,
			(e.clientY - bounds.y) / workspaceScale,
			parseInt(brushSize.value) / 2, 0, 2 * Math.PI, false);
	layers[0].ctx.stroke();
    }
};

function endBrush(e) {
    isDrawing = false;
    layers[0].ctx.clearRect(0, 0, layers[0].ctx.canvas.width, layers[0].ctx.canvas.height);
    applyBrushStyle();
    drawStroke(layers[currCanvIdx].ctx);
    brush(e);
    refreshThumbnail(currCanvIdx);
};

function drawStroke(ctx){
    ctx.beginPath() ;
    ctx.moveTo(x[0],y[0]) ;
    if (x.length == 1) {
	ctx.arc(x[0], y[0], 0.1, 2 * Math.PI, 0);
    }
    else {
	for (var i=1; i < x.length; i++){
            ctx.lineTo(x[i],y[i]) ;
	}
    }
    ctx.stroke();
};



//canvases[0].onmouseover = function(e) {
//document.body.style.cursor = "url('paintBrush.cur'), auto";
  //  if (isDrawing) {
//contexts[currCanvIdx].moveTo(e.pageX - borderOffset - canvases[currCanvIdx].offsetLeft, e.pageY - borderOffset - canvases[currCanvIdx].offsetTop);
//    }
//};

function setCanvasCursor() {
    document.body.style.cursor = "url('paintBrush.cur'), auto";
    // if (isDrawing) {
// 	layers[currCanvIdx].ctx.moveTo(e.pageX - canvasOffsetX - layers[currCanvIdx].cvs.offsetLeft, e.pageY - canvasOffsetY - layers[currCanvIdx].cvs.offsetTop);
//     }
};

//canvases[0].onmouseout = function(e) {
//    document.body.style.cursor = "auto";
//};

function unsetCanvasCursor() {
    document.body.style.cursor = "auto";
};

// FIX TOUCH

// touch drawing

function getTouchIndexById(id) {
    for (var i = 0; i < lastTouches.length; i++) {
	if (id == lastTouches[i].identifier) return i;
    }
};

function copyTouch({identifier, pageX, pageY}) {
    return {identifier, pageX, pageY};
};
    
/*
canvases[currCanvIdx].ontouchstart = function(e) {
    e.preventDefault();
    
    isDrawing = true;
    contexts[currCanvIdx].lineCap = 'round';
    contexts[currCanvIdx].lineJoin = 'round';
    //ctx.beginPath();
    //ctx.moveTo(e.clientX - borderOffset, e.clientY - borderOffset);
    //alert("touch start");

    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
	lastTouches.push(copyTouch(touches[i]));
    }

    contexts[currCanvIdx].beginPath();
};

canvases[currCanvIdx].ontouchend = function(e) {
    isDrawing = false;
    lastTouches.splice(0, lastTouches.length);

    //ctx.stroke();
    //alert("touch end");
};

canvases[currCanvIdx].ontouchcancel = function(e) {
    isDrawing = false;
    //ctx.stroke();
    alert("touch cancel");
};
	
canvases[currCanvIdx].ontouchmove = function(e) {
    //alert('touch move');
    //if (isDrawing) {
	//ctx.lineTo(e.clientX - borderOffset, e.clientY - borderOffset);
    //ctx.stroke();
    //}

    var touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
	//var color = colorForTouch(touches[i]);
	//var idx = ongoingTouchIndexById(touches[i].identifier);

	//if (idx >= 0) {
	    //ctx.lineWidth = 4;
	    //ctx.fillStyle = color;
	//ctx.beginPath();
	//ctx.moveTo(touches[i].identifier.pageX, touches[i].identifier.pageY);
	var idx = getTouchIndexById(touches[i].identifier);
	contexts[currCanvIdx].moveTo(lastTouches[idx].pageX - borderOffset - canvases[currCanvIdx].offsetLeft, lastTouches[idx].pageY - borderOffset - canvases[currCanvIdx].offsetTop);
	contexts[currCanvIdx].lineTo(touches[i].pageX - borderOffset - canvases[currCanvIdx].offsetLeft, touches[i].pageY - borderOffset - canvases[currCanvIdx].offsetTop);
	contexts[currCanvIdx].stroke();
	lastTouches.splice(idx, 1, copyTouch(touches[i]));
	
	//ctx.stroke();
	    //ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
	    //ongoingTouches.splice(idx, 1);  // remove it; we're done
	//} else {
	//    console.log("can't figure out which touch to end");
	//}
    }
};

*/
