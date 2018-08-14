/* tslint:disable */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { ImageService } from '../../services/image/image.service';
declare var $;

@Component({
  selector: 'app-crop-tester',
  templateUrl: './crop-tester.component.html',
  styleUrls: ['./crop-tester.component.scss']
})
export class CropTesterComponent implements OnInit {

  constructor (private imageService: ImageService, private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
    this.setupCroppie();
  }

  setupCroppie () {
    let uploadDemoEl = document.getElementById('ui-avatar-crop');
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
      this.showAvatarModal(true);
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
        this.imageService.resize(twohundredCanvas, 200, 200, true);
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
        this.imageService.resize(onehundredCanvas, 100, 100, true);
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
        this.imageService.resize(fiftyCanvas, 50, 50, true);
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

  showAvatarModal (show: boolean) {
    if (show) {
      $('#ui-avatar-crop-modal').modal({
        backdrop: 'static'
      });
    } else {
      $('#ui-avatar-crop-modal').modal('hide');
    }
  }

  saveModal (evt) {
    this.showAvatarModal(false);
  }

}
