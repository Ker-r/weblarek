import { Card, ICardActions } from './Card';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

// Детальная карточка для модального окна
export class CardPreview extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
    
    // Обработчик клика на кнопку (не на всю карточку)
    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', (e) => {
        e.stopPropagation();
        actions.onClick?.(e);
      });
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      Object.values(categoryMap).forEach(cls => {
        this.categoryElement!.classList.remove(cls);
      });
      const modifier = (categoryMap as Record<string, string>)[value] || categoryMap['другое'];
      this.categoryElement.classList.add(modifier);
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      const url = value.startsWith('http') ? value : `${CDN_URL}${value}`;
      this.setImage(this.imageElement, url, this.titleElement?.textContent || '');
    }
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buttonElement) {
      if (value) {
        this.buttonElement.setAttribute('disabled', 'disabled');
      } else {
        this.buttonElement.removeAttribute('disabled');
      }
    }
  }
}