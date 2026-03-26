import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Интерфейс для данных корзины
interface IBasketView {
  items: HTMLElement[];
  total: number;
}

// Интерфейс для действий корзины
export interface BasketViewActions {
  onCheckout?: () => void;
}

// Отображение корзины
export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);
    
    this.listElement = container.querySelector('.basket__list') as HTMLElement;
    this.totalElement = container.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = container.querySelector('.basket__button') as HTMLButtonElement;
    
    this.checkoutButton.addEventListener('click', () => {
      if (events) {
        events.emit('order:open');
      }
    });
  }

  // Устанавливаем список товаров
  set items(items: HTMLElement[]) {
    if (this.listElement) {
      if (items.length === 0) {
        // Если корзина пуста, показываем сообщение
        this.listElement.replaceChildren();
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.style.textAlign = 'center';
        this.listElement.appendChild(emptyMessage);
      } else {
        this.listElement.replaceChildren(...items);
      }
    }
  }

  // Устанавливаем общую сумму
  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = `${value} синапсов`;
    }
  }

  // Блокируем/разблокируем кнопку оформления
  set checkoutEnabled(value: boolean) {
    this.checkoutButton.disabled = !value;
  }
}