import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FilterBarComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
