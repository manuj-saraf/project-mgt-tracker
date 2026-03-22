import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  appTitle = 'Project Management Tracker';
  projectDescription = 'This is a project management tracker. In this the project manager can add team members, add, assign and approve tasks, update allocation. The team member can view the tasks assigned in which different team members can login.';

  constructor(private fb: FormBuilder) {
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
    if (this.loginForm.valid) {
      const userId = this.loginForm.value.userId;
      console.log('Login attempt with User ID:', userId);
      // TODO: Implement login logic
    }
  }
}
