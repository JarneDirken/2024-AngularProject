import { Component, OnInit, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit{
  public loggedInUser: User | undefined;
  toggleDropdown: boolean = false;
  hamburgerOpen: boolean = false;
  adminDropdownOpen: boolean = false;
  isAuthenticated: WritableSignal<boolean> = signal(false);

  constructor(private router: Router,public auth: AuthService) {
    this.auth.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated.set(auth);
    });
  }

  ngOnInit(): void {
    if(this.auth.user$){
      this.auth.user$.subscribe((data) => {
        if (data) this.loggedInUser = data;
      })
    }
  }

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/',
      },
      authorizationParams: {
        prompt: 'login', //other possibilities: https://auth0.github.io/auth0-spa-js/interfaces/AuthorizationParams.html#prompt,
      },
    });
  }

  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: "/",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  }

  handleLogout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: environment.home_url,
      },
    });
  }

  toggleMenu() {
    this.toggleDropdown = !this.toggleDropdown;
  }

  onAdminDropDown() {
    this.adminDropdownOpen = !this.adminDropdownOpen;
  }

  closeAdminDropDown() {
    this.adminDropdownOpen = false;
  }

  navigateTo(path: string) {
    this.closeAdminDropDown();
    this.hamburgerOpen = false;
    this.router.navigate([path]);
  }

  navitageUserProfile() {
    this.router.navigateByUrl("/profile");
    this.toggleDropdown = false;
  }
}
