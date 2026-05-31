import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defaultEmployees } from '../@config/employees';
import { memberUIData, mockMemberFormData } from '../@mock/members.mock';
import { EmployeeAllocationUI, EmployeeIdentification } from '../@models/employee-ui.model';


import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberService);
    service['membersList'].next([...defaultEmployees]);
    service.setCurrentUser(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should generate new member Id correctly', () => {
    const id = service.getCurrentMemberId();
    expect(id).toBe(100000  + defaultEmployees.length);
  });

  it('should return member when searched by id and member exists ', fakeAsync(() => {
    let result;
    service.getMemberById(100000).subscribe(res=> result = res);
    tick();
    
    expect(result).toBeTruthy();
  }));

  it('should throw error when member not found on searching by id', fakeAsync(() => {
    let error!: any;

    service.getMemberById(200000).subscribe({
        next: ()=> fail('Expected error'),
        error : err=> {error =err}
    });

    tick();
    expect(error).toBeTruthy();
    expect(error.message).toBe('Api returned null data');
  }));

  it('should add new member', fakeAsync(() => {
    let response : any;
    service.addMember({...mockMemberFormData}).subscribe(res => response = res);

    tick();
    expect(response.message).toBe('Member added successfully');
  }));

  it('should get all members', fakeAsync(() => {
    let response : any;
    service.addMember({...mockMemberFormData}).subscribe(res => response = res);

    tick();
    service.getAllMembers().subscribe(res => response = res);
    expect(response[0]).toEqual(memberUIData);
  }));

  it('should get all member Ids and Names', fakeAsync(() => {
    let response : any;
    service.addMember({...mockMemberFormData}).subscribe(res => response = res);

    tick();
    service.getAllMemberIdsAndNames().subscribe(res => response = res);
    const memberInfo = {id: memberUIData.id, name: memberUIData.name} as EmployeeIdentification;
    expect(response[0]).toEqual(memberInfo);
  }));

  it('should throw error when member does not exist on getMemberToUpdateAllocation call', fakeAsync(() => {
    let error!: any;
    service.getMemberToUpdateAllocation(999999).subscribe({
        next: ()=> fail('Expected error'),
        error : err=> {error =err}
    });
    
    expect(error).toBeTruthy();
    expect(error.message).toBe('Api returned null data');
  }));

  it('should update member allocation', fakeAsync(() => {
    let response : any;
    const memberToUpdate = {id: 100000, name: '', currentProjectEndDate: '30/05/2026', allocationPercentage: 0 } as EmployeeAllocationUI;

    service.updateMember(memberToUpdate).subscribe(res => response = res);

    tick();
    expect(response.message).toBe('Member updated successfullly!');
  }));

  
  it('should set and get user', fakeAsync(() => {
    let response : any;

    service.setCurrentUser({...memberUIData});
    service.getCurrentUserDetails().subscribe(res => response = res);
    tick();

    const obs$ = service.getCurrentUserObservable();
    expect(response).toEqual(memberUIData);
    expect(service.getCurrentUser()).toEqual(memberUIData);
    expect(obs$).toBeDefined();
  }));

});
