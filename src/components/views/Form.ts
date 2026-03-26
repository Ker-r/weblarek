import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorElement = container.querySelector('.form__errors') as HTMLElement;

    container.addEventListener('submit', (e) => {
      e.preventDefault();
      const formName = this.container.getAttribute('name');
      this.events.emit(`${formName}:submit`);
    });
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }

  set errors(value: Partial<Record<keyof T, string>>) {
    if (this.errorElement) {
      const errorMessages = Object.values(value).filter(Boolean);
      this.errorElement.textContent = errorMessages.join(', ');
    }
  }
}