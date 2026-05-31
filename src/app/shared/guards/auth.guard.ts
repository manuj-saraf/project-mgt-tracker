import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor( private memberService : MemberService, private router : Router){}
  
  canActivate(): boolean{
    const currentUser = this.memberService.getCurrentUser();
    if (currentUser) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
