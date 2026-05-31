import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { MemberService } from 'src/app/shared/services/member.service';

import { ViewMemberComponent } from './view-member.component';

describe('ViewMemberComponent', () => {
  let component: ViewMemberComponent;
  let fixture: ComponentFixture<ViewMemberComponent>;

  const addMultipleMembers = ()=>{
    const firstMember = {...mockMemberFormData};
    const secondMember = {...mockMemberFormData, name: 'Member2', experience: firstMember.experience +1 };
    [firstMember, secondMember].forEach(memberFormData=>{
        component['memberService'].addMember(memberFormData).subscribe((res) => {});
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMemberComponent],
      providers: [MemberService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMemberComponent);
    component = fixture.componentInstance;
    addMultipleMembers(); // Multiple members added for sort functionality
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
