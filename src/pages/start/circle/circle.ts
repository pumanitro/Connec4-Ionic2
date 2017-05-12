import {Component, Input} from '@angular/core';

@Component({
  selector: 'circle',
  templateUrl: './circle.html'
})
export class Circle {
  @Input() size:number;
  @Input() color:string;
  @Input() centered:boolean;

  constructor() {
  }

}
