/* tslint:disable */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Component({
  selector: 'app-crop-tester',
  templateUrl: './crop-tester.component.html',
  styleUrls: ['./crop-tester.component.scss']
})
export class CropTesterComponent implements OnInit {

  constructor (private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
    this.setupCroppie();
  }

  /**
 * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
 * 
 * @param {HtmlElement} canvas
 * @param {int} width
 * @param {int} height
 * @param {boolean} resize_canvas if true, canvas will be resized. Optional.
 * https://stackoverflow.com/a/19223362
 */
resample_single(canvas, width, height, resize_canvas) {
  var width_source = canvas.width;
  var height_source = canvas.height;
  width = Math.round(width);
  height = Math.round(height);

  var ratio_w = width_source / width;
  var ratio_h = height_source / height;
  var ratio_w_half = Math.ceil(ratio_w / 2);
  var ratio_h_half = Math.ceil(ratio_h / 2);

  var ctx = canvas.getContext("2d");
  var img = ctx.getImageData(0, 0, width_source, height_source);
  var img2 = ctx.createImageData(width, height);
  var data = img.data;
  var data2 = img2.data;

  for (var j = 0; j < height; j++) {
      for (var i = 0; i < width; i++) {
          var x2 = (i + j * width) * 4;
          var weight = 0;
          var weights = 0;
          var weights_alpha = 0;
          var gx_r = 0;
          var gx_g = 0;
          var gx_b = 0;
          var gx_a = 0;
          var center_y = (j + 0.5) * ratio_h;
          var yy_start = Math.floor(j * ratio_h);
          var yy_stop = Math.ceil((j + 1) * ratio_h);
          for (var yy = yy_start; yy < yy_stop; yy++) {
              var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
              var center_x = (i + 0.5) * ratio_w;
              var w0 = dy * dy; //pre-calc part of w
              var xx_start = Math.floor(i * ratio_w);
              var xx_stop = Math.ceil((i + 1) * ratio_w);
              for (var xx = xx_start; xx < xx_stop; xx++) {
                  var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                  var w = Math.sqrt(w0 + dx * dx);
                  if (w >= 1) {
                      //pixel too far
                      continue;
                  }
                  //hermite filter
                  weight = 2 * w * w * w - 3 * w * w + 1;
                  var pos_x = 4 * (xx + yy * width_source);
                  //alpha
                  gx_a += weight * data[pos_x + 3];
                  weights_alpha += weight;
                  //colors
                  if (data[pos_x + 3] < 255)
                      weight = weight * data[pos_x + 3] / 250;
                  gx_r += weight * data[pos_x];
                  gx_g += weight * data[pos_x + 1];
                  gx_b += weight * data[pos_x + 2];
                  weights += weight;
              }
          }
          data2[x2] = gx_r / weights;
          data2[x2 + 1] = gx_g / weights;
          data2[x2 + 2] = gx_b / weights;
          data2[x2 + 3] = gx_a / weights_alpha;
      }
  }
  //clear and resize canvas
  if (resize_canvas === true) {
      canvas.width = width;
      canvas.height = height;
  } else {
      ctx.clearRect(0, 0, width_source, height_source);
  }

  //draw
  ctx.putImageData(img2, 0, 0);
}

  setupCroppie () {
    let uploadDemoEl = document.getElementById('upload-demo');
    let croppie = new window['Croppie'](uploadDemoEl, {
      enableExif: true,
      viewport: {
        width: 200,
        height: 200,
        type: 'circle'
      },
      boundary: {
        width: 200,
        height: 200
      }
    });
    let uploadInputEl = document.getElementById('upload');
    uploadInputEl.addEventListener('change', (evt) => {
      let file = evt && evt.target && evt.target['files'] && evt.target['files'][0];
      if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          croppie.bind({
            url: e.target['result']
          });
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Sorry, your browser does not support the FileReader API');
      }
    });
    let resultEl = document.getElementById('result');
    resultEl.addEventListener('click', (evt) => {
      croppie.result({
        type: 'rawcanvas',
        size: { width: 400, height: 400 },
        format: 'jpeg',
        quality: 1,
        circle: false
      }).then(fourhundredCanvas => {
        fourhundredCanvas.toBlob(fourhundredBlob => {
          //download 400 image
          const a = document.createElement('a');
          a.setAttribute('download', "image-400.jpg");
          a.setAttribute('href', (window['webkitURL'] || window['URL']).createObjectURL(fourhundredBlob));
          a.click();
        });

        let twohundredCanvas = document.createElement("canvas");
        let twohundredCtx = twohundredCanvas.getContext('2d');
        twohundredCanvas.width = 400;
        twohundredCanvas.height = 400;
        twohundredCtx.drawImage(fourhundredCanvas, 0, 0, 400, 400);
        this.resample_single(twohundredCanvas, 200, 200, true);
        twohundredCanvas.toBlob(twohundredBlob => {
          //resize to 200 image
          const a = document.createElement('a');
          a.setAttribute('download', "image-200.jpg");
          a.setAttribute('href', (window['webkitURL'] || window['URL']).createObjectURL(twohundredBlob));
          a.click();
        });

        let onehundredCanvas = document.createElement("canvas");
        let onehundredCtx = onehundredCanvas.getContext('2d');
        onehundredCanvas.width = 400;
        onehundredCanvas.height = 400;
        onehundredCtx.drawImage(fourhundredCanvas, 0, 0, 400, 400);
        this.resample_single(onehundredCanvas, 100, 100, true);
        onehundredCanvas.toBlob(onehundredBlob => {
          //resize to 100 image
          const a = document.createElement('a');
          a.setAttribute('download', "image-100.jpg");
          a.setAttribute('href', (window['webkitURL'] || window['URL']).createObjectURL(onehundredBlob));
          a.click();
        });

        let fiftyCanvas = document.createElement("canvas");
        let fiftyCtx = fiftyCanvas.getContext('2d');
        fiftyCanvas.width = 400;
        fiftyCanvas.height = 400;
        fiftyCtx.drawImage(fourhundredCanvas, 0, 0, 400, 400);
        this.resample_single(fiftyCanvas, 50, 50, true);
        fiftyCanvas.toBlob(fiftyBlob => {
          //resize to 50 image
          const a = document.createElement('a');
          a.setAttribute('download', "image-50.jpg");
          a.setAttribute('href', (window['webkitURL'] || window['URL']).createObjectURL(fiftyBlob));
          a.click();
        });

      }).catch(err => {
        console.error(err);
      });
    });
  }

}
