import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { memberUIData, mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';

import { UpdateAllocationComponent } from './update-allocation.component';

describe('UpdateAllocationComponent', () => {
  let component: UpdateAllocationComponent;
  let fixture: ComponentFixture<UpdateAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAllocationComponent],
      imports: [ ReactiveFormsModule ],
      providers: [FormBuilder, MemberService, AlertService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAllocationComponent);
    component = fixture.componentInstance;
    component.currentUser = null;
    component.selectedMember = null;
    component.saveDisabled = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error if non existant member id is entered to update allocation ', () => {
    component.memberForm.patchValue({member: 999999});
    spyOn(component,'onFetchMemberError').and.callThrough();
    component.onFetchMemberDetails();
    fixture.detectChanges();
    expect(component.onFetchMemberError).toHaveBeenCalled();
  });

  it('should fetch member for valid member id to update allocation ', () => {
    component['memberService'].addMember({...mockMemberFormData}).subscribe(res => {});
    component['memberService'].setCurrentUser({...memberUIData});
    fixture.detectChanges();
    component.memberForm.patchValue({member: memberUIData.id});
    spyOn(component,'onFetchMemberSuccess').and.callThrough();
    component.onFetchMemberDetails();
    fixture.detectChanges();
    expect(component.onFetchMemberSuccess).toHaveBeenCalled();

  });

  it('should update allocation ', () => {
    component['memberService'].addMember({...mockMemberFormData}).subscribe(res => {});
    component['memberService'].setCurrentUser({...memberUIData});
    fixture.detectChanges();
    component.memberForm.patchValue({member: memberUIData.id});
    component.onFetchMemberDetails();
    fixture.detectChanges();
    spyOn(component,'onAllocationUpdateSuccess').and.callThrough();
    component.onSave();
    expect(component.onAllocationUpdateSuccess).toHaveBeenCalled();
    
  });

  it('should reset forms ', () => {
    component['memberService'].addMember({...mockMemberFormData}).subscribe(res => {});
    component['memberService'].setCurrentUser({...memberUIData});
    fixture.detectChanges();
    component.memberForm.patchValue({member: memberUIData.id});
    component.onFetchMemberDetails();
    fixture.detectChanges();
    component.onReset();
    expect(component.selectedMember ).toBe(null);
    
  });

});
