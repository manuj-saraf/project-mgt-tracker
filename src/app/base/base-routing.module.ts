import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { authGuard } from '../shared/guards/auth.guard';
import { AddMemberComponent } from './@components/add-member/add-member.component';
import { ViewMemberComponent } from './@components/view-member/view-member.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'add-member',
        component: AddMemberComponent
      },
      {
        path: 'view-members',
        component: ViewMemberComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }