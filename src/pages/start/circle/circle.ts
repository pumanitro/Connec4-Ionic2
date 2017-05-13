import {Component, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'circle',
  templateUrl: './circle.html'
})
export class Circle {
  @Input() size:string|number;
  @Input() color:string;
  @Input() isCentered:boolean = true;
  @Input() isEqualSize:boolean = true;

  @ViewChild('circle') circle: ElementRef;

  constructor() {
  }

  ngAfterViewInit(){

    //protection against percentage width and height
    //e.g. width: 100% and height: 100% dotn have to be equal
    //with true circle size will be the smallest from width nad height
    if(this.isEqualSize){

      const widthPx: number = this.circle.nativeElement.clientWidth;
      const heightPx: number = this.circle.nativeElement.clientHeight;

      if(widthPx != heightPx) this.size = +Math.min(widthPx,heightPx);

      this.circle.nativeElement.style.width = this.size+'px';
      this.circle.nativeElement.style.height = this.size+'px';
    }

  }

}
