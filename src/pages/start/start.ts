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
  }

  createRange(number: number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  animate(rowIndex:number, colIndex:number)
  {
    let firstColCircle;

    this.circles.forEach(el => {

      if(el.rowNumber == rowIndex && el.colNumber == colIndex) firstColCircle = el.colNumber;

    });

    console.log(firstColCircle);
  }

}
