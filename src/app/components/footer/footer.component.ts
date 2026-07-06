import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideHouse, LucideMail, LucidePhone, LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly icons = { LucideHouse, LucideMail, LucidePhone, LucideMapPin };
  readonly year = new Date().getFullYear();
}