import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BooknowPageRoutingModule } from './booknow-routing.module';

import { BooknowPage } from './booknow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BooknowPageRoutingModule
  ],
  declarations: [BooknowPage]
})
export class BooknowPageModule {}
