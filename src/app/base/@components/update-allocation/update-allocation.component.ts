import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeUI } from '../../../shared/@models/employee-ui.model';
import { MemberService } from '../../../shared/services/member.service';
import { UserRoles } from '../../../shared/@config/user-roles';


@Component({
  selector: 'app-update-allocation',
  standalone: false,
  templateUrl: './update-allocation.component.html',
  styleUrl: './update-allocation.component.scss'
})
export class UpdateAllocationComponent {
  members: EmployeeUI[] = [];
  filteredMembers: EmployeeUI[] = [];
  selectedMember: EmployeeUI | null = null;
  currentUser: EmployeeUI | null = null;
  saveDisabled: boolean = true;
  memberForm!: FormGroup;
  allocationForm!: FormGroup;

  memberService = inject(MemberService);
  fb = inject(FormBuilder);
  
  constructor() {
    this.memberForm = this.fb.group({
      member:[null, Validators.required]
    });

    this.allocationForm = this.fb.group({
      id: [{value: '', disabled: true}],
      name: [{value: '', disabled: true}],
      currentProjectStartDate: [{value: '', disabled: true}],
      currentProjectEndDate: [ '', Validators.required],
      allocationPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }
  ngOnInit(): void {
    this.members = this.memberService.getMembers();
    this.currentUser = this.memberService.getCurrentUser();
    this.filterMembers();
    this.allocationForm.get('currentProjectEndDate')?.valueChanges.subscribe(endDt => {
      const today = new Date();
      const endDate = new Date(endDt);
      if(endDate < today) {
        this.allocationForm.get('allocationPercentage')?.setValue(0, { emitEvent: false });
      }else{
        this.allocationForm.get('allocationPercentage')?.setValue(100, { emitEvent: false });
      }
    });
    this.allocationForm.valueChanges.subscribe(() => {
      this.updateSaveButtonState();
    });
    
  }

  filterMembers(): void {
    if (!this.currentUser) {
      this.filteredMembers = [];
      return;
    }
    if(this.currentUser.role === UserRoles.Architect) {
      this.filteredMembers = this.members.filter(member => member.role !== UserRoles.Architect);
    }
    else if(this.currentUser.role === UserRoles.Manager) {
      this.filteredMembers = this.members.filter(member => ![UserRoles.Architect, UserRoles.Manager].includes(member.role));
    } else {
      this.filteredMembers = [];
    }
  }

  onCancel(): void {
    this.selectedMember = null;
    this.memberForm.reset();
    this.allocationForm.reset();
  }
  updateSaveButtonState(){
    if(!this.selectedMember){
      this.saveDisabled = true;
      return;
    }
    const formValue = this.allocationForm.getRawValue();
    const isAllocationChanged = formValue.currentProjectEndDate !== this.selectedMember.currentProjectEndDate || formValue.allocationPercentage !== this.selectedMember.allocationPercentage;
    this.saveDisabled = !this.allocationForm.valid || !isAllocationChanged;
  }

  onMemberSelect(): void {
    const memberId = this.memberForm.value.member;
    this.selectedMember = this.filteredMembers.find(m => m.id === +memberId) || null;
    if (this.selectedMember) {
      this.allocationForm.reset({
        id: this.selectedMember.id,
        name: this.selectedMember.name,
        currentProjectStartDate: this.selectedMember.currentProjectStartDate,
        currentProjectEndDate: this.selectedMember.currentProjectEndDate,
        allocationPercentage: this.selectedMember.allocationPercentage
      });
      this.allocationForm.get('id')?.disable();
      this.allocationForm.get('name')?.disable();
      this.allocationForm.get('currentProjectStartDate')?.disable();
      this.saveDisabled = true;
    }
  }

  onSave(): void {
    if(this.allocationForm.valid && this.selectedMember) {
      const values = this.allocationForm.value;
      this.memberService.updateMember({ ...this.selectedMember, ...values });
      this.selectedMember = null;
      this.memberForm.reset();
    }
  }
}
