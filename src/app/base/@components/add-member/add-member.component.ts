import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MemberService } from '../../../shared/services/member.service';
import { UserRoles } from '../../../shared/@config/user-roles';
import { Skills } from '../../../shared/@config/skills';
import { EmployeeDetailsFormData } from '../../../shared/@models/employee-ui.model';
import { AlertService } from '../../../shared/services/alert.service';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { dateAfterValidator, dateBeforeValidator } from 'src/app/shared/validators/date.validators';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMemberComponent implements OnInit, OnDestroy {
  skillsOptions = Object.values(Skills);
  addMemberForm!: FormGroup;
  destroy$ = new Subject<void>();
  
  constructor(private fb: FormBuilder, private memberService: MemberService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.addMemberForm = this.fb.group({
      role: [{ value: UserRoles.Member, disabled: true }],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)]],
      experience: [0, [Validators.required, Validators.min(4), Validators.max(40)]],
      skills: [[], [this.atLeastThreeSkillsValidator]],
      profileDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      currentProjectStartDate: ['', [Validators.required, dateBeforeValidator('currentProjectEndDate')]],
      currentProjectEndDate: ['', [Validators.required, dateAfterValidator('currentProjectStartDate')]], 
      allocationPercentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    const dependentControls = [this.addMemberForm.get('currentProjectStartDate'), this.addMemberForm.get('currentProjectEndDate')];
    dependentControls.forEach(control=> {
      control?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(()=>{
        dependentControls.forEach(ctrl=> {
          ctrl?.updateValueAndValidity({emitEvent: false});
        })
      });
    });
  }

  private atLeastThreeSkillsValidator(control: AbstractControl) {
    if (control.value && control.value.length >= 3) {
      return null;
    }
    return { atLeastThree: true };
  }

  trackByMemberSkill(index: number, skill: Skills): Skills {
    return skill;
  }

  onSubmit(): void {
    if (this.addMemberForm.valid) {
      const formValue = this.addMemberForm.getRawValue();
      const newMember: EmployeeDetailsFormData = {
        role: formValue.role,
        name: formValue.name,
        experience: formValue.experience,
        skills: formValue.skills,
        profileDescription: formValue.profileDescription,
        currentProjectStartDate: formValue.currentProjectStartDate,
        currentProjectEndDate: formValue.currentProjectEndDate,
        allocationPercentage: formValue.allocationPercentage
      };
      this.memberService.addMember(newMember).pipe(takeUntil(this.destroy$)).subscribe(() => { 
        this.onAddMemberSuccess(); 
      });
    }
  }

  onAddMemberSuccess() {
    this.alertService.showAlert('Member added successfully!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.onReset();
  }

  onReset(): void {
    this.addMemberForm.reset({
      role: UserRoles.Member,
      experience: 0,
      allocationPercentage: 0
    });
  }

  ngOnDestroy(): void {
    this.alertService.hideAlert();
    this.destroy$.next();
    this.destroy$.complete();
  }

}