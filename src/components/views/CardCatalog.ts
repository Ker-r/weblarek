import { Card, ICardActions } from './Card';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

// Карточка товара в каталоге (на главной странице)
export class CardCatalog extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
  }

  // Устанавливаем категорию и CSS-класс для фона
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

  // Устанавливаем изображение
  set image(value: string) {
    if (this.imageElement) {
      // Формируем полный URL к изображению
      const url = value.startsWith('http') ? value : `${CDN_URL}${value}`;
      this.setImage(this.imageElement, url, this.titleElement?.textContent || '');
    }
  }
}