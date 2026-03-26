import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Данные для экрана успеха
interface ISuccessData {
  total: number;
}

// Сообщение об успешном оформлении заказа
export class Success extends Component<ISuccessData> {
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
    
    // При клике на кнопку отправляем событие
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  // Устанавливаем сумму, которая списана
  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = `Списано ${value} синапсов`;
    }
  }
}