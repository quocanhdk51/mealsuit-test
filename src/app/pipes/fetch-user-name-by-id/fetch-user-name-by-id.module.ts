import { NgModule } from '@angular/core';
import { FetchUserNameByIdPipe } from './fetch-user-name-by-id.pipe';

@NgModule({
  declarations: [FetchUserNameByIdPipe],
  exports: [FetchUserNameByIdPipe]
})
export class FetchUserNameByIdModule { }
