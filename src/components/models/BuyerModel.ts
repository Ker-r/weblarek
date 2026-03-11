import { IBuyer, TPayment } from '../../types/index';

export class BuyerModel {
  private _payment: TPayment | '';
  private _address: string;
  private _email: string;
  private _phone: string;

  constructor() {
    this._payment = '';
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // Сохранить данные (можно передать одно поле или несколько)
  setData(data: Partial<IBuyer>): void {
    // Обновляем только те поля, которые переданы
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  // Получить все данные
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
  }

  // Очистить все данные
  clearData(): void {
    this._payment = '';
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // Валидация: возвращает объект с ошибками
  validate(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // Проверяем каждое поле
    if (!this._payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}