import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterbookingsPageRoutingModule } from './filterbookings-routing.module';

import { FilterbookingsPage } from './filterbookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterbookingsPageRoutingModule
  ],
  declarations: [FilterbookingsPage]
})
export class FilterbookingsPageModule {}
