import {Directive, ElementRef, Input} from '@angular/core';

/**
 * Generated class for the ColOperations directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[col-operations]' // Attribute selector
})
export class ColOperations {

  @Input() rowNumber: number;
  @Input() colNumber: number;

  constructor(public elRef: ElementRef) {
  }

}
