import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected _selectedPayment: string = '';

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    
    this.cardButton.addEventListener('click', () => {
      this.payment = 'card';
      events.emit('order:change', { field: 'payment', value: 'card' });
    });
    
    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      events.emit('order:change', { field: 'payment', value: 'cash' });
    });
    
    this.addressInput.addEventListener('input', () => {
      events.emit('order:change', { field: 'address', value: this.addressInput.value });
    });
  }

  set payment(value: string) {
    this._selectedPayment = value;
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    if (this.addressInput) {
      this.addressInput.value = value;
    }
  }
}