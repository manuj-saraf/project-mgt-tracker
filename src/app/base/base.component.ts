import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: false
})
export class BaseComponent {
  private route = inject(ActivatedRoute);

  get hasChildRoute(): boolean {
    return this.route.children.length > 0;
  }
}
