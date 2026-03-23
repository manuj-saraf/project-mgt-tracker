import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './base-routing.module';
import { AddMemberComponent } from './@components/add-member/add-member.component';
import { ViewMemberComponent } from './@components/view-member/view-member.component';
import { AssignTaskComponent } from './@components/assign-task/assign-task/assign-task.component';
import { ApproveTaskComponent } from './@components/approve-task/approve-task/approve-task.component';
import { ViewTaskComponent } from './@components/view-task/view-task/view-task.component';
import { UpdateAllocationComponent } from './@components/update-allocation/update-allocation/update-allocation.component';

@NgModule({
  declarations: [
    BaseComponent,
    AddMemberComponent,
    ViewMemberComponent,
    AssignTaskComponent,
    ApproveTaskComponent,
    ViewTaskComponent,
    UpdateAllocationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BaseRoutingModule
  ],
  exports: [
    BaseComponent
  ]
})
export class BaseModule { }