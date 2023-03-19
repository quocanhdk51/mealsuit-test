import { FetchUserNameByIdModule } from '@pipes/fetch-user-name-by-id/fetch-user-name-by-id.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { NameAbbreviateModule } from '@pipes/name-abbreviate/name-abbreviate.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    UserAvatarComponent
  ],
  imports: [
    CommonModule,
    NameAbbreviateModule,
    FetchUserNameByIdModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports: [UserAvatarComponent]
})
export class UserAvatarModule { }
