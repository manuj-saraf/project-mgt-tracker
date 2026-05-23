import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { UserRoles } from '../@config/user-roles';
import { EmployeeUI } from '../@models/employee-ui.model';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm!: FormGroup;
  destroy$ = new Subject<void>();

  constructor(private fb :FormBuilder,private memberService :MemberService, private router :Router  ) {}
  
  ngOnInit(): void {
    this.createForm();  
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      userType:['',Validators.required],
      userId: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,6}$/),
        Validators.maxLength(6)
      ]]
    });
    this.loginForm.get('userType')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((type: string) => {
      this.onUserTypeChange(type);
    });
  }
  
  onUserTypeChange(type: string){
    this.userId?.reset();
    const selectedType = type as UserRoles;
    if([UserRoles.Architect, UserRoles.Manager].includes(selectedType)){
      const selectedUserId = defaultEmployees.find(emp => emp.role === selectedType)?.id;
      this.userId?.setValue(selectedUserId);
    }
  }

  get userId() {
    return this.loginForm.get('userId');
  }


  onSubmit(): void {
    this.removeInvalidUserIdError();

    if (this.loginForm.valid) {
      const userIdValue = Number(this.loginForm.value.userId);

      this.memberService.getMemberById(userIdValue)?.pipe(takeUntil(this.destroy$)).subscribe({
        next: (member)=> {this.onFetchMemberSuccess(member);},
        error: ()=> { this.onFetchMemberError();}
      });
    }
  }

  removeInvalidUserIdError() : void {
    // keep existing controls but remove only invalidUserId error
    const errors = this.userId?.errors;
    if (errors?.['invalidUserId']) {
      delete errors['invalidUserId'];
      const remainingErrorKeys = Object.keys(errors);
      if (remainingErrorKeys.length) {
        this.userId?.setErrors(errors);
      } else {
        this.userId?.setErrors(null);
      }
    }
  }

  onFetchMemberSuccess(member: EmployeeUI) : void {
    this.memberService.setCurrentUser(member);
    const redirectionMapper = new Map<UserRoles, string>([
      [UserRoles.Architect, "/home"],
      [UserRoles.Manager, "/home"],
      [UserRoles.Member, "/home/view-task"]
    ])
    const redirectTo = redirectionMapper.get(member.role);
    this.router.navigate([redirectTo]);
  }

  onFetchMemberError(): void {
    this.userId?.setErrors({ ...this.userId?.errors, invalidUserId: true });
    this.userId?.markAsTouched();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
