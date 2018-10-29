// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extraction with MobileNet. Built with p5.js
This example uses a callback pattern to create the classifier
=== */

let featureExtractor;
let classifier;
let video;
let loss;
let dogImages = 0;
let catImages = 0;
let pigImages = 0;

let knn;

let i = 0;
var countdownnumber=3;
var countdownid;
var predict_t;
var play_t;
var win_t;
var p_time=0;

const st = document.getElementById("startbtn");
const cd = document.getElementById("countdown");


function countdownfunc(){
 
 
 cd.innerHTML=countdownnumber;
 if (countdownnumber==0){ 
  cd.style.display = "none";
  showpic();
  //setTimeout(delay,500);
  clearTimeout(countdownid);
 }else{
  countdownnumber--;
  if(countdownid){
   clearTimeout(countdownid);
  }
  countdownid=setTimeout(countdownfunc,400);
 }
}


function setup() {
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  featureExtractor.numClasses=3;
  featureExtractor.topk= 6;
  featureExtractor.hiddenUnits= 200;
  featureExtractor.epochs= 90; //20
  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video, videoReady);
  // Set up the UI buttons
  setupButtons();
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady () {
  select('#videoStatus').html('Video ready!');
}


// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the Cat button is pressed, add the current frame
  // from the video with a label of "cat" to the classifier
  buttonA = select('#catButton');
  buttonA.mousePressed(function() {
    classifier.addImage('1');
    select('#amountOfCatImages').html(catImages++);
  });

  // When the Dog button is pressed, add the current frame
  // from the video with a label of "dog" to the classifier
  buttonB = select('#dogButton');
  buttonB.mousePressed(function() {
    classifier.addImage('2');
    select('#amountOfDogImages').html(dogImages++);
  });

  buttonC = select('#pigButton');
  buttonC.mousePressed(function() {
    classifier.addImage('3');
    select('#amountOfPigImages').html(pigImages++);
  });
  
  buttonNew = select('#buttonNew');
  buttonNew.mousePressed(function() {
    rs();
  });  
  
  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
}

function rs() {
    var audio = new Audio("s.wav");
 audio.play();
   countdownfunc();
   st.style.display = "none";
   predict();
}

function win() {
	
  
  cd.innerHTML="我贏";
	countdownnumber=4;
	cd.style.display = "";
	st.style.display = "";
//  start_t = setTimeout(function(){
//    countdownfunc();
//  }, 1500);
}

function showpic() {

  if (i == 1) {
    //msg = '剪刀';
	document.getElementById("myImg").src = "p2.jpg";
  } else if (i == 2) {
    //msg = '石頭';
	document.getElementById("myImg").src = "p3.jpg";
  } else if (i == 3) {
    //msg = '布';
	document.getElementById("myImg").src = "p1.jpg";
  }

  
   win_t = setTimeout(function(){
    win();
  }, 3000);  
}


// Show the results
function gotResults(err, result) {
  // Display any error
  i = result;
  if (err) {
    console.error(err);
  }
  select('#result').html(result);
  classify();
}
