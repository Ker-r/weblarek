import { IProduct } from '../../types/index';

export class CatalogModel {
  // Поля класса
  private _catalogItems: IProduct[];
  private _selected: IProduct | null;

  constructor() {
    this._catalogItems = [];
    this._selected = null;
  }

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this._catalogItems = items;
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this._catalogItems;
  }

  // Получить товар по id
  getProduct(id: string): IProduct | undefined {
    return this._catalogItems.find(item => item.id === id);
  }

  // Сохранить выбранный товар
  setSelected(product: IProduct | null): void {
    this._selected = product;
  }

  // Получить выбранный товар
  getSelected(): IProduct | null {
    return this._selected;
  }
}