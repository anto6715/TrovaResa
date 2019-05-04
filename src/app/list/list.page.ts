import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ImageModalPage} from '../image-modal/image-modal.page';
import {NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  product: Product = {} as Product;
  products: Product[] = [];
  productsViews: Product[] = [];
  //temp: Product[] = [];
  filter: any;
  number: any;
  flag = false;

  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };
  constructor(private storage: Storage,
              public alertController: AlertController,
              private modalController: ModalController,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.reset();
  }


  filtra() {
    console.log(this.number);
    if (this.number == 1 || !this.number) {

      if (this.filter) {
        this.productsViews = this.products.filter(x => this.similarity(x.title, this.filter));
      } else {
        this.reset();
      }
    }

    if (this.number == 2) {

      if (this.filter) {
        this.productsViews = this.products.filter(x => this.similarity(x.name, this.filter));
      } else {
        this.reset();
      }
    }

    if (this.number == 3) {

      if (this.filter) {
        this.productsViews = this.products.filter(x => x.num == this.filter);
      } else {
        this.reset();
      }
    }



  }
  similarity(s1, s2) {

    if (s1) {
      var longer = s1;
      var shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
    } else return false;

    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    var cost = (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    if (cost >= 0.5)
      return true;
    else return false;
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                  costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }


  reset() {
    this.storage.get('items').then((items) => {
      this.products = items;
      this.productsViews = this.products;
      this.filter = null;
    });
  }


  delete(id) {
    console.log(id);
    let i = this.products.findIndex( x => x.id ==id);
    console.log(i);
    this.products.splice(i,1);
    this.storage.set('items', this.products).then((items) => {
      this.products = items;
      this.productsViews = this.products;
      this.presentAlert('Prodotto eliminato');
    }, (error) => {
      this.presentAlert(error);
    });
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      header: 'Attenzione!',
      message: 'Sicuro di voler eliminare?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Elimina',
          handler: () => {
            this.delete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(string) {
    const alert = await this.alertController.create({
      header: 'Messaggio:',
      message: string,
      buttons: ['OK']
    });

    alert.present();
  }

    show__hide_search() {
        this.flag = !this.flag;
    }

  openPreview(img) {
    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: img
      }
    }).then(modal => {
      modal.present();
    });
  }

  modify(id){
    console.log(id);
    let i =this.products.findIndex( x => x.id ==id);
    this.navCtrl.navigateForward('/insert/'+i);
  }
}
