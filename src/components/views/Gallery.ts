import { Component } from '../base/Component';

// Данные для галереи
interface IGallery {
  catalog: HTMLElement[];
}

// Контейнер для карточек на главной странице
export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  // Очищаем галерею и вставляем новые карточки
  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}