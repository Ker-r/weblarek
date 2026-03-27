import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

// Детальная карточка для модального окна
export class CardPreview extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
    
    // При клике на кнопку генерируем событие
    this.buttonElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.events.emit('preview:action', { id: this.id });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach(cls => {
      this.categoryElement.classList.remove(cls);
    });
    const modifier = (categoryMap as Record<string, string>)[value] || categoryMap['другое'];
    this.categoryElement.classList.add(modifier);
  }

  set image(value: string) {
    const url = value.startsWith('http') ? value : `${CDN_URL}${value}`;
    this.setImage(this.imageElement, url, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (value) {
      this.buttonElement.setAttribute('disabled', 'disabled');
    } else {
      this.buttonElement.removeAttribute('disabled');
    }
  }
}