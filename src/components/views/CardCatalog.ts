import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

// Карточка товара в каталоге (на главной странице)
export class CardCatalog extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    
    container.addEventListener('click', () => {
      if (this.id) {
        this.events.emit('card:select', { id: this.id });
      }
    });
  }

  // Устанавливаем категорию и CSS-класс для фона 
  set category(value: string) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach(cls => {
      this.categoryElement.classList.remove(cls);
    });
    const modifier = (categoryMap as Record<string, string>)[value] || categoryMap['другое'];
    this.categoryElement.classList.add(modifier);
  }
  
  // Устанавливаем изображение 
  set image(value: string) {
    const url = value.startsWith('http') ? value : `${CDN_URL}${value}`;
    this.setImage(this.imageElement, url, this.title);
  }
}