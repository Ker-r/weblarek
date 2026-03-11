import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebAPI } from './components/models/WebAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data'; // тестовые данные

// Экземпляры классов
const catalog = new CatalogModel();
const cart = new CartModel();
const buyer = new BuyerModel();

// Создаем клиент для API
const apiClient = new Api(API_URL);
const webApi = new WebAPI(apiClient);

// Тестирование моделей
console.log('Тестирование моделей');

// Тест CatalogModel
console.log('Тест CatalogModel');

// Сохраняем товары в каталог
catalog.setItems(apiProducts.items);
console.log('Все товары из каталога:', catalog.getItems());

// Проверяем получение одного товара
const firstProduct = catalog.getItems()[0];
console.log('Первый товар:', firstProduct);

if (firstProduct) {
  const foundProduct = catalog.getProduct(firstProduct.id);
  console.log('Поиск товара по id:', foundProduct);
}

// Проверяем выбранный товар
catalog.setSelected(firstProduct || null);
console.log('Выбранный товар:', catalog.getSelected());

// Тест CartModel
console.log('Тест CartModel');

// Добавляем товары в корзину
if (apiProducts.items.length >= 2) {
  cart.addItem(apiProducts.items[0]);
  cart.addItem(apiProducts.items[1]);
}
console.log('Корзина после добавления 2 товаров:', cart.getItems());
console.log('Количество товаров в корзине:', cart.getCount());
console.log('Общая стоимость:', cart.getTotal());

// Проверяем наличие товара
if (firstProduct) {
  console.log('Товар есть в корзине?', cart.containsItem(firstProduct.id));
}

// Удаляем товар
if (firstProduct) {
  cart.removeItem(firstProduct.id);
  console.log('Корзина после удаления первого товара:', cart.getItems());
}

// Очищаем корзину
cart.clearCart();
console.log('Корзина после очистки:', cart.getItems());

// Тест BuyerModel
console.log('Тест BuyerModel');

// Проверяем пустые данные
console.log('Пустые данные:', buyer.getData());
console.log('Валидация пустых данных:', buyer.validate());

// Заполняем данные
buyer.setData({
  payment: 'card',
  address: 'ул. Котикова, д. 8',
  email: 'kotik@test.com',
  phone: '1234567890'
});
console.log('Заполненные данные:', buyer.getData());
console.log('Валидация заполненных данных:', buyer.validate());

// Обновляем только одно поле
buyer.setData({ phone: '' });
console.log('После очистки телефона:', buyer.getData());
console.log('Валидация (должна быть ошибка телефона):', buyer.validate());

// Очищаем всё
buyer.clearData();
console.log('После полной очистки:', buyer.getData());

// Загрузка с сервера
console.log('Загрузка с сервера');
console.log('API_URL:', API_URL);

webApi.getProducts()
  .then(products => {
    console.log('Успешно загружено с сервера!');
    console.log('Количество товаров:', products.length);
    console.log('Первый товар с сервера:', products[0]);
    
    // Сохраняем товары в модель каталога
    catalog.setItems(products);
    console.log('Товары сохранены в каталог, теперь в каталоге:', catalog.getItems().length, 'товаров');
    
    // Проверяем получение одного товара по id
    if (products.length > 0) {
      const firstProductId = products[0].id;
      const product = catalog.getProduct(firstProductId);
      console.log('Поиск товара по id (с сервера):', product?.title);
    }
  })
  .catch(error => {
    console.log('Не удалось загрузить с сервера');
    console.error('Детали ошибки:', error);
    console.log('В каталоге остались тестовые данные');
  });