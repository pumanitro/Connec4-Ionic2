import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Start } from '../start/start';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  gotoStartPage(){
    this.navCtrl.push(Start);
  }

}
