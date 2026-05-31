import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultEmployees } from '../shared/@config/employees';
import { EmployeeMapper } from '../shared/@mappers/member-mapper';
import { memberApiData } from '../shared/@mock/members.mock';
import { AlertService } from '../shared/services/alert.service';
import { MemberService } from '../shared/services/member.service';
import { BaseComponent } from './base.component';
import { allNavigationLinks } from './base.helper';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  const routerSpy = jasmine.createSpyObj('Router',['navigate']);
const activatedRouteMock = {
  children :[]
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseComponent ],
      providers: [
         MemberService,
         AlertService,
        {provide : Router, useValue: routerSpy},
        {provide : ActivatedRoute, useValue: activatedRouteMock},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    component.currentUser = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should load members on init', () => {
    const mgrData = EmployeeMapper.convertEmployeeToUIModel([defaultEmployees[1]])[0];
    component['memberService'].setCurrentUser(mgrData)
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.currentUser).toEqual(mgrData);

    const navLinksForMgr = component.navigationLinks;
    expect(navLinksForMgr.length).toEqual(allNavigationLinks.length -1);
  });

  
  
  it('get Navigation link when logged in as member', () => {
    const memberData = EmployeeMapper.convertEmployeeToUIModel([memberApiData])[0];
    component['memberService'].setCurrentUser(memberData)
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.currentUser).toEqual(memberData);

    const navLinksForMgr = component.navigationLinks;
    expect(navLinksForMgr.length).toEqual(1);
  });

  
  it('should use navInfo label as trackBy value', () => {
    const navData = allNavigationLinks[0];
    expect(component.trackByFn(0, navData)).toEqual(navData.label);
  });
  
  it('should navigate user', () => {
    const routeUrl = component['navigationData'][0].route;
    component.navigate(routeUrl);
    expect(component['router'].navigate).toHaveBeenCalledWith([routeUrl]);
  });

});
