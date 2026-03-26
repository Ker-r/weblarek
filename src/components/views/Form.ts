import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Базовый класс для всех форм
export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorElement = container.querySelector('.form__errors') as HTMLElement;
    
    // При отправке формы предотвращаем перезагрузку страницы и отправляем событие
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${this.container.id}:submit`);
    });
  }

  // Блокируем/разблокируем кнопку отправки
  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }

  // Показываем ошибки валидации
  set errors(value: Partial<Record<keyof T, string>>) {
    if (this.errorElement) {
      const errorMessages = Object.values(value).filter(Boolean);
      this.errorElement.textContent = errorMessages.join(', ');
    }
  }
}