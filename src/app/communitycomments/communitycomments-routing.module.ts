import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunitycommentsPage } from './communitycomments.page';

const routes: Routes = [
  {
    path: '',
    component: CommunitycommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunitycommentsPageRoutingModule {}
