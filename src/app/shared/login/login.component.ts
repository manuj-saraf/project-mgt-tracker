import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { defaultEmployees } from '../@config/employees';
import { UserRoles } from '../@config/user-roles';
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
    this.loginForm.get('userId')?.reset();
    const selectedType = type as UserRoles;
    if([UserRoles.Architect, UserRoles.Manager].includes(selectedType)){
      const selectedUserId = defaultEmployees.find(emp => emp.role === selectedType)?.id;
      this.loginForm.get('userId')?.setValue(selectedUserId);
    }
  }

  get userId() {
    return this.loginForm.get('userId');
  }


  onSubmit(): void {
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

    if (this.loginForm.valid) {
      const userIdValue = Number(this.loginForm.value.userId);
      const member = this.memberService.getMemberById(userIdValue);

      if (member) {
        this.memberService.setCurrentUser(member);
        this.router.navigate(['/home']);
      } else {
        this.userId?.setErrors({ ...this.userId?.errors, invalidUserId: true });
        this.userId?.markAsTouched();
      }
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
