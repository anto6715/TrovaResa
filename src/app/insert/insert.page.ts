import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {AlertController, NavController} from '@ionic/angular';
import {Md5} from 'ts-md5/dist/md5';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-insert',
  templateUrl: './insert.page.html',
  styleUrls: ['./insert.page.scss'],
})
export class InsertPage implements OnInit {

  product: Product = {} as Product;
  products: Product[] = [];
  myPhoto: any;
  constructor(private storage: Storage,
              public alertController: AlertController,
              private navCtrl: NavController,
              private camera: Camera,) {

  }

  ngOnInit() {
  }

  async presentAlert(string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: string,
      buttons: ['OK']
    });

    alert.present();
  }

  save() {
    let time = new Date();
    // @ts-ignore
    this.product.id = Md5.hashStr(time.toTimeString());
    this.storage.get('items').then((items) => {
      if (items) {
        this.products = items;
        this.products.push(this.product);
        this.storage.set('items', this.products).then((items) => {
          this.products = items;
          this.presentAlert('Prodotto salvato');
          this.navCtrl.navigateBack('/home')
        }, (error) => {
          this.presentAlert(error);
        });

      } else {
          this.products.push(this.product);
        this.storage.set('items', this.products).then((items) => {
          this.products = items;
          this.presentAlert('Prodotto salvato');
          this.navCtrl.navigateBack('/home')
        }, (error) => {
          this.presentAlert(error);
        });
      }})


  }

  photo() {
    const options: CameraOptions = {
      quality: 50,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myPhoto = 'data:image/jpeg;base64,' + imageData;
      this.product.photo = this.myPhoto;
    }, (err) => {
      // Handle error
      this.presentAlert(err);
    });
  }
}
