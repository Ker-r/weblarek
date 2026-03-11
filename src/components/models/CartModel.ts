import { IProduct } from '../../types/index';

export class CartModel {
  private cartItems: IProduct[];

  constructor() {
    this.cartItems = [];
  }

  // Получить все товары в корзине
  getItems(): IProduct[] {
    return this.cartItems;
  }

  // Добавить товар
  addItem(product: IProduct): void {
    // Проверка, нет ли уже такого товара
    if (!this.containsItem(product.id)) {
      this.cartItems.push(product);
    }
  }

  // Удалить товар по id
  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
  }

  // Очистить корзину
  clearCart(): void {
    this.cartItems = [];
  }

  // Получить общую стоимость
  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      // Если цена null, считаем как 0
      return total + (item.price ?? 0);
    }, 0);
  }

  // Получить количество товаров
  getCount(): number {
    return this.cartItems.length;
  }

  // Проверить, есть ли товар в корзине
  containsItem(productId: string): boolean {
    return this.cartItems.some(item => item.id === productId);
  }
}