import { Card, ICardActions } from './Card';
import { IProduct } from '../../types';

// Карточка товара в корзине
export class CardBasket extends Card<IProduct> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    
    // Кнопка удаления генерирует событие через переданный обработчик
    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        actions.onClick?.(e);
      });
    }
  }

  // Устанавливаем порядковый номер товара в корзине
  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = value.toString();
    }
  }
}