import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BottomtabsComponent } from '../components/bottomtabs/bottomtabs.component';
import { ListCardComponent } from '../components/list-card/list-card.component';

@NgModule({
  declarations: [
    BottomtabsComponent,
    ListCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    BottomtabsComponent,
    ListCardComponent,
    CommonModule
  ]
})
export class SharedModule { }
