import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Circle } from './circle/circle';

/**
 * Generated class for the Start page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class Start {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

}
