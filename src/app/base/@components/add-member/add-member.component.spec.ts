import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';

import { AddMemberComponent } from './add-member.component';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMemberComponent ],
      imports: [ ReactiveFormsModule ],
      providers:[ FormBuilder, AlertService, MemberService, ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add member ', () => {
    component.addMemberForm.patchValue({...mockMemberFormData});
    fixture.detectChanges();
    spyOn(component,'onAddMemberSuccess').and.callThrough();
    component.onSubmit();
    expect(component.onAddMemberSuccess).toHaveBeenCalled();
  });

});