import { NgModule } from '@angular/core';
import { PreventClickFallbackDirective } from './prevent-click-fallback.directive';



@NgModule({
  declarations: [PreventClickFallbackDirective],
  exports: [PreventClickFallbackDirective]
})
export class PreventClickFallbackModule { }
