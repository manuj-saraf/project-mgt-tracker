import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';

export const authGuard = () => {
  const memberService = inject(MemberService);
  const router = inject(Router);

  const currentUser = memberService.getCurrentUser();

  if (currentUser) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
