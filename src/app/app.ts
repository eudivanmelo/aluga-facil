import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { NgClass } from '@angular/common';
import { ToastService } from './core/services/toast.service';
import { 
  LucideCheck, 
  LucideCircleAlert, 
  LucideInfo, 
  LucideX 
} from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent, 
    NgClass, 
    LucideCheck, 
    LucideCircleAlert, 
    LucideInfo, 
    LucideX
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aluga-facil');
  protected readonly toastService = inject(ToastService);
}
