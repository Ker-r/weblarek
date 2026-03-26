import { Component } from '../base/Component';

// Интерфейс для обработчиков кликов по карточке
export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

// Базовый класс для всех карточек товара
export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    // Находим элементы в переданном контейнере
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
    
    // Если передан обработчик клика, вешаем его на всю карточку
    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  // Устанавливаем название товара
  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  // Устанавливаем цену. Если null — показываем "Бесценно"
  set price(value: number | null) {
    if (this.priceElement) {
      if (value === null) {
        this.priceElement.textContent = 'Бесценно';
      } else {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }
}