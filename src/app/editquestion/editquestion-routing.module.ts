import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditquestionPage } from './editquestion.page';

const routes: Routes = [
  {
    path: '',
    component: EditquestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditquestionPageRoutingModule {}
