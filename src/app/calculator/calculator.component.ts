import { Component, OnInit, HostListener } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  public current = '0';
  public elements = ['+', '-', '*', '/', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

  private firstNumber = '';
  private operation = '';

  constructor() { }

  @HostListener('document:keypress', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.calculate();

      return;
    }

    if (!this.elements.includes(event.key)) {
      return;
    }

    this.validateInput(event.key)
  }
  
  ngOnInit(): void {
  }

  /**
   * Function to validate user input
   */
  validateInput(value: string): void {
    try {
      if (this.cleanCharacters(this.current).length > 10) {
        throw new Error(`Max number exceded`);
      }

      // Dot
      if (value === '.') {
        if (!this.current.includes('.')) {
          this.current += value;
        }
      // Numbers
      } else if (!this.validateNumber(value)) {
        if (this.current === '0') {
          this.current = value;
        } else {
          this.current += value;
        }
      // Operations
      } else {
        if (this.operation !== '') {
          this.calculate();
        }

        this.firstNumber = this.current;
        this.operation = value;
        this.current += this.showOperationElement(value);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Function to clear all values and start again
   */
  clear(): void {
    this.current = '0';
    this.operation = '';
    this.firstNumber = '';
  }

  /**
   * Function to replace javascript operations to html entities
   */
  showOperationElement(operation): string {
    if (operation === '*') {
      return '&times;';
    }

    if (operation === '/') {
      return '&divide;';
    }

    return operation;
  }

  /**
   * Function to validate if the paratemer is number or not
   */
  validateNumber(value): boolean {
    return isNaN(Number(value));
  }

  /**
   * Function to calculate the operation inserted by the user
   */
  public calculate(): void {
    if (this.operation === '') {
      throw new Error(`There is no operation to do`);
    }

    const secondNumber = this.cleanCharacters(this.current)
                            .replace(new RegExp(this.firstNumber + '\\' + this.operation, 'g'), '');

    if (secondNumber === '')  {
      throw new Error(`Second number is empty`);
    }

    this.current = new Function(`return String(${this.firstNumber} ${this.operation} ${secondNumber})`)();
    this.operation = '';
  }

  /**
   * Function to clear html entities to javascript operations
   */
  private cleanCharacters(value): string {
    if (typeof value === 'undefined') {
      throw new Error(`Empty value string to clean`);
    }

    return value.replace('&times;', '*')
                .replace('&divide;', '/');
  }
}
