import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule ]
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
    userId?.setValue('1234567');
    expect(userId?.valid).toBeFalsy();
  });

  it('should accept valid userId', () => {
    const userId = component.loginForm.get('userId');
    userId?.setValue('123456');
    expect(userId?.valid).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    component.loginForm.get('userId')?.setValue('');
    expect(component.isSubmitDisabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.get('userId')?.setValue('123456');
    expect(component.isSubmitDisabled).toBeFalsy();
  });
});
