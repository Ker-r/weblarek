import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Базовый класс для всех карточек товара
export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected _id: string = '';

  constructor(container: HTMLElement) {
    super(container);
    
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  // Сеттер для id
  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }

  get id(): string {
    return this._id;
  }

  // Устанавливаем название товара
  set title(value: string) {
    this.titleElement.textContent = value;
  }

  // Устанавливаем цену. Если null — показываем "Бесценно"
  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}