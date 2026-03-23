import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../../../shared/services/member.service';
import { UserRoles } from '../../../shared/@config/user-roles';
import { Skills } from '../../../shared/@config/skills';
import { EmployeeUI } from '../../../shared/@models/employee-ui.model';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
  standalone: false
})
export class AddMemberComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private memberService = inject(MemberService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  skillsOptions = Object.values(Skills);
  userRoles = UserRoles;

  addMemberForm!: FormGroup;
  
constructor() {
  this.createForm();
}

ngOnDestroy(): void {
    this.alertService.hideAlert();
}
private createForm() {
  this.addMemberForm = this.fb.group({
    id: [{ value: 100000 + this.memberService.getMembersCount(), disabled: true }],
    role: [{ value: UserRoles.Member, disabled: true }],
    name: ['', [Validators.required]],
    experience: [0, [Validators.required, Validators.min(4), Validators.max(40)]],
    skills: [[], [this.atLeastThreeSkillsValidator]],
    profileDescription: ['', [Validators.maxLength(1000)]],
    currentProjectStartDate: ['', [Validators.required]],
    currentProjectEndDate: ['', [Validators.required]],
    allocationPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
  });
}

  private atLeastThreeSkillsValidator(control: AbstractControl) {
    if (control.value && control.value.length >= 3) {
      return null;
    }
    return { atLeastThree: true };
  }

  onSubmit(): void {
    if (this.addMemberForm.valid) {
      const formValue = this.addMemberForm.getRawValue();
      const newMember: EmployeeUI = {
        id: formValue.id,
        role: formValue.role,
        name: formValue.name,
        experience: formValue.experience,
        skills: formValue.skills,
        profileDescription: formValue.profileDescription,
        currentProjectStartDate: formValue.currentProjectStartDate,
        currentProjectEndDate: formValue.currentProjectEndDate,
        allocationPercentage: formValue.allocationPercentage
      };
      console.log("newMember", newMember); 
      this.memberService.addMember(newMember);
      this.alertService.showAlert('Member added successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.createForm();
      // this.router.navigate(['/home']);
    }
  }
}