import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

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
    
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    
    this.cardButton.addEventListener('click', () => {
      events.emit('order:change', { field: 'payment', value: 'card' });
    });
    
    this.cashButton.addEventListener('click', () => {
      events.emit('order:change', { field: 'payment', value: 'cash' });
    });
    
    this.addressInput.addEventListener('input', () => {
      events.emit('order:change', { field: 'address', value: this.addressInput.value });
    });
  }

  set payment(value: string) {
    this._selectedPayment = value;
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}