import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeMapper } from 'src/app/shared/@mappers/member-mapper';
import { memberApiData } from 'src/app/shared/@mock/members.mock';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MemberService } from 'src/app/shared/services/member.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

import { AssignTaskComponent } from './assign-task.component';

fdescribe('AssignTaskComponent', () => {
  let component: AssignTaskComponent;
  let fixture: ComponentFixture<AssignTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignTaskComponent],
      imports: [ ReactiveFormsModule ],
      providers:[FormBuilder, MemberService, AlertService, TasksService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use member id  as trackBy value', () => {
    const member = EmployeeMapper.getAllEmployeesIdsAndNames([memberApiData])[0];
    expect(component.trackByMemberId(0, member)).toEqual(member.id);
  });
});
