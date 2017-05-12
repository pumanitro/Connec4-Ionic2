import {Component, Input} from '@angular/core';

@Component({
  selector: 'circle',
  templateUrl: './circle.html'
})
export class Circle {
  @Input() size:string;
  @Input() color:string;
  @Input() centered:boolean = true;

  constructor() {
  }

}
