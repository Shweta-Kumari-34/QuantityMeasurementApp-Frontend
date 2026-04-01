import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  activeTab: 'login' | 'signup' = 'login';

  loginData = {
    email: '',
    password: '',
    rememberMe: false,
  };

  signupData = {
    fullName: '',
    email: '',
    password: '',
    mobile: '',
  };

  loginPasswordVisible = false;
  signupPasswordVisible = false;

  loginErrors: any = {};
  signupErrors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  showLogin() {
    this.activeTab = 'login';
  }

  showSignup() {
    this.activeTab = 'signup';
  }

  toggleLoginPassword() {
    this.loginPasswordVisible = !this.loginPasswordVisible;
  }

  toggleSignupPassword() {
    this.signupPasswordVisible = !this.signupPasswordVisible;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidMobile(mobile: string): boolean {
    return /^[6-9]\d{9}$/.test(mobile);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 4;
  }

  validateSignup(): boolean {
    this.signupErrors = {};

    if (!this.signupData.fullName.trim()) {
      this.signupErrors.fullName = 'Full name is required';
    }

    if (!this.signupData.email.trim()) {
      this.signupErrors.email = 'Email is required';
    } else if (!this.isValidEmail(this.signupData.email)) {
      this.signupErrors.email = 'Enter a valid email';
    }

    if (!this.signupData.password.trim()) {
      this.signupErrors.password = 'Password is required';
    } else if (!this.isValidPassword(this.signupData.password)) {
      this.signupErrors.password = 'Password must be at least 4 characters';
    }

    if (!this.signupData.mobile.trim()) {
      this.signupErrors.mobile = 'Mobile number is required';
    } else if (!this.isValidMobile(this.signupData.mobile)) {
      this.signupErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    return Object.keys(this.signupErrors).length === 0;
  }

  validateLogin(): boolean {
    this.loginErrors = {};

    if (!this.loginData.email.trim()) {
      this.loginErrors.email = 'Email is required';
    } else if (!this.isValidEmail(this.loginData.email)) {
      this.loginErrors.email = 'Enter a valid email';
    }

    if (!this.loginData.password.trim()) {
      this.loginErrors.password = 'Password is required';
    }

    return Object.keys(this.loginErrors).length === 0;
  }

  onSignup() {
    if (!this.validateSignup()) return;

    const payload = {
      username: this.signupData.email.trim(),
      password: this.signupData.password.trim(),
    };

    this.authService.register(payload).subscribe({
      next: (message) => {
        alert(message);
        this.showLogin();
      },
      error: (err) => {
        alert(err?.error || 'Registration failed');
      },
    });
  }

  onLogin() {
    if (!this.validateLogin()) return;

    const payload = {
      username: this.loginData.email.trim(),
      password: this.loginData.password.trim(),
    };

    this.authService.login(payload).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(err?.error?.message || err?.error || 'Invalid username or password');
      },
    });
  }
}
