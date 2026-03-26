import { IBuyer, TPayment, FormErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class BuyerModel {
  private payment: TPayment | '' = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохраняет данные (можно передать одно или несколько полей)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    
    this.events.emit('buyer:changed', this.getData());
  }

  // Возвращает все данные покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  // Очищает все данные
  clearData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    
    this.events.emit('buyer:changed', this.getData());
  }

  // Полная валидация всех полей
  validate(): FormErrors {
    return this.validateFields(['payment', 'address', 'email', 'phone']);
  }

  // Валидация только указанных полей
  validateFields(fields: Array<keyof IBuyer>): FormErrors {
    const errors: FormErrors = {};

    if (fields.includes('payment') && !this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (fields.includes('address') && !this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (fields.includes('email') && !this.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (fields.includes('phone') && !this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  // Проверяет, можно ли перейти ко второму шагу
  canProceedToContacts(): boolean {
    return !!(this.payment && this.address.trim());
  }

  // Проверяет, можно ли отправить заказ
  canSubmitOrder(): boolean {
    return !!(this.payment && this.address.trim() && this.email.trim() && this.phone.trim());
  }
}