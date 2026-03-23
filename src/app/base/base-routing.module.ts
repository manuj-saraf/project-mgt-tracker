import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { authGuard } from '../shared/guards/auth.guard';
import { AddMemberComponent } from './@components/add-member/add-member.component';
import { ViewMemberComponent } from './@components/view-member/view-member.component';
import { AssignTaskComponent } from './@components/assign-task/assign-task.component';
import { ApproveTaskComponent } from './@components/approve-task/approve-task.component';
import { ViewTaskComponent } from './@components/view-task/view-task.component';
import { UpdateAllocationComponent } from './@components/update-allocation/update-allocation.component';

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
      },
      {
        path: 'assign-task',
        component: AssignTaskComponent
      },
      {
        path: 'approve-task',
        component: ApproveTaskComponent
      },
      {
        path: 'view-task',
        component: ViewTaskComponent
      },
      {
        path: 'update-allocation',
        component: UpdateAllocationComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }