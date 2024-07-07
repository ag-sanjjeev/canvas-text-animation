/*
 ________________________________________________
(                Text Animation                ()
\-----------------------------------------------\
|                                               |
|   Copyright 2024 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

/* global constants */
const inputText = document.getElementById('inputText');
const canvasWidth = document.getElementById('canvasWidth');
const canvasHeight = document.getElementById('canvasHeight');

const animationScale = document.getElementById('animationScale');
const fps = document.getElementById('fps');
const inDuration = document.getElementById('inDuration');
const outDuration = document.getElementById('outDuration');
const animationDuration = document.getElementById('animationDuration');

const paddingX = document.getElementById('paddingX');
const paddingY = document.getElementById('paddingY');

const lineHeight = document.getElementById('lineHeight');
const fontSize = document.getElementById('fontSize');
const textFontFamily = document.getElementById('textFontFamily');
const fontStyle = document.getElementById('fontStyle');
const textAlignment = document.getElementById('textAlignment');

const textColor = document.getElementById('textColor');
const backgroundColor = document.getElementById('backgroundColor');

const setDeviceWidthButton = document.getElementById('setDeviceWidthButton');
const setDeviceHeightButton = document.getElementById('setDeviceHeightButton');
const playButton = document.getElementById('playButton');
const recordButton = document.getElementById('recordButton');
const fullScreen = document.getElementById('fullScreen');

const canvas = document.getElementById('canvas1'); 

const canvasCTX = canvas.getContext('2d');

let x = 0;
let y = 0;

// set and get function for localStorage
function setLocalStorage(name, value) {
	localStorage.setItem(name, value);
	return;
}

function getLocalStorage(name) {
	return localStorage.getItem(name); 
}

// set function for CanvasSize
function setCanvasSize(width='', height='') {
	canvas.width = (width != '') ? width : canvasWidth.value;
	canvas.height = (height != '') ? height: canvasHeight.value;
}

// set function for CanvasBackground
function setCanvasBackground(color='') {
	if (backgroundColor.value == '#000000' || color == '#000000') {
		canvas.style.backgroundColor = (color != '') ? color : backgroundColor.value;
	} else {
		canvasCTX.fillStyle = (color != '') ? color : backgroundColor.value;	
		canvasCTX.fillRect(0, 0, canvas.width, canvas.height);
	}
}

/* Event Listeners */
// fullScreen Event Listeners
// fullScreen click event listener
fullScreen.addEventListener('click', function(e) {
	canvas.requestFullscreen();
});

window.addEventListener('load', function() {
	setCanvasSize();
	setCanvasBackground();
}, false);