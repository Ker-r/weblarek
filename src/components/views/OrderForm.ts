import { Form } from './Form';
import { IEvents } from '../base/Events';

// Данные формы первого шага
interface IOrderFormData {
  payment: string;
  address: string;
}

// Форма выбора оплаты и адреса
export class OrderForm extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected _selectedPayment: string = '';

  constructor(template: HTMLTemplateElement, events: IEvents) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    super(container, events);
    
    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    
    // Выбор оплаты картой
    this.cardButton.addEventListener('click', () => {
      this.payment = 'card';
      this.events.emit('order:change', { field: 'payment', value: 'card' });
    });
    
    // Выбор оплаты наличными
    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });
    
    // Ввод адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'address', value: this.addressInput.value });
    });
  }

  // Устанавливаем выбранный способ оплаты (подсвечиваем кнопку)
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

  // Устанавливаем адрес
  set address(value: string) {
    if (this.addressInput) {
      this.addressInput.value = value;
    }
  }
}