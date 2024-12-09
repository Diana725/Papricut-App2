import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunitycommentsPageRoutingModule } from './communitycomments-routing.module';

import { CommunitycommentsPage } from './communitycomments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunitycommentsPageRoutingModule
  ],
  declarations: [CommunitycommentsPage]
})
export class CommunitycommentsPageModule {}
