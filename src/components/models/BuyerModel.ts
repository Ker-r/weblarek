import { IBuyer, TPayment, FormErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class BuyerModel {
  private payment: TPayment | '' = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';
  private events: IEvents; // Добавляем брокер событий

  constructor(events: IEvents) {
    this.events = events; // Сохраняем events
  }

  // Сохранить данные (можно передать одно поле или несколько)
  setData(data: Partial<IBuyer>): void {
    // Обновляем только те поля, которые переданы
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;

    this.events.emit('buyer:changed', this.getData()); // Добавляем уведомление
  }

  // Получить все данные
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  // Очистить все данные
  clearData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';

    this.events.emit('buyer:changed', this.getData()); // Добавляем уведомление
  }

    validate(): FormErrors {
    const errors: FormErrors = {};

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}