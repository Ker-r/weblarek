import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Данные для экрана успеха
interface ISuccessData {
  total: number;
}

// Интерфейс для действий успеха
export interface SuccessActions {
  onClose?: () => void;
}

// Сообщение об успешном оформлении заказа
export class Success extends Component<ISuccessData> {
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events?: IEvents, actions?: SuccessActions) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(container);
    
    this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
    
    // При клике на кнопку отправляем событие или вызываем колбэк
    this.closeButton.addEventListener('click', () => {
      if (actions?.onClose) {
        actions.onClose();
      } else if (events) {
        events.emit('success:close');
      }
    });
  }

  // Устанавливаем сумму, которая списана
  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = `Списано ${value} синапсов`;
    }
  }
}