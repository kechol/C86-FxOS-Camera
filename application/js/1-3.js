window.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // fallback to old API
  navigator.mozCamera = navigator.mozCamera || navigator.mozCameras;

  console.log('INFO(camera): ', navigator.mozCamera);

  if(!navigator.mozCamera) {
    console.error('ERROR(navigator): ', navigator);
    alert('お使いの環境は Navigator.mozCamera を利用できません');
    return;
  }

  console.log('INFO(cameraList): ', navigator.mozCamera.getListOfCameras());
  var camera  = null
    , storage = navigator.getDeviceStorage('pictures')
    , options = { mode: 'picture', previewSize: { width: 320, height: 320 } }
    , cameraType  = navigator.mozCamera.getListOfCameras()[0]; // back camera

  var onAccessCamera = function(success) {
    camera = success;
    console.log('SUCCESS(mozCamera): ', camera);

    var captureBtn = document.getElementById('captureButton')
      , effectBtn  = document.getElementById('effectButton')
      , video  = document.getElementById('video')
      , effectIndex = 0;

    // show the stream
    var rot = (cameraType === 'back') ? 90 : -90;
    video.mozSrcObject = camera;
    video.width  = options.previewSize.width;
    video.height = options.previewSize.height;
    video.style.transform = 'rotate(' + rot + 'deg)';
    video.play();
    console.log(video);

    // take picture
    captureBtn.addEventListener('click', function(e) {
      // take a picture
      var picOptions = {
        pictureSize: camera.capabilities.pictureSizes[0], // width: 1920, height: 1080
        fileFormat: camera.capabilities.fileFormats[0] // jpeg
      };
      camera.takePicture(picOptions, onPictureTaken, onError);
    }, false);

    // change effect
    if(camera.capabilities.effects.length < 1) {
      effectBtn.setAttribute('disabled', 'disabled');
    } else {
      effectBtn.addEventListener('click', function(e) {
        var effects = camera.capabilities.effects;
        effectIndex = effectIndex < effects.length-1 ? effectIndex+1 : 0;
        camera.effect = effects[effectIndex];
        effectBtn.textContent = effects[effectIndex];
        console.log('INFO(effect): change effect', effects[effectIndex]);
      }, false);
    }
  };

  var onPictureTaken = function(blob) {
    var filename = 'c86camera_' + Date.now().toString() + '.' + blob.type.substr(6);
    storage.addNamed(blob, filename);
    console.log('SUCCESS(picture): ', blob, filename);
    camera.resumePreview();
  };

  var releaseCamera = function() {
    console.log('INFO(releaseCamera): ', camera);
    if(camera) {
      camera.release();
    }
  };

  var getCamera = function() {
    console.log('INFO(getCamera): ', camera);
    releaseCamera();
    navigator.mozCamera.getCamera(cameraType, options, onAccessCamera, onError);
  };

  var onError = function(err) {
    console.error('ERROR(mozCamera): ', err);
  };

  window.addEventListener('unload', releaseCamera);
  getCamera();
}, false);
