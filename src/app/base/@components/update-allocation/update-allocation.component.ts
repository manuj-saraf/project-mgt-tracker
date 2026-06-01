import { ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeAllocationUI, EmployeeUI } from '../../../shared/@models/employee-ui.model';
import { MemberService } from '../../../shared/services/member.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-update-allocation',
  standalone: false,
  templateUrl: './update-allocation.component.html',
  styleUrls: ['./update-allocation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAllocationComponent implements OnInit, OnDestroy {
  selectedMember: EmployeeAllocationUI | null = null;
  currentUser: EmployeeUI | null = null;
  saveDisabled: boolean = true;
  
  memberForm!: FormGroup;
  allocationForm!: FormGroup;

  destroy$ = new Subject<void>();
  
  constructor(private readonly fb : FormBuilder, private readonly alertService :AlertService, private readonly memberService :MemberService) {
  }

  ngOnInit(): void {
    this.createForms();
  }
  
  createForms(): void {
    this.memberForm = this.fb.group({
      member:[null, [Validators.required, Validators.pattern(/^\d{1,6}$/)]]
    });

    this.allocationForm = this.fb.group({
      id: [ '', [Validators.required]],
      currentProjectEndDate: [{value: '', disabled: true}],
      allocationPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.memberForm.get('member')?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(()=>{
      this.removeInvalidUserError();    
    })
  }

  removeInvalidUserError():void {
    const memberIdCtrl = this.memberForm.get('member');
    const errors = memberIdCtrl?.errors;
    if (errors?.['invalidUserId']) {      
      memberIdCtrl?.setErrors(null);
    }
  }

  onFetchMemberDetails(): void {
    const memberId = Number(this.memberForm.value.member);
    this.memberService.getMemberToUpdateAllocation(memberId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (member) => {this.onFetchMemberSuccess(member)},
      error: ()=> { this.onFetchMemberError();}
    })
  }

  onFetchMemberSuccess(member: EmployeeAllocationUI): void {
    this.selectedMember = member;
    const currentDate = new Date();
    const memberAllocationEndDate = new Date(member.currentProjectEndDate);
    const updatedAllocation = (memberAllocationEndDate.getTime() < currentDate.getTime()) ? 0: 100;
    this.allocationForm.reset({
      id: member.id,
      currentProjectEndDate : member.currentProjectEndDate,
      allocationPercentage: updatedAllocation
    });
    this.allocationForm.get('currentProjectEndDate')?.disable();
    this.allocationForm.get('allocationPercentage')?.disable();
    this.saveDisabled = updatedAllocation === this.selectedMember?.allocationPercentage;
  }

  onFetchMemberError(): void {
    const memberCtrl = this.memberForm.get('member');
    memberCtrl?.setErrors({...memberCtrl?.errors, invalidUserId: true});
    memberCtrl?.markAsTouched();
    this.selectedMember = null;
  }


  onSave(): void {
    if(this.allocationForm.valid && this.selectedMember) {
      const values = this.allocationForm.getRawValue();
      const name = this.selectedMember.name;
      this.memberService.updateMember({ name, ...values }).pipe().subscribe(()=>{this.onAllocationUpdateSuccess()});
    }
  }

  onReset(): void {
    this.selectedMember = null;
    this.memberForm.reset();
    this.allocationForm.reset();
  }

  onAllocationUpdateSuccess(): void {
    this.selectedMember = null;
    this.memberForm.reset();
    this.alertService.showAlert('Member Allocation updated successfully! ', 'success');
  }

  ngOnDestroy(){
    this.alertService.hideAlert();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
