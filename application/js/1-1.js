window.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var button = document.getElementById('captureButton');

  button.addEventListener('click', function(e) {
    var activity = new MozActivity({
      name: 'pick',
      data: {
        type: 'image/jpeg'
      }
    });

    activity.addEventListener('success', function() {
      console.log('SUCCESS(activity): ', this.result);

      var img = new Image();

      img.onload = function() {
        var canvas = document.getElementById('canvas'), ctx;

        try {
          ctx = canvas.getContext('2d');
        } catch(e) {
          console.error('ERROR(ctx): ', e);
        }

        // fit the image size to the canvas square
        // canvas size: 320
        var width, height, offsetX = 0, offsetY = 0;
        if(this.width < this.height) {
          width = height = this.width;
          offsetY = (this.height - height) / 2;
        } else {
          width = height = this.height;
          offsetX = (this.width - width) / 2;
        }

        // draw the image in canvas
        ctx.drawImage(this, offsetX, offsetY, width, height, 0, 0, canvas.width, canvas.height);
      };

      img.src = URL.createObjectURL(this.result.blob);
    });

    activity.addEventListener('error', function() {
      console.error('ERROR(activity): ', this.error);
    });
  }, false);
}, false);
