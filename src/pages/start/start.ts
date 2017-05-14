import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ColOperations } from './col-operations.directive';

/**
 * Generated class for the Start page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export enum Owner{
  Nobody,
  Player1,
  Player2
}

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class Start {

  @ViewChildren(ColOperations) circles: QueryList<ColOperations>;
  @ViewChild('turnEl') turnEl: ElementRef;

  private player:number = 1;
  private rowsNumber: number = 6;
  public colsNumber:number = 7;
  private player1Color:string = "yellow";
  private player2Color:string = "green";
  private turnCounter:number = 1;

  private actualState: Owner[][] = [];

  private colLoad:number[] = new Array(this.colsNumber).fill(0);

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private actualStateInit(){
    for(let i=0;i<this.rowsNumber;i++){
      this.actualState.push(new Array(this.colsNumber).fill(0));
    }
  }

  ionViewDidLoad() {

    this.actualStateInit();

  }

  private playerColor(): string{
    return this.player == 1 ? this.player1Color : this.player2Color;
  }

  //for ngFor in view
  createRange(number: number){
    var items: number[] = [];
    for(var i = 0; i < number; i++){
      items.push(i);
    }
    return items;
  }

  isGameOver(x,y){

    let near = 0;

    // ****
    // <- ***x
    for(let i=0;i<this.rowsNumber;i++)
    {

    }


    // *
    // *
    // *
    // *

    // *
    //  *
    //   *
    //    *


    //    *
    //   *
    //  *
    // *


  }

  animate(rowIndex:number, column:number)
  {

    //If we click for collumn which is overloaded (have 6 colored circles) :
    if(this.colLoad[column] == this.rowsNumber) return;

    //Calculate next row to put new circle:
    let row:number = (this.rowsNumber-1) - this.colLoad[column];
    //Increase colum load :
    this.colLoad[column]++;

    //Find exact circle which will be colored :
    let cir = this.circles.find( el => (el.rowNumber == row && el.colNumber == column));

    //Color this circle :
    cir.elRef.nativeElement.children[0].children[0].style.backgroundColor =  this.playerColor();

    //Changed actual state object :
    this.actualState[row][column] = this.player;
    //Change actual player for another player :
    this.player = (this.player == 1 ? 2 : 1);
    //Increase turn counter :
    this.turnCounter++;

    //Show new turn number :
    this.turnEl.nativeElement.textContent = `TURN ${this.turnCounter}`;

    //console.log(column);
  }

}
