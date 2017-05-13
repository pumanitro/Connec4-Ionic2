import {Component, QueryList, ViewChildren} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ColOperations } from './col-operations.directive';

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

  @ViewChildren(ColOperations) circles: QueryList<ColOperations>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    const col = 4;
    this.circles.forEach(cir => {
      if(cir.colNumber == 4)
        console.log(cir.elRef.nativeElement.style.backgroundColor = 'green');
    });
  }

  createRange(number: number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

}
