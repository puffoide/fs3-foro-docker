import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterOutlet ],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fs3-foro-app';
}
