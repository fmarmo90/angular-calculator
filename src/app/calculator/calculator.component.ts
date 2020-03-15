import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  public current = '0';
  public elements = ['+', '-', '*', '/', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ','];

  private operation = '';
  private comma = false;

  listenForKey = fromEvent(document, 'keydown');

  constructor() { 
    this.listenForKey.subscribe((event: KeyboardEvent) => {
      this.validateInput(event.key)
    });
  }

  ngOnInit(): void {
  }

  /**
   * Function to validate user input
   */
  validateInput(value: string): void {
    try {
      /*if (this.cleanCharacters(this.current).length > 10) {
        throw new Error(`Max number exceded`);
      }*/

      // Dot
      if (value === ',' ||
          value === '.') {
        if (!this.comma) {
          this.current += ',';
          this.comma = true;
        }
      // Numbers
      } else if (!this.validateNumber(value)) {
        if (this.current === '0') {
          this.current = value;
        } else {
          this.current += value;
        }
      // Operations or special keys
      } else {
        switch (value) {
          case 'Delete':
            this.clear();
          break;
          case 'Enter':
            this.calculate();
          break;
          default:
            if (this.elements.includes(value)) {
              if (this.operation !== '') {
                this.calculate();
              }
      
              this.operation = value;
              this.current += this.showOperationElement(value);
              this.comma = false;
            }
        }
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
  }

  /**
   * Function to replace javascript operations to html entities
   */
  showOperationElement(operation): string {
    switch (operation) {
      case '*':
        return '&times;';
      case '/':
        return '&divide;';
      default:
        return operation;
    }
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

    let numbers = this.cleanCharacters(this.current).split(this.operation)

    if (numbers.length < 2)  {
      throw new Error(`Second number is empty`);
    }

    this.current = new Function(`
      let oper = ${numbers[0]} ${this.operation} ${numbers[1]};

      if (String(oper).includes('.')) {
        oper = oper.toFixed(2);
      }

      return String(oper).replace('.', ',');
    `)();
    
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
                .replace('&divide;', '/')
                .replace(/,/g, '.');
  }
}
