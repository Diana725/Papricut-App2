import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterbookingsPage } from './filterbookings.page';

const routes: Routes = [
  {
    path: '',
    component: FilterbookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterbookingsPageRoutingModule {}
