import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private memberService = inject(MemberService);
  private router = inject(Router);

  loginForm: FormGroup;
  appTitle = 'Project Management Tracker';
  projectDescription = 'This is a project management tracker. In this the project manager can add team members, add, assign and approve tasks, update allocation. The team member can view the different tasks assigned to them.';

  constructor() {
    this.loginForm = this.fb.group({
      userId: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,6}$/),
        Validators.maxLength(6)
      ]]
    });
  }

  get userId() {
    return this.loginForm.get('userId');
  }

  get isSubmitDisabled(): boolean {
    return this.loginForm.invalid;
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
}
