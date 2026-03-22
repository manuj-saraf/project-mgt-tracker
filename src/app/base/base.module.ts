import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './base-routing.module';
import { AddMemberComponent } from './@components/add-member/add-member.component';

@NgModule({
  declarations: [
    BaseComponent,
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BaseRoutingModule
  ],
  exports: [
    BaseComponent
  ]
})
export class BaseModule { }