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
  public nobodyColor:string = "#efefef";
  public winColor:string = "blue";
  public boardColor:string = "#7a93c0";

  private turnCounter:number = 1;
  private isNotOver: boolean = true;

  private circlesArr: ColOperations[];

  private actualState: Owner[][] = [];

  private colLoad:number[] = new Array(this.colsNumber).fill(0);

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private actualStateInit(){
    for(let i=0;i<this.colsNumber;i++){
      this.actualState.push(new Array(this.rowsNumber).fill(0));
    }
  }

  ionViewDidLoad() {

    this.actualStateInit();

    this.circlesArr = this.circles.toArray();

  }

  private playerColor(): string{
    return this.player == 1 ? this.player1Color : this.player2Color;
  }

  resetGame(){
    this.actualState.length = 0;
    this.actualStateInit();

    //Resetting the values :
    this.player = 1;
    this.turnCounter = 1;
    this.colLoad = new Array(this.colsNumber).fill(0);
    this.isNotOver = true;

    //Changing the view :
    this.turnEl.nativeElement.textContent = `TURN ${this.turnCounter}`;

    this.circles.forEach(cir => {
      //Clearing the background :
      cir.elRef.nativeElement.style.backgroundColor =  this.boardColor;
      //Clearing the circles:
      cir.elRef.nativeElement.children[0].children[0].style.backgroundColor =  this.nobodyColor;
    });

  }

  //for ngFor in view
  createRange(number: number){
    var items: number[] = [];
    for(var i = 0; i < number; i++){
      items.push(i);
    }
    return items;
  }

  private calcPos(col,row): number {
    return (row*this.colsNumber + col)
  }

  isGameOver(r: number,c: number){

    let near = 0;
    let owner: Owner = this.actualState[c][r] ;

    let winningCir: ColOperations[] = [];

    // ****
    // <- ***r
    for(let i=c-1;i>=0;i--)
    {
      if(owner == this.actualState[i][r])
      {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(i,r)]);
      }
      else break;
    }

    // -> r***
    for(let i=c+1;i<this.colsNumber;i++)
    {
      if(owner == this.actualState[i][r]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(i,r)]);
      }
      else break;
    }

    if(near == 3) {
      winningCir.push(this.circlesArr[this.calcPos(c,r)]);
      return winningCir;
    }
    winningCir.length = 0;

    // *
    // *
    // *
    // *

    //    *
    //    *
    // ^  *
    // |  r
    near = 0;
    for(let i=r-1;i>=0;i--)
    {
      if(owner == this.actualState[c][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(c,i)]);
      }
      else break;
    }

    // |  r
    // V  *
    //    *
    //    *
    for(let i=r+1;i<this.rowsNumber;i++)
    {
      if(owner == this.actualState[c][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(c,i)]);
      }
      else break;
    }

    if(near == 3) {
      winningCir.push(this.circlesArr[this.calcPos(c,r)]);
      return winningCir;
    }
    winningCir.length = 0;

    // *
    //  *
    //   *
    //    *
    near = 0;

    // *
    //  *
    //   *    <- ^
    //    x      |
    let i = r-1;
    for(let j=c-1;j>=0;j--) {
      if (owner == this.actualState[j][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(j,i)]);
      }
      else break;
      i--;
    }


    // x
    //  *
    //   *    -> |
    //    *      V
    i = r+1;
    for(let j=c+1;j<this.colsNumber;j++) {
      if (owner == this.actualState[j][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(j,i)]);
      }
      else break;
      i++;
    }

    if(near == 3) {
      winningCir.push(this.circlesArr[this.calcPos(c,r)]);
      return winningCir;
    }
    winningCir.length = 0;

    //    *
    //   *
    //  *
    // *
    near = 0;

    //    *
    //   *
    //  *    -> ^
    // x        |

    i = r-1;
    for(let j=c+1;j<this.colsNumber;j++) {
      if (owner == this.actualState[j][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(j,i)]);
      }
      else break;
      i--;
    }

    //    x
    //   *
    //  *    <- |
    // *        V

    i = r+1;
    for(let j=c-1;j<this.colsNumber;j--) {
      if (owner == this.actualState[j][i]) {
        near++;
        winningCir.push(this.circlesArr[this.calcPos(j,i)]);
      }
      else break;
      i++;
    }

    if(near == 3) {
      winningCir.push(this.circlesArr[this.calcPos(c,r)]);
      return winningCir;
    }
    winningCir.length = 0;

    return false;
  }

  animate(rowIndex:number, column:number)
  {

    if(this.isNotOver)
    {
      //If we click for collumn which is overloaded (have 6 colored circles) :
      if(this.colLoad[column] == this.rowsNumber) return;

      //Calculate next row to put new circle:
      let row:number = (this.rowsNumber-1) - this.colLoad[column];
      //Increase colum load :
      this.colLoad[column]++;

      //Find exact circle which will be colored :
      //let cir = this.circles.find( el => (el.rowNumber == row && el.colNumber == column));
      let cir:ColOperations = this.circlesArr[this.calcPos(column,row)];

      //Color this circle :
      cir.elRef.nativeElement.children[0].children[0].style.backgroundColor =  this.playerColor();

      //Changed actual state object :
      this.actualState[column][row] = this.player;
      //Check if the game is over if yes stop the game :
      let winningCir: ColOperations[] | false = this.isGameOver(row,column);
      if(winningCir) {
        this.isNotOver = false;
        winningCir.forEach( cir => {
          cir.elRef.nativeElement.style.backgroundColor = this.winColor;
        });
      }

      //Change actual player for another player :
      this.player = (this.player == 1 ? 2 : 1);
      //Increase turn counter :
      this.turnCounter++;

      //Show new turn number :
      this.turnEl.nativeElement.textContent = `TURN ${this.turnCounter}`;
    }
  }

}
