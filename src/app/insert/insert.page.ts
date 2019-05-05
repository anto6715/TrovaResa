import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {AlertController, NavController} from '@ionic/angular';
import {Md5} from 'ts-md5/dist/md5';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { ActivatedRoute } from "@angular/router";
import { ProductServiceService} from '../services/product-service.service';
import {Firebase} from '@ionic-native/firebase/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from "firebase";
import { WebView } from '@ionic-native/ionic-webview/ngx';


@Component({
  selector: 'app-insert',
  templateUrl: './insert.page.html',
  styleUrls: ['./insert.page.scss'],
})
export class InsertPage implements OnInit {

  product: Product = {} as Product;
  products: Product[] = [];
  myPhoto: any;
  id:number;
  check:false;
  cameraInfo:any;
  blobInfo:any;
  updateInfo: any;
  opt:number;

  constructor(private storage: Storage,
              public alertController: AlertController,
              private navCtrl: NavController,
              private camera: Camera,
              private route: ActivatedRoute,
              private productService: ProductServiceService,
              private fire: Firebase,
              private file: File,
              private webview: WebView) {
  }

  ngOnInit() {
    // @ts-ignore
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.opt =2; // prodottto modificato
      this.productService.getById(this.id).subscribe(product => {
        this.product = product;
        this.myPhoto = this.product.img;
      })
      /*this.storage.get('items').then((items) => {
        this.product= items[this.id];
        this.myPhoto = this.product.img;
      });*/
    } else {
      this.opt = 1; // nuovo prodotto
    }
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

  async save() {
    if (this.cameraInfo) {
      if (this.opt == 2) {
        var desertRef = firebase.storage().refFromURL(this.product.img);
        desertRef.delete().then(function() {
          console.log('Foto cancellata da firebase')
        }).catch(function(error) {
          alert('errore');
        });
      }
      try {
        this.blobInfo = await this.makeFileIntoBlob(this.cameraInfo);
        this.updateInfo = await this.uploadToFirebase(this.blobInfo);
        //this.myPhoto = uploadInfo.link;
      } catch (e) {
        console.log(e.message);
        alert("File Upload Error " + e.message);
      }
    } else {
        this.salva();
    }

  }



  salva(){
    if (this.opt = 1 ) { // nuovo prodotto
      this.productService.save(this.product).subscribe(product => {
        console.log(product);
        this.presentAlert('Prodotto salvato');
        this.navCtrl.navigateBack('/home');
      })
    } else { // modifica prodotto
        this.productService.update(this.product).subscribe(product => {
        console.log(product);
        this.presentAlert('Prodotto Modificato');
        this.navCtrl.navigateBack('/home');
      })

    }
  }

  async photo() {
   /* const options: CameraOptions = {
      quality: 50,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };*/
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    try {
      this.cameraInfo = await this.camera.getPicture();
      this.myPhoto = this.webview.convertFileSrc(this.cameraInfo);

      //this.myPhoto = uploadInfo.link;
    } catch (e) {
      console.log(e.message);
      alert("Image get error: " + e.message);
    }
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
          .resolveLocalFilesystemUrl(_imagePath)
          .then(fileEntry => {
            let { name, nativeURL } = fileEntry;

            // get the path..
            let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
            console.log("path", path);
            console.log("fileName", name);

            fileName = name;

            // we are provided the name, so now read the file into
            // a buffer
            return this.file.readAsArrayBuffer(path, name);
          })
          .then(buffer => {
            // get the buffer and make a blob to be saved
            let imgBlob = new Blob([buffer], {
              type: "image/jpeg"
            });
            console.log(imgBlob.type, imgBlob.size);
            resolve({
              fileName,
              imgBlob
            });
          })
          .catch(e => reject(e));
    });
  }

  uploadToFirebase(_imageBlobInfo) {
    console.log("uploadToFirebase");
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child("images/" + _imageBlobInfo.fileName).put(_imageBlobInfo.imgBlob);
    uploadTask.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
      uploadSnapshot.ref.getDownloadURL().then((downloadUrl) => {
        alert(downloadUrl);
        this.myPhoto = downloadUrl;
        this.product.img = downloadUrl;
        this.salva();
      })
    })


  }
}
