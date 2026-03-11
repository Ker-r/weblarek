import { IApi, IProduct, IOrderData, IOrderResponse, IProductsResponse } from '../../types';

export class WebAPI {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  // Получить список всех товаров
  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this._api.get<IProductsResponse>('/product');
      return response.items;
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      throw error;
    }
  }

  // Отправить заказ
  async placeOrder(order: IOrderData): Promise<IOrderResponse> {
    try {
      const response = await this._api.post<IOrderResponse>('/order', order);
      return response;
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      throw error;
    }
  }
}