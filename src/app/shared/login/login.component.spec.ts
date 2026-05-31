import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { defaultEmployees } from '../@config/employees';
import { UserRoles } from '../@config/user-roles';
import { MemberService } from '../services/member.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const routerSpy = jasmine.createSpyObj('Router',['navigate']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule ],
      providers:[FormBuilder, MemberService, {provide : Router, useValue: routerSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with userId control', () => {
    expect(component.loginForm.contains('userId')).toBeTruthy();
  });

  it('should validate userId as required', () => {
    const userId = component.loginForm.get('userId');
    userId?.setValue('');
    expect(userId?.valid).toBeFalsy();
  });

  it('should validate userId pattern', () => {
    const userId = component.loginForm.get('userId');
    userId?.setValue('abc123');
    expect(userId?.valid).toBeFalsy();
  });

  it('should validate userId max length', () => {
    const userId = component.loginForm.get('userId');
    userId?.setValue(1234567);
    expect(userId?.valid).toBeFalsy();
  });

  it('should accept valid userId', () => {
    const userId = component.loginForm.get('userId');
    userId?.setValue(100002);
    expect(userId?.valid).toBeTruthy();
  });

  it('should login as Manager ', () => {
    const userType = component.loginForm.get('userType');
    const userId = component.loginForm.get('userId');
    const managerRole = UserRoles.Manager as string;
    const managerId = defaultEmployees.find(emp => emp.role === UserRoles.Manager)?.id;
    userType?.setValue(managerRole);
    fixture.detectChanges();
    expect(userId?.value).toBe(managerId);
    spyOn(component,'onFetchMemberSuccess').and.callThrough();
    component.onSubmit();
    expect(component.onFetchMemberSuccess).toHaveBeenCalled();

  });

  it('should throw error for invalid member id login ', () => {
    const userType = component.loginForm.get('userType');
    const userId = component.loginForm.get('userId');
    const memberRole = UserRoles.Member as string;
    userType?.setValue(memberRole);
    userId?.setValue(999999);
    fixture.detectChanges();
    spyOn(component,'onFetchMemberError').and.callThrough();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.onFetchMemberError).toHaveBeenCalled();
  });

});
