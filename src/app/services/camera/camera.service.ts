import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { LoadingService } from '../loading/loading.service';
import { ActionSheetController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public chosenPicture: any;

  constructor(
    private camera: Camera,
    private platform: Platform,
    private crop: Crop,
    private base64: Base64,
    private loadingService: LoadingService,
    private actionsheetCtrl: ActionSheetController
  ) {}

  getPictureFromCamera(crop: boolean) {
    return this.getImage(this.camera.PictureSourceType.CAMERA, crop);
  }

  getPictureFromPhotoLibrary(crop: boolean) {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY, crop);
  }

  async getImage(pictureSourceType: any, crop = true) {
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    };

    // If set to crop, restricts the image to a square of 600 by 600
    if (crop) {
      options['targetWidth'] = 700;
      options['targetHeight'] = 700;
    }
    return this.camera
      .getPicture(options)
      .then(
        fileUri => {
          return this.crop.crop('file://' + fileUri, {
            quality: 75,
            targetWidth: -1,
            targetHeight: -1,
          });
        },
        error => {
          console.log('CAMERA ERROR -> ' + JSON.stringify(error));
        }
      )
      .then((path: any) => {
        return this.base64.encodeFile(path);
      })
      .then(image => {
        return image;
      });
  }

  async changePicture(event?: any) {
    if (event) event.preventDefault();
    const actionsheetCtrl = await this.actionsheetCtrl.create({
      header: 'Upload picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
        },
      ],
    });
    return await actionsheetCtrl.present();
  }

  async takePicture() {
    await this.loadingService.show();
    try {
      const picture = await this.getPictureFromCamera(true);
      if (picture) {
        const quality = 6 < parseFloat(this.getImageSize(picture)) ? 0.5 : 0.8;
        this.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.getImageSize(picture)) > parseFloat(this.getImageSize(data))
              ? data
              : picture;
        });
      } else {
        await this.loadingService.hide();
      }
      await this.loadingService.hide();
    } catch (error) {
      await this.loadingService.hide();
      alert(error);
    }
  }

  async getPicture() {
    await this.loadingService.show();
    try {
      const picture = await this.getPictureFromPhotoLibrary(true);
      if (picture) {
        const quality = 6 < parseFloat(this.getImageSize(picture)) ? 0.5 : 0.8;
        this.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.getImageSize(picture)) > parseFloat(this.getImageSize(data))
              ? data
              : picture;
        });
      } else {
        await this.loadingService.hide();
      }
      await this.loadingService.hide();
    } catch (error) {
      await this.loadingService.hide();
      alert(error);
    }
  }

  generateFromImage(img: any, quality: any, callback: any) {
    const canvas: any = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl);
    };
    image.src = img;
  }

  getImageSize(data_url: any) {
    var head = 'data:image/jpeg;base64,';
    return (((data_url.length - head.length) * 3) / 4 / (1024 * 1024)).toFixed(4);
  }
}
