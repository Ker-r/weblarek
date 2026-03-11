export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
// Тип для способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера при получении списка товаров
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Данные для отправки заказа (расширяет IBuyer, но payment уже не может быть пустым)
export interface IOrderData extends IBuyer {
  payment: TPayment;  // переопределяем тип - только 'card' | 'cash', без пустой строки
  total: number;
  items: string[];
}

// Ответ сервера после отправки заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// Тип для ошибок валидации - может содержать только ключи из IBuyer
export type FormErrors = Partial<Record<keyof IBuyer, string>>;