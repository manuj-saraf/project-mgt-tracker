import { ComponentFixture, TestBed } from '@angular/core/testing';
import { memberUIData, mockMemberFormData } from 'src/app/shared/@mock/members.mock';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

import { ViewTaskComponent } from './view-task.component';

describe('ViewTaskComponent', () => {
  let component: ViewTaskComponent;
  let fixture: ComponentFixture<ViewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTaskComponent],
      providers:[MemberService,TasksService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch pending tasks for logged in member ', () => {
    component['memberService'].addMember({...mockMemberFormData}).subscribe(res => {});
    component['memberService'].setCurrentUser({...memberUIData});
    fixture.detectChanges();
    spyOn(component,'onFetchCurrentUserSuccess').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.onFetchCurrentUserSuccess).toHaveBeenCalled();
  });

});
