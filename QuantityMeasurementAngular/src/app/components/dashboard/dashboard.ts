import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { QuantityService } from '../../services/quantity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  units: Record<string, string[]> = {
    length: ['ft', 'in', 'yd', 'cm'],
    weight: ['kg', 'g', 'lb'],
    volume: ['l', 'ml', 'gal'],
    temperature: ['C', 'F', 'K'],
  };

  currentType = 'length';
  currentAction = 'compare';

  value1: number | null = null;
  value2: number | null = null;
  unit1 = 'ft';
  unit2 = 'ft';
  resultText = '--';

  constructor(
    private authService: AuthService,
    private router: Router,
    private quantityService: QuantityService
  ) {
    this.updateUnits();
  }

  get availableUnits(): string[] {
    return this.units[this.currentType];
  }

  setType(type: string) {
    this.currentType = type;

    if (this.currentType === 'temperature' && this.currentAction === 'arithmetic') {
      this.currentAction = 'convert';
    }

    this.updateUnits();
    this.resultText = '--';
  }

  setAction(action: string) {
    if (this.currentType === 'temperature' && action === 'arithmetic') return;
    this.currentAction = action;
    this.resultText = '--';
  }

  updateUnits() {
    const list = this.availableUnits;
    this.unit1 = list[0];
    this.unit2 = list[0];
  }

  calculate() {
    if (this.value1 === null || Number.isNaN(this.value1)) {
      alert('Enter Value 1');
      return;
    }

    if (
      this.currentAction !== 'convert' &&
      (this.value2 === null || Number.isNaN(this.value2))
    ) {
      alert('Enter Value 2');
      return;
    }

    if (this.currentAction === 'compare') {
      this.quantityService
        .compare({
          value1: this.value1,
          unit1: this.unit1,
          value2: this.value2!,
          unit2: this.unit2,
          operation: 'COMPARE',
        })
        .subscribe({
          next: (res) => {
            if (res?.unit === 'BOOLEAN') {
              this.resultText = res.result == 1 ? 'TRUE' : 'FALSE';
            } else if (typeof res === 'boolean') {
              this.resultText = res ? 'TRUE' : 'FALSE';
            } else if (typeof res?.result === 'boolean') {
              this.resultText = res.result ? 'TRUE' : 'FALSE';
            } else {
              this.resultText = `${res?.result ?? ''} ${res?.unit ?? ''}`.trim();
            }
          },
          error: (err) => {
            this.resultText = err?.error?.message || err?.error || 'Compare failed';
          },
        });
    } else if (this.currentAction === 'convert') {
      this.quantityService
        .convert({
          value1: this.value1,
          unit1: this.unit1,
          targetUnit: this.unit2,
          operation: 'CONVERT',
        })
        .subscribe({
          next: (res) => {
            this.resultText = `${res?.result ?? ''} ${res?.unit ?? ''}`.trim();
          },
          error: (err) => {
            this.resultText = err?.error?.message || err?.error || 'Conversion failed';
          },
        });
    } else if (this.currentAction === 'arithmetic') {
      this.quantityService
        .add({
          value1: this.value1,
          unit1: this.unit1,
          value2: this.value2!,
          unit2: this.unit2,
          operation: 'ADD',
        })
        .subscribe({
          next: (res) => {
            this.resultText = `${res?.result ?? ''} ${res?.unit ?? ''}`.trim();
          },
          error: (err) => {
            this.resultText = err?.error?.message || err?.error || 'Addition failed';
          },
        });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
