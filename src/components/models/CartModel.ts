import { IProduct } from '../../types/index';

export class CartModel {
  private _cartItems: IProduct[];

  constructor() {
    this._cartItems = [];
  }

  // Получить все товары в корзине
  getItems(): IProduct[] {
    return this._cartItems;
  }

  // Добавить товар
  addItem(product: IProduct): void {
    // Проверка, нет ли уже такого товара
    if (!this.containsItem(product.id)) {
      this._cartItems.push(product);
    }
  }

  // Удалить товар по id
  removeItem(productId: string): void {
    this._cartItems = this._cartItems.filter(item => item.id !== productId);
  }

  // Очистить корзину
  clearCart(): void {
    this._cartItems = [];
  }

  // Получить общую стоимость
  getTotal(): number {
    return this._cartItems.reduce((total, item) => {
      // Если цена null, считаем как 0
      return total + (item.price ?? 0);
    }, 0);
  }

  // Получить количество товаров
  getCount(): number {
    return this._cartItems.length;
  }

  // Проверить, есть ли товар в корзине
  containsItem(productId: string): boolean {
    return this._cartItems.some(item => item.id === productId);
  }
}