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

  historyList: any[] = [];
  showHistory = false;
  selectedHistoryOperation = 'ALL';

  historyOperations = ['ALL', 'COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private quantityService: QuantityService
  ) {}

  get availableUnits(): string[] {
    return this.units[this.currentType];
  }

  setType(type: string) {
    this.currentType = type;

    if (type === 'temperature') {
      this.currentAction = 'compare';
    }

    this.unit1 = this.availableUnits[0];
    this.unit2 = this.availableUnits[0];
  }

  setAction(action: string) {
    this.currentAction = action;
  }

  calculate() {
    if (!this.value1) return alert('Enter value1');

    if (this.currentAction !== 'convert' && !this.value2) {
      return alert('Enter value2');
    }

    const payload: any = {
      value1: this.value1,
      unit1: this.unit1,
      value2: this.value2,
      unit2: this.unit2,
      targetUnit: this.unit2,
    };

    let request;

    switch (this.currentAction) {
      case 'compare':
        request = this.quantityService.compare({ ...payload, operation: 'COMPARE' });
        break;
      case 'convert':
        request = this.quantityService.convert({ ...payload, operation: 'CONVERT' });
        break;
      case 'add':
        request = this.quantityService.add({ ...payload, operation: 'ADD' });
        break;
      case 'subtract':
        request = this.quantityService.subtract({ ...payload, operation: 'SUBTRACT' });
        break;
      case 'divide':
        request = this.quantityService.divide({ ...payload, operation: 'DIVIDE' });
        break;
    }

    request?.subscribe({
      next: (res) => {
        this.resultText =
          res.unit === 'BOOLEAN'
            ? res.result ? 'TRUE' : 'FALSE'
            : `${res.result} ${res.unit}`;
      },
      error: (err) => {
        this.resultText = err.error?.message || 'Error occurred';
      },
    });
  }

  loadAllHistory() {
    this.quantityService.getAllHistory().subscribe((res) => {
      this.historyList = res;
      this.showHistory = true;
    });
  }

  loadFilteredHistory() {
    if (this.selectedHistoryOperation === 'ALL') {
      this.loadAllHistory();
      return;
    }

    this.quantityService
      .getHistoryByOperation(this.selectedHistoryOperation)
      .subscribe((res) => {
        this.historyList = res;
        this.showHistory = true;
      });
  }

  hideHistory() {
    this.showHistory = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
