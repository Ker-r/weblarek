import { Form } from './Form';
import { IEvents } from '../base/Events';

// Данные формы второго шага
interface IContactsFormData {
  email: string;
  phone: string;
}

// Форма ввода контактов
export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
    
    // Ввод email
    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:change', { field: 'email', value: this.emailInput.value });
    });
    
    // Ввод телефона
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:change', { field: 'phone', value: this.phoneInput.value });
    });
  }

  set email(value: string) {
    if (this.emailInput) {
      this.emailInput.value = value;
    }
  }

  set phone(value: string) {
    if (this.phoneInput) {
      this.phoneInput.value = value;
    }
  }
}