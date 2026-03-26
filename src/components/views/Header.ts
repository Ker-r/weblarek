import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Данные для шапки
interface IHeader {
  counter: number;
}

// Шапка сайта с корзиной и счётчиком
export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
    
    // При клике на корзину отправляем событие
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Обновляем счётчик товаров
  set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = String(value);
    }
  }
}