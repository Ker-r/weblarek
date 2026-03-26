import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class CatalogModel {
  // Поля класса
  private catalogItems: IProduct[];
  private selected: IProduct | null;
  private events: IEvents; // Добавляем брокер событий
  
  constructor(events: IEvents) {
    this.catalogItems = [];
    this.selected = null;
    this.events = events; 
  }

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this.catalogItems = items;
    this.events.emit('catalog:changed', this.catalogItems); // Сообщаем, что каталог изменился
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
    if (product) {
      this.events.emit('product:selected', product); // Сообщаем, что выбранный товар изменился
    }
  }

  // Получить выбранный товар
  getSelected(): IProduct | null {
    return this.selected;
  }
}