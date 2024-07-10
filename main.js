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
const transition = document.getElementById('transition');
const inTransitionDuration = document.getElementById('inTransitionDuration');
const outTransitionDuration = document.getElementById('outTransitionDuration');
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

// custom animation end event
const animationEndEvent = new CustomEvent('animationEnded', {
	detail: {
		message: 'Animation Frame Ended'
	}
});

/* Class PreferenceHandler */
class PreferenceHandler {
	constructor() {
		this._animationObject = null;
		this._animationFrameReference = null;
		this._stream = null;
		this._recorder = null;
		this._videoChunks = [];
	}

	// set and get method for audio property
	set animationObject(obj) {
		this._animationObject = obj;
	}

	get animationObject() {
		return this._animationObject;
	}

	// set and get method for animationFrameReference property
	set animationFrameReference(ref) {
		this._animationFrameReference = ref;
	}

	get animationFrameReference() {
		return this._animationFrameReference;
	}

	// set and get method for stream property
	set setStream(stream) {
		this._stream = stream;
	}

	get getStream() {
		return this._stream;
	}

	// set and get method for recorder property
	set setRecorder(recorder) {
		this._recorder = recorder;
	}

	get getRecorder() {
		return this._recorder;
	}

	// set and get method for videoChunks property
	set setVideoChunks(videoChunks) {
		this._videoChunks = videoChunks;
	}

	get getVideoChunks() {
		return this._videoChunks;
	}
}

/* Initiating PreferenceHandler */
const prefObj = new PreferenceHandler();

/* Setting Preferences function*/
function setPreference() {
	inputText.value = (getLocalStorage('text-animation.inputText') == null) ? inputText.value : getLocalStorage('text-animation.inputText'); 
	canvasWidth.value = (getLocalStorage('text-animation.canvasWidth') == null) ? canvasWidth.value : getLocalStorage('text-animation.canvasWidth'); 
	canvasHeight.value = (getLocalStorage('text-animation.canvasHeight') == null) ? canvasHeight.value : getLocalStorage('text-animation.canvasHeight'); 
	transition.value = (getLocalStorage('text-animation.transition') == null) ? transition.options[0].value : getLocalStorage('text-animation.transition'); 
	inTransitionDuration.value = (getLocalStorage('text-animation.inTransitionDuration') == null) ? inTransitionDuration.value : getLocalStorage('text-animation.inTransitionDuration'); 
	outTransitionDuration.value = (getLocalStorage('text-animation.outTransitionDuration') == null) ? outTransitionDuration.value : getLocalStorage('text-animation.outTransitionDuration'); 
	animationDuration.value = (getLocalStorage('text-animation.animationDuration') == null) ? animationDuration.value : getLocalStorage('text-animation.animationDuration'); 
	fps.value = (getLocalStorage('text-animation.fps') == null) ? fps.value : getLocalStorage('text-animation.fps'); 
	paddingX.value = (getLocalStorage('text-animation.paddingX') == null) ? paddingX.value : getLocalStorage('text-animation.paddingX'); 
	paddingY.value = (getLocalStorage('text-animation.paddingY') == null) ? paddingY.value : getLocalStorage('text-animation.paddingY'); 
	lineHeight.value = (getLocalStorage('text-animation.lineHeight') == null) ? lineHeight.value : getLocalStorage('text-animation.lineHeight'); 
	fontSize.value = (getLocalStorage('text-animation.fontSize') == null) ? fontSize.value : getLocalStorage('text-animation.fontSize'); 
	textFontFamily.value = (getLocalStorage('text-animation.textFontFamily') == null) ? textFontFamily.value : getLocalStorage('text-animation.textFontFamily'); 
	fontStyle.value = (getLocalStorage('text-animation.fontStyle') == null) ? fontStyle.options[0].value : getLocalStorage('text-animation.fontStyle'); 
	textAlignment.value = (getLocalStorage('text-animation.textAlignment') == null) ? textAlignment.options[0].value : getLocalStorage('text-animation.textAlignment'); 
	textColor.value = (getLocalStorage('text-animation.textColor') == null) ? textColor.value : getLocalStorage('text-animation.textColor'); 
	backgroundColor.value = (getLocalStorage('text-animation.backgroundColor') == null) ? backgroundColor.value : getLocalStorage('text-animation.backgroundColor'); 
}

/* class TextAnimation */
class TextAnimation {
	// private property
	#totalTextHeight = 0;
	#wrappedText;

	// constructor method
	constructor (inputText) {
		this.inputText = inputText.split('\n');
		this.fontSize = fontSize.value;
		this.backgroundColor = backgroundColor.value;
		this.textColor = textColor.value;
		this.paddingX = paddingX.value;
		this.paddingY = paddingY.value;
		this.lineHeight = lineHeight.value;
		this.fontFamily = textFontFamily.value;
		this.fontStyle = fontStyle.value;
		this.textAlignment = textAlignment.value;

		this.interval = 1000/fps.value;
		this.timer = 0;

		this.recorderState = 'initialized';
		this.recorder = null;
		this.animationFrameReference = null;

		canvas.width = canvasWidth.value;
		canvas.height = canvasHeight.value;
		canvas.style.backgroundColor = this.backgroundColor;
		this.redColor = 0;
		this.greenColor = 0;
		this.blueColor = 0;
		this.alphaTransparent = 0;
		this.x = this.paddingX / 2;
		this.y = 0;	

		this.underlineBarHeight = 2;
		this.underlineHeightSpace = 15;

		this.lineIndex = 0;
		this.inTransitionDuration = 0;
		this.outTransitionDuration = 0;
		this.animationDuration = 0;
		this.totalCurrentAnimationDuration = 0;
		this.animationStartTime = 0;
		this.transition = null;
		this.scale = 1;

		this.timer = 0;
		this.lastTimeStamp = 0;

	}	
	// animateText method
	animate(timeStamp) {				
		
		// setting default font if it is an empty
		if (this.fontFamily == null || this.fontFamily == undefined) { this.fontFamily = 'Ysabeau Infant'; }

		// clear everything in canvas before start next frame and set last scale if it is zoom in
		canvasCTX.clearRect(0, 0, canvas.width, canvas.height);
		canvasCTX.scale(this.scale, this.scale);

		setCanvasBackground();
		this.transition = transition.value;
		this.textColor = textColor.value;

		this.totalCurrentAnimationDuration = Number(this.inTransitionDuration) + Number(this.animationDuration) + Number(this.outTransitionDuration);

		if (this.lastTimeStamp == 0) { this.lastTimeStamp = timeStamp; }
		
		if (this.lineIndex >= this.inputText.length) {
			this.stopAnimation();
		} else if (timeStamp - this.lastTimeStamp > this.totalCurrentAnimationDuration) {
			this.lineIndex++;		
			this.alphaTransparent = 0;		
			this.lastTimeStamp = timeStamp;
			this.animationFrameReference = window.requestAnimationFrame(this.animate.bind(this));
		} else {
			this.switchTransition(timeStamp);			
			this.animationFrameReference = window.requestAnimationFrame(this.animate.bind(this));
		}	
	}

	switchTransition(timeStamp) {

		if (this.transition == 'showInOut') {
			this.showInOut(timeStamp);
		} else if (this.transition == 'fadeInOut') {
			this.fadeInOut(timeStamp);
		} else if (this.transition == 'zoomInOut') {
			this.zoomInOut(timeStamp);
		} else if (this.transition == 'zoomIn') {
			this.zoomIn(timeStamp);
		} else {
			throw Error('Unknown transition');
		}

	}

	// showInOut method
	showInOut(timeStamp) {

		let lines;
		let lineWidth;
		let tempLineHeight;
		let newTempLine;
		let underlineHeight = 0;

		lines = this.inputText[this.lineIndex];

		this.wrapText(lines);

		lines = this.#wrappedText;
		
		tempLineHeight = (Number(this.fontSize) + Number(this.lineHeight));
		this.y = Number(canvas.height/2);// - ((Number(this.fontSize) + Number(this.lineHeight)) * lines.length * 0.5);
		this.y -= lines.length * 0.5 * tempLineHeight;		

		// there is no text justified alignment
		if (this.textAlignment != '') {
			canvasCTX.textAlign = (this.textAlignment != 'justified') ? this.textAlignment : 'left';
		}

		for (let i = 0; i < lines.length; i++) {

			let textFontStyle = this.fontStyle.replaceAll('underline', '').trim();
			// setting font style
			canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;	
	        
			lineWidth = canvasCTX.measureText(lines[i]).width;

			newTempLine = lines[i];


			// assigning x co-ordinates for right, center and justify text alignment 
			if (this.textAlignment == 'right') {
				this.x = (Number(this.x) + Number(canvas.width) - this.paddingX) / 2;
			} else if (this.textAlignment == 'center') {
				this.x = (Number(canvas.width)) / 2;
			} else if (this.textAlignment == 'justified') {

				// checking if it is an empty line
				if (lines[i].trim() != '') {

					// getting free space width metrics
					let noOfFreeSpaces = (canvas.width - this.paddingX) - lineWidth;

					// proceeds only if any whitespace
					if (lines[i].indexOf(' ') !== -1) {

						// getting number of whitespace in the line
						let noOfWhiteSpaces = lines[i].match(/([\s]+)/g).length;

						// if it has atleast one whitespace to proceed
						if (noOfFreeSpaces > 0) {
							
							// measuring single whitespace width metric for text style
							let whiteSpaceWidth = canvasCTX.measureText(' ').width;

							// calculating new white space counts
							let newWhiteSpaces = Math.ceil((noOfFreeSpaces / noOfWhiteSpaces) / whiteSpaceWidth);
							
							// appending and sharing equal whitespaces to all whitespaces in the line
							let whiteSpaces = '';
							for (let _i = 0; _i < newWhiteSpaces; _i++) {
								whiteSpaces += ' ';
							}

							newTempLine = lines[i].trim();
							newTempLine = newTempLine.replace(/\s/g, whiteSpaces);
						}						
					}
				}

			}

			/* Filling Text */
			canvasCTX.fillStyle = this.textColor;
			canvasCTX.fillText(newTempLine, this.x,this.y);	

			// applying underline font style
			if (this.fontStyle.indexOf('underline') !== -1) {
				// default co-ordinates will be followed for left text alignment	
				let underlineX = this.x;
				// measuring width metrics for new processed line text
				lineWidth = canvasCTX.measureText(newTempLine).width;
				// setting underline color as same as text color
				canvasCTX.fillStyle = this.textColor;			
				// underline x co-ordinate will be differs for right and center alignment
				if (this.textAlignment == 'right') {
					underlineX = (canvas.width - this.paddingX) - lineWidth;
				} else if (this.textAlignment == 'center') {
					underlineX = Number(this.x) - Number(lineWidth / 2);					
				}			

				// filling rectangular line as an underline below to text
				canvasCTX.fillRect(underlineX, Number(this.y) + this.underlineHeightSpace, lineWidth, this.underlineBarHeight);					
			}

			this.y += Number(tempLineHeight) + Number(this.underlineHeightSpace) + Number(this.underlineBarHeight);
		}
	}

	// fadeInOut method
	fadeInOut(timeStamp) {

		let lines;
		let lineWidth;
		let tempLineHeight;
		let newTempLine;
		let underlineHeight = 0;
		let rgbColor = null;	

		lines = this.inputText[this.lineIndex];

		this.wrapText(lines);

		lines = this.#wrappedText;
		
		tempLineHeight = (Number(this.fontSize) + Number(this.lineHeight));
		this.y = Number(canvas.height/2);// - ((Number(this.fontSize) + Number(this.lineHeight)) * lines.length * 0.5);
		this.y -= lines.length * 0.5 * tempLineHeight;		

		// there is no text justified alignment
		if (this.textAlignment != '') {
			canvasCTX.textAlign = (this.textAlignment != 'justified') ? this.textAlignment : 'left';
		}

		for (let i = 0; i < lines.length; i++) {

			let textFontStyle = this.fontStyle.replaceAll('underline', '').trim();
			// setting font style
			canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;	
	        
			lineWidth = canvasCTX.measureText(lines[i]).width;

			newTempLine = lines[i];


			// assigning x co-ordinates for right, center and justify text alignment 
			if (this.textAlignment == 'right') {
				this.x = (Number(this.x) + Number(canvas.width) - this.paddingX) / 2;
			} else if (this.textAlignment == 'center') {
				this.x = (Number(canvas.width)) / 2;
			} else if (this.textAlignment == 'justified') {

				// checking if it is an empty line
				if (lines[i].trim() != '') {

					// getting free space width metrics
					let noOfFreeSpaces = (canvas.width - this.paddingX) - lineWidth;

					// proceeds only if any whitespace
					if (lines[i].indexOf(' ') !== -1) {

						// getting number of whitespace in the line
						let noOfWhiteSpaces = lines[i].match(/([\s]+)/g).length;

						// if it has atleast one whitespace to proceed
						if (noOfFreeSpaces > 0) {
							
							// measuring single whitespace width metric for text style
							let whiteSpaceWidth = canvasCTX.measureText(' ').width;

							// calculating new white space counts
							let newWhiteSpaces = Math.ceil((noOfFreeSpaces / noOfWhiteSpaces) / whiteSpaceWidth);
							
							// appending and sharing equal whitespaces to all whitespaces in the line
							let whiteSpaces = '';
							for (let _i = 0; _i < newWhiteSpaces; _i++) {
								whiteSpaces += ' ';
							}

							newTempLine = lines[i].trim();
							newTempLine = newTempLine.replace(/\s/g, whiteSpaces);
						}						
					}
				}

			}

			/* FadeIn Effect */
			if (timeStamp - this.lastTimeStamp < this.inTransitionDuration) {				
				this.alphaTransparent = (Number(timeStamp - this.lastTimeStamp) / Number(this.inTransitionDuration));				
			} else if (timeStamp - this.lastTimeStamp < Number(this.inTransitionDuration) + Number(this.animationDuration)) { /* Static Color */
				this.alphaTransparent = 1;		
			} else if (timeStamp - this.lastTimeStamp < this.totalCurrentAnimationDuration) { /* FadeOut Effect */
				this.alphaTransparent = 1 - (Number(timeStamp - this.lastTimeStamp - this.inTransitionDuration - this.animationDuration) / Number(this.outTransitionDuration));	
			}

			// convert hex color code into rgb color value
			rgbColor = this.hexToRGB(this.textColor);
			
			/* Filling Text */
			canvasCTX.fillStyle = `rgba(${rgbColor.red},${rgbColor.green},${rgbColor.blue}, ${this.alphaTransparent})`; //this.textColor;	
			// canvasCTX.fillStyle = this.textColor;
			canvasCTX.fillText(newTempLine, this.x,this.y);	

			// applying underline font style
			if (this.fontStyle.indexOf('underline') !== -1) {
				// default co-ordinates will be followed for left text alignment	
				let underlineX = this.x;
				// measuring width metrics for new processed line text
				lineWidth = canvasCTX.measureText(newTempLine).width;
				// setting underline color as same as text color
				canvasCTX.fillStyle = this.textColor;			
				// underline x co-ordinate will be differs for right and center alignment
				if (this.textAlignment == 'right') {
					underlineX = (canvas.width - this.paddingX) - lineWidth;
				} else if (this.textAlignment == 'center') {
					underlineX = Number(this.x) - Number(lineWidth / 2);					
				}			

				// filling rectangular line as an underline below to text
				canvasCTX.fillRect(underlineX, Number(this.y) + this.underlineHeightSpace, lineWidth, this.underlineBarHeight);					
			}

			this.y += Number(tempLineHeight) + Number(this.underlineHeightSpace) + Number(this.underlineBarHeight);
		}
	}

	// zoomInOut method
	zoomInOut(timeStamp) {

		let lines;
		let lineWidth;
		let tempLineHeight;
		let newTempLine;
		let underlineHeight = 0;
		let tempFontSize = 0;		

		lines = this.inputText[this.lineIndex];

		this.wrapText(lines);

		lines = this.#wrappedText;
		
		tempLineHeight = (Number(this.fontSize) + Number(this.lineHeight));
		this.y = Number(canvas.height/2);
		this.y -= lines.length * 0.5 * tempLineHeight;		

		// there is no text justified alignment
		if (this.textAlignment != '') {
			canvasCTX.textAlign = (this.textAlignment != 'justified') ? this.textAlignment : 'left';
		}

		for (let i = 0; i < lines.length; i++) {

			let textFontStyle = this.fontStyle.replaceAll('underline', '').trim();
			// setting font style
			canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;	
	        
			lineWidth = canvasCTX.measureText(lines[i]).width;

			newTempLine = lines[i];


			// assigning x co-ordinates for right, center and justify text alignment 
			if (this.textAlignment == 'right') {
				this.x = (Number(this.x) + Number(canvas.width) - this.paddingX) / 2;
			} else if (this.textAlignment == 'center') {
				this.x = (Number(canvas.width)) / 2;
			} else if (this.textAlignment == 'justified') {

				// checking if it is an empty line
				if (lines[i].trim() != '') {

					// getting free space width metrics
					let noOfFreeSpaces = (canvas.width - this.paddingX) - lineWidth;

					// proceeds only if any whitespace
					if (lines[i].indexOf(' ') !== -1) {

						// getting number of whitespace in the line
						let noOfWhiteSpaces = lines[i].match(/([\s]+)/g).length;

						// if it has atleast one whitespace to proceed
						if (noOfFreeSpaces > 0) {
							
							// measuring single whitespace width metric for text style
							let whiteSpaceWidth = canvasCTX.measureText(' ').width;

							// calculating new white space counts
							let newWhiteSpaces = Math.ceil((noOfFreeSpaces / noOfWhiteSpaces) / whiteSpaceWidth);
							
							// appending and sharing equal whitespaces to all whitespaces in the line
							let whiteSpaces = '';
							for (let _i = 0; _i < newWhiteSpaces; _i++) {
								whiteSpaces += ' ';
							}

							newTempLine = lines[i].trim();
							newTempLine = newTempLine.replace(/\s/g, whiteSpaces);
						}						
					}
				}

			}

			/* ZoomIn Effect */
			if (timeStamp - this.lastTimeStamp < this.inTransitionDuration) {				
				tempFontSize = this.fontSize * (Number(timeStamp - this.lastTimeStamp) / Number(this.inTransitionDuration));
			} else if (timeStamp - this.lastTimeStamp < Number(this.inTransitionDuration) + Number(this.animationDuration)) { /* Static Size */
				tempFontSize = this.fontSize;		
			} else if (timeStamp - this.lastTimeStamp < this.totalCurrentAnimationDuration) { /* ZoomOut Effect */
				tempFontSize = this.fontSize - (this.fontSize * (Number(timeStamp - this.lastTimeStamp - this.inTransitionDuration - this.animationDuration) / Number(this.outTransitionDuration)));	
			}
		
			// setting font style
			canvasCTX.font = `${textFontStyle} ${tempFontSize}px ${this.fontFamily}, san-serif`;
			/* Filling Text */
			canvasCTX.fillStyle = this.textColor;
			canvasCTX.fillText(newTempLine, this.x,this.y);	

			// applying underline font style
			if (this.fontStyle.indexOf('underline') !== -1) {
				// default co-ordinates will be followed for left text alignment	
				let underlineX = this.x;
				// measuring width metrics for new processed line text
				lineWidth = canvasCTX.measureText(newTempLine).width;
				// setting underline color as same as text color
				canvasCTX.fillStyle = this.textColor;			
				// underline x co-ordinate will be differs for right and center alignment
				if (this.textAlignment == 'right') {
					underlineX = (canvas.width - this.paddingX) - lineWidth;
				} else if (this.textAlignment == 'center') {
					underlineX = Number(this.x) - Number(lineWidth / 2);					
				}			

				// filling rectangular line as an underline below to text
				canvasCTX.fillRect(underlineX, Number(this.y) + this.underlineHeightSpace, lineWidth, this.underlineBarHeight);					
			}

			this.y += Number(tempLineHeight) + Number(this.underlineHeightSpace) + Number(this.underlineBarHeight);
		}
	}

	// zoomIn method
	zoomIn(timeStamp) {

		let lines;
		let lineWidth;
		let tempLineHeight;
		let newTempLine;
		let underlineHeight = 0;
		let tempFontSize = 0;	
		let scaleSize = 0;	

		lines = this.inputText[this.lineIndex];

		this.wrapText(lines);

		lines = this.#wrappedText;
		
		tempLineHeight = (Number(this.fontSize) + Number(this.lineHeight));
		this.x = -(canvas.width / 2) + (this.paddingX / 2);
		this.y = 0;//Number(canvas.height/2);
		this.y += lines.length * 0.5 * tempLineHeight;		

		// there is no text justified alignment
		if (this.textAlignment != '') {
			canvasCTX.textAlign = (this.textAlignment != 'justified') ? this.textAlignment : 'left';
		}

		for (let i = 0; i < lines.length; i++) {

			let textFontStyle = this.fontStyle.replaceAll('underline', '').trim();
			// setting font style
			canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;	
	        
			lineWidth = canvasCTX.measureText(lines[i]).width;

			newTempLine = lines[i];


			// assigning x co-ordinates for right, center and justify text alignment 
			if (this.textAlignment == 'right') {
				this.x = (Number(this.x) + Number(canvas.width) - this.paddingX) / 2;
			} else if (this.textAlignment == 'center') {
				this.x = 0;//(Number(canvas.width)) / 2;
			} else if (this.textAlignment == 'justified') {

				// checking if it is an empty line
				if (lines[i].trim() != '') {

					// getting free space width metrics
					let noOfFreeSpaces = (canvas.width - this.paddingX) - lineWidth;

					// proceeds only if any whitespace
					if (lines[i].indexOf(' ') !== -1) {

						// getting number of whitespace in the line
						let noOfWhiteSpaces = lines[i].match(/([\s]+)/g).length;

						// if it has atleast one whitespace to proceed
						if (noOfFreeSpaces > 0) {
							
							// measuring single whitespace width metric for text style
							let whiteSpaceWidth = canvasCTX.measureText(' ').width;

							// calculating new white space counts
							let newWhiteSpaces = Math.ceil((noOfFreeSpaces / noOfWhiteSpaces) / whiteSpaceWidth);
							
							// appending and sharing equal whitespaces to all whitespaces in the line
							let whiteSpaces = '';
							for (let _i = 0; _i < newWhiteSpaces; _i++) {
								whiteSpaces += ' ';
							}

							newTempLine = lines[i].trim();
							newTempLine = newTempLine.replace(/\s/g, whiteSpaces);
						}						
					}
				}

			}

			/* ZoomIn Effect */
			this.scaleSize = (Number(timeStamp - this.lastTimeStamp) / Number(this.totalCurrentAnimationDuration));
			this.scaleSize += Math.exp(this.scaleSize * (this.scaleSize * 5)) - 1;			

			canvasCTX.save();
			canvasCTX.translate(canvas.width / 2, canvas.height / 2);
			// setting font style
			canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;
			/* Filling Text */
			canvasCTX.fillStyle = this.textColor;
			canvasCTX.scale(this.scaleSize, this.scaleSize);
			canvasCTX.fillText(newTempLine, this.x,this.y);	
			
			// applying underline font style
			if (this.fontStyle.indexOf('underline') !== -1) {
				// default co-ordinates will be followed for left text alignment	
				let underlineX = this.x;
				// measuring width metrics for new processed line text
				lineWidth = canvasCTX.measureText(newTempLine).width;
				// setting underline color as same as text color
				canvasCTX.fillStyle = this.textColor;			
				// underline x co-ordinate will be differs for right and center alignment
				if (this.textAlignment == 'right') {
					underlineX = (canvas.width - this.paddingX) - lineWidth;
				} else if (this.textAlignment == 'center') {
					underlineX = Number(this.x) - Number(lineWidth / 2);					
				}			

				// filling rectangular line as an underline below to text
				canvasCTX.fillRect(underlineX, Number(this.y) + this.underlineHeightSpace, lineWidth, this.underlineBarHeight);					
			}

			canvasCTX.restore();
			this.y += Number(tempLineHeight) + Number(this.underlineHeightSpace) + Number(this.underlineBarHeight);
		}
	}

	// stopAnimation method
	stopAnimation () {
		// canceling or stopping animation
		window.cancelAnimationFrame(this.animationFrameReference);
		window.dispatchEvent(animationEndEvent);
		this.timer = 0;
		this.lastTimeStamp = 0;
		this.animationStartTime = 0;
		this.animationFrameReference = null;
	}	

	// calcTotalTextHeight method
	calcTotalTextHeight() {
		// calculating total height that going to occupy by processed text
		this.totalTextHeight = Number(this.paddingY);
		for (const line of this.#wrappedText) {
			this.totalTextHeight += Number(this.fontSize) + Number(this.lineHeight);
		}
	}

	hexToRGB(hex) {
		hex = hex.replace('#', '');

		// handle for short hex code
		if (hex.length === 3) {
			hex = hex.split('').map(x => x + x).join('');
		}

		// validate hex code
		if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
			throw new Error('Invalid hex color code');
		}

		// convert into base 16 integer
		const r = parseInt(hex.slice(0,2), 16);
		const g = parseInt(hex.slice(2,4), 16);
		const b = parseInt(hex.slice(4,6), 16);

		return {red: r, green: g, blue: b};
	}

	// wrapText method
	wrapText(line) {
		
		let textFontStyle = this.fontStyle.replaceAll('underline', '').trim();
		
		// assigning font style to calculate total width and height taken in the canvas
		canvasCTX.font = `${this.fontSize}px ${this.fontFamily}, san-serif`;
		// canvasCTX.font = `${textFontStyle} ${this.fontSize}px ${this.fontFamily}, san-serif`;
		
		// created empty lines array to store new lines
		let tempLines = [];

			// split by space that consider as words
			const words = line.split(' ');

			// initialize empty current line array for each iteration
			let currentLine = [];

			// iterate through each word in the line
			for (const word of words) {
				// measuring text metrics inside canvas
				const metrics = canvasCTX.measureText(currentLine.join(' ') + word + ' ');
				// calculating line width taken inclusive of padding in horizontal
				const lineWidth = Number(metrics.width) + Number(this.paddingX);
				
				// if lines width is more than the allotted width then it will be a new line
				if (lineWidth >= (canvas.width - this.paddingX)) {
					
					tempLines.push(currentLine.join(' '));
					currentLine = [];
				}

				// pushing last line
				currentLine.push(word);
			}

			// pushing all new processed lines into temp lines		
			tempLines.push(currentLine.join(' '));

		// setting into class properties for animation
		this.#wrappedText = tempLines;

	}
}

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
// inputText input event listener
inputText.addEventListener('input', function(e) {
	setLocalStorage('text-animation.inputText', inputText.value);
});

// canvasWidth input event listener
canvasWidth.addEventListener('input', function(e) {
	setLocalStorage('text-animation.canvasWidth', canvasWidth.value);
});

// setDeviceWidthButton click event listener 
setDeviceWidthButton.addEventListener('click', function(e) {
	canvasWidth.value = window.outerWidth;
});

// canvasHeight input event listener
canvasHeight.addEventListener('input', function(e) {
	setLocalStorage('text-animation.canvasHeight', canvasHeight.value);
});

// setDeviceHeightButton click event listener 
setDeviceHeightButton.addEventListener('click', function(e) {
	canvasHeight.value = window.outerHeight;
});

// transition change event listener
transition.addEventListener('change', function(e) {
	setLocalStorage('text-animation.transition', transition.value);
});

// inTransitionDuration input event listener
inTransitionDuration.addEventListener('input', function(e) {
	setLocalStorage('text-animation.inTransitionDuration', inTransitionDuration.value);
});

// outTransitionDuration input event listener
outTransitionDuration.addEventListener('input', function(e) {
	setLocalStorage('text-animation.outTransitionDuration', outTransitionDuration.value);
});

// animationDuration input event listener
animationDuration.addEventListener('input', function(e) {
	setLocalStorage('text-animation.animationDuration', animationDuration.value);
});

// fps input event listener
fps.addEventListener('input', function(e) {
	setLocalStorage('text-animation.fps', fps.value);
});

// paddingX input event listener
paddingX.addEventListener('input', function(e) {
	setLocalStorage('text-animation.paddingX', paddingX.value);
});

// paddingY input event listener
paddingY.addEventListener('input', function(e) {
	setLocalStorage('text-animation.paddingY', paddingY.value);
});

// lineHeight input event listener
lineHeight.addEventListener('input', function(e) {
	setLocalStorage('text-animation.lineHeight', lineHeight.value);
});

// fontSize input event listener
fontSize.addEventListener('input', function(e) {
	setLocalStorage('text-animation.fontSize', fontSize.value);
});

// textFontFamily input event listener
textFontFamily.addEventListener('input', function(e) {
	setLocalStorage('text-animation.textFontFamily', textFontFamily.value);
});

// fontStyle change event listener
fontStyle.addEventListener('change', function(e) {
	setLocalStorage('text-animation.fontStyle', fontStyle.value);
});

// textAlignment change event listener
textAlignment.addEventListener('change', function(e) {
	setLocalStorage('text-animation.textAlignment', textAlignment.value);
});

// textColor input event listener
textColor.addEventListener('input', function(e) {
	setLocalStorage('text-animation.textColor', textColor.value);
});

// backgroundColor input event listener
backgroundColor.addEventListener('input', function(e) {
	setLocalStorage('text-animation.backgroundColor', backgroundColor.value);
});

// playButton click event listener
playButton.addEventListener('click', function(e) {
	let state = playButton.innerText.toLowerCase();

	if (state == 'play') {		
		var animObj = new TextAnimation(inputText.value);
		animObj.inTransitionDuration = inTransitionDuration.value;
		animObj.outTransitionDuration = outTransitionDuration.value;
		animObj.animationDuration = animationDuration.value;
		animObj.animate(0);
		prefObj.animationObject = animObj;		
		playButton.innerText = 'Pause';
	} else if (state == 'pause') {
		prefObj.animationObject.stopAnimation();
		playButton.innerText = 'Play';
	}
});

// recordButton click event listener
recordButton.addEventListener('click', function(e) {
	// getting current state from button text
	let state = recordButton.innerText.toLowerCase();

	// if it is stopped stage then start capturing and change the button text as stop record
	if (state == 'start record') {
		// creating and setting stream captureStream with given fps value
		prefObj.stream = canvas.captureStream(fps.value);
		// creating and setting MediaRecorder with created stream input
		prefObj.recorder = new MediaRecorder(prefObj.stream);
		// initialize with empty value for recording
		prefObj.videoChunks = [];
		prefObj.recorderTimes = [];
		// setting events to store video chunks
		prefObj.recorder.ondataavailable = (e) => prefObj.videoChunks.push(e.data);
		// setting events to stop
		prefObj.recorder.onstop = () => {
			// creating and setting new Blob from chunks with supported video file type
			const videoBlob = new Blob(prefObj.videoChunks, { type: 'video/webm' });
			// creating and setting objectURL for download 
			const videoUrl = URL.createObjectURL(videoBlob);

			// Create a downloadable link
			const link = document.createElement('a');
			link.href = videoUrl;
			link.download = `canvas_video-T${Date.now()}.webm`;
			link.click();

			// Revoke object URL to avoid memory leaks
			URL.revokeObjectURL(videoUrl);

		};

		// starting recorder
		prefObj.recorder.start();
		// setting button text as stop record
		recordButton.innerText = 'Stop Record';	

	} else if (state == 'stop record'){ // if it is recording stage then stop capturing and change the button text as start record
		// stopping recorder
		prefObj.recorder.stop();
		// setting button text as start record
		recordButton.innerText = 'Start Record';
	}

});

// fullScreen click event listener
fullScreen.addEventListener('click', function(e) {
	canvas.requestFullscreen();
});

window.addEventListener('animationEnded', function() {
	playButton.innerText = 'Play'
}, false);

window.addEventListener('load', function() {
	setPreference();
	setCanvasSize();
	setCanvasBackground();
}, false);