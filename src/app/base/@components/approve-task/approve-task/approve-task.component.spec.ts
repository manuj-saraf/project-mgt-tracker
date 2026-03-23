import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTaskComponent } from './approve-task.component';

describe('ApproveTaskComponent', () => {
  let component: ApproveTaskComponent;
  let fixture: ComponentFixture<ApproveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
