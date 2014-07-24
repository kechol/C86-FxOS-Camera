window.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // fallback to prefixed API
  navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;

  var captureBtn    = document.getElementById('captureButton')
    , video  = document.getElementById('video')
    , canvas = document.getElementById('canvas');

  if(!navigator.getUserMedia) {
    console.error('ERROR(navigator): ', navigator);
    alert('お使いの環境は Navigator.getUserMedia を利用できません');
    return;
  }

  var onSuccess = function(stream) {
    console.log('SUCCESS(getUserMedia): ', stream);

    // set the stream to video source
    var url = URL.createObjectURL(stream);

    // play the video
    video.src = url;
    video.play();
  };

  var onError = function(err) {
    console.error('ERROR(getUserMedia): ', err);
  };

  // start video
  navigator.getUserMedia({ video: true }, onSuccess, onError);

  captureButton.addEventListener('click', function(e) {
     var ctx = canvas.getContext('2d');
     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }, false);
}, false);
