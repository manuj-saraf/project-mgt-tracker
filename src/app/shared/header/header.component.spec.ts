import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { defaultEmployees } from '../@config/employees';
import { EmployeeMapper } from '../@mappers/member-mapper';
import { allNavigationLinks } from 'src/app/base/base.helper';
import { memberApiData } from '../@mock/members.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const routerSpy = jasmine.createSpyObj('Router',['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [ 
        MemberService,
        {provide : Router, useValue: routerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
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

  it('should toggle menu', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
  });

  it('should close menu', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should use navInfo as trackBy value', () => {
    const navData = allNavigationLinks[0];
    expect(component.trackByFn(0, navData)).toEqual(navData);
  });

  it('should navigate user', () => {
    component.isMenuOpen = true;
    const routeUrl = component['navigationData'][0].route;
    component.navigate(routeUrl);

    expect(component['router'].navigate).toHaveBeenCalledWith([routeUrl]);
    expect(component.isMenuOpen).toBeFalse();
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
  
  it('should logout user', () => {
    component.isMenuOpen = true;
    component.logout();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/']);
  });
});
