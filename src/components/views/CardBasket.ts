import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Карточка товара в корзине
export class CardBasket extends Card<IProduct> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    
    this.deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.events.emit('basket:remove', { id: this.id });
    });
  }

  // Устанавливаем порядковый номер товара в корзине
  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}