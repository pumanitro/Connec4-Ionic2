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

  private player:number = 1;
  private rowsNumber: number = 6;
  private player1Color:string = "yellow";
  private player2Color:string = "green";

  private colLoad:number[] = new Array(this.rowsNumber).fill(0);

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  private playerColor(): string{
    return this.player == 1 ? this.player1Color : this.player2Color;
  }

  createRange(number: number){
    var items: number[] = [];
    for(var i = 0; i < number; i++){
      items.push(i);
    }
    return items;
  }

  animate(rowIndex:number, column:number)
  {

    if(this.colLoad[column] == this.rowsNumber) return;

    let row:number = (this.rowsNumber-1) - this.colLoad[column];
    this.colLoad[column]++;

    let cir = this.circles.find( el => (el.rowNumber == row && el.colNumber == column));

    cir.elRef.nativeElement.children[0].children[0].style.backgroundColor =  this.playerColor();

    this.player = (this.player == 1 ? 2 : 1);

    //console.log(column);
  }

}
