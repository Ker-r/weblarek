import { IProduct } from '../../types/index';

export class CatalogModel {
  // Поля класса
  private catalogItems: IProduct[];
  private selected: IProduct | null;

  constructor() {
    this.catalogItems = [];
    this.selected = null;
  }

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this.catalogItems = items;
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this.catalogItems;
  }

  // Получить товар по id
  getProduct(id: string): IProduct | undefined {
    return this.catalogItems.find(item => item.id === id);
  }

  // Сохранить выбранный товар
  setSelected(product: IProduct | null): void {
    this.selected = product;
  }

  // Получить выбранный товар
  getSelected(): IProduct | null {
    return this.selected;
  }
}