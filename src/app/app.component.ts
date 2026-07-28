import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isHomeView = true;

  constructor(private readonly router: Router) {
    this.updateHomeView(this.router.url);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((event) => {
        this.updateHomeView(event.urlAfterRedirects);
      });
  }

  private updateHomeView(url: string): void {
    this.isHomeView = url === '/';
  }
}
