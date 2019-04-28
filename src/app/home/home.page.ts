import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Product } from '../models/product';
import {AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import {AlertController, NavController} from '@ionic/angular';
import {IonicStorageModule, Storage} from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private androidPermissions: AndroidPermissions,
              private camera: Camera,
              public alertController: AlertController,
              private storage: Storage,
              private navCtrl: NavController) {

    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);

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

    insert(){
        this.navCtrl.navigateForward('/insert')
    }

    list(){
      this.navCtrl.navigateForward('/list')
    }

}

