import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  declarations: [
    BaseComponent
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