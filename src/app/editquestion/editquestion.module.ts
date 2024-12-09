import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditquestionPageRoutingModule } from './editquestion-routing.module';

import { EditquestionPage } from './editquestion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditquestionPageRoutingModule
  ],
  declarations: [EditquestionPage]
})
export class EditquestionPageModule {}
