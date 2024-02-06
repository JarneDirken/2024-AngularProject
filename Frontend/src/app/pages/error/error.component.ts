import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {

  message: string = "";

  constructor(private router: Router) {
    this.message = this.router.getCurrentNavigation()?.extras.state?.['message'];
  }

  toHomePage() {
    this.router.navigate(['/']);
  }
}
