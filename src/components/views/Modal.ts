import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Модальное окно
export class Modal extends Component<{}> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    
    // Закрытие по крестику
    this.closeButton.addEventListener('click', () => this.close());
    
    // Закрытие по клику на оверлей (фон)
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  // Устанавливаем содержимое модалки
  set content(value: HTMLElement) {
    if (this.contentElement) {
      this.contentElement.replaceChildren(value);
    }
  }

  // Открываем окно (добавляем класс modal_active)
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  // Закрываем окно и очищаем содержимое
  close() {
    this.container.classList.remove('modal_active');
    if (this.contentElement) {
      this.contentElement.replaceChildren();
    }
    this.events.emit('modal:close');
  }
}