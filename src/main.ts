import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

import { WebAPI } from './components/models/WebAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

import { IProduct } from './types';

// Брокер событий
const events = new EventEmitter();

// Модели данных
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// API
const apiClient = new Api(API_URL);
const api = new WebAPI(apiClient);

// Элементы DOM и шаблоны
const headerElement = ensureElement<HTMLElement>('.header');
const galleryElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement, events);

// Переменные для хранения текущих компонентов
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate) as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, events);
const successView = new Success(cloneTemplate(successTemplate), events);

let previewCard: CardPreview | null = null;

// Создание карточки каталога
function renderCatalogCard(product: IProduct): HTMLElement {
  const container = cloneTemplate(cardCatalogTemplate);
  const card = new CardCatalog(container, events);
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = CDN_URL + product.image;
  card.id = product.id;
  return card.render();
}

// Создание карточки корзины
function renderBasketCard(product: IProduct, index: number): HTMLElement {
  const container = cloneTemplate(cardBasketTemplate);
  const card = new CardBasket(container, events);
  card.id = product.id;
  card.title = product.title;
  card.price = product.price;
  card.index = index;
  return card.render();
}

// Обновление счётчика в шапке
function updateHeaderCounter(): void {
  header.counter = cartModel.getCount();
}

// Обновление содержимого корзины
function updateBasketView(): void {
  const items = cartModel.getItems().map((item, idx) => renderBasketCard(item, idx + 1));
  basketView.items = items;
  basketView.total = cartModel.getTotal();
  basketView.checkoutEnabled = cartModel.getCount() > 0;
}

/// Обновление формы заказа (первый шаг)
function updateOrderForm(): void {
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  const errors = buyerModel.validateFields(['payment', 'address']);
  // Проверяем, что нет ошибок в этих полях
  const isValid = !errors.payment && !errors.address;
  orderForm.valid = isValid;
  orderForm.errors = errors;
}

// Обновление формы контактов (второй шаг)
function updateContactsForm(): void {
  const buyerData = buyerModel.getData();
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  
  const errors = buyerModel.validateFields(['email', 'phone']);
  // Проверяем, что нет ошибок в этих полях
  const isValid = !errors.email && !errors.phone;
  contactsForm.valid = isValid;
  contactsForm.errors = errors;
}

// Каталог изменился — перерисовываем галерею
events.on('catalog:changed', (products: IProduct[]) => {
  const cards = products.map(renderCatalogCard);
  gallery.catalog = cards;
});

// Корзина изменилась — обновляем счётчик и корзину
events.on('cart:changed', () => {
  updateHeaderCounter();
  updateBasketView();
});

// Данные покупателя изменились — обновляем формы
events.on('buyer:changed', () => {
  updateOrderForm();
  updateContactsForm();
});

// Выбран товар для просмотра
events.on('product:selected', (product: IProduct) => {
  const inCart = cartModel.containsItem(product.id);
  const hasPrice = product.price !== null && product.price > 0;
  if (!previewCard) {
    const container = cloneTemplate(cardPreviewTemplate);
    previewCard = new CardPreview(container, events);
  }
  
  // Обновляем данные карточки (у CardPreview нет сеттера product)
  previewCard.id = product.id;
  previewCard.title = product.title;
  previewCard.price = product.price;
  previewCard.category = product.category;
  previewCard.image = CDN_URL + product.image;
  previewCard.description = product.description;
  
  if (!hasPrice) {
    previewCard.buttonText = 'Недоступно';
    previewCard.buttonDisabled = true;
  } else if (inCart) {
    previewCard.buttonText = 'Удалить из корзины';
    previewCard.buttonDisabled = false;
  } else {
    previewCard.buttonText = 'Купить';
    previewCard.buttonDisabled = false;
  }
  
  openModal(previewCard.render());
});

// Выбор карточки
events.on('card:select', (data: { id: string }) => {
  console.log('card:select', data.id);
  const product = catalogModel.getProduct(data.id);
  if (product) {
    catalogModel.setSelected(product);
  }
});

// Действие в карточке товара (купить/удалить)
events.on('preview:action', (data: { id: string }) => {
  console.log('preview:action', data.id);
  const product = catalogModel.getProduct(data.id);
  if (product) {
    if (cartModel.containsItem(product.id)) {
      cartModel.removeItem(product.id);
    } else {
      cartModel.addItem(product);
    }
  }
  modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
  openModal(basketView.render());
});

// Удаление товара из корзины
events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

// Оформление заказа (кнопка в корзине)
events.on('order:open', () => {
  openModal(orderForm.render());
});

// Изменение полей формы заказа
events.on('order:change', (data: { field: string, value: string }) => {
  if (data.field === 'payment') {
    buyerModel.setData({ payment: data.value as 'card' | 'cash' });
  } else if (data.field === 'address') {
    buyerModel.setData({ address: data.value });
  }
});

// Отправка формы заказа
events.on('order:submit', () => {
  const errors = buyerModel.validateFields(['payment', 'address']);
  const isValid = !errors.payment && !errors.address;
  if (isValid) {
    openModal(contactsForm.render());
  }
});


// Изменение полей формы контактов
events.on('contacts:change', (data: { field: string, value: string }) => {
  if (data.field === 'email') {
    buyerModel.setData({ email: data.value });
  } else if (data.field === 'phone') {
    buyerModel.setData({ phone: data.value });
  }
});

// Отправка формы контактов
events.on('contacts:submit', async () => {
  const errors = buyerModel.validateFields(['email', 'phone']);
  const isValid = !errors.email && !errors.phone;
  
  if (isValid) {
    try {
      const buyerData = buyerModel.getData();
      const orderData = {
        payment: buyerData.payment as 'card' | 'cash',
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
      };
      
      const result = await api.placeOrder(orderData);
      
      successView.total = result.total;
      openModal(successView.render());
      
      cartModel.clearCart();
      buyerModel.clearData();
      
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      alert('Произошла ошибка при оформлении заказа. Попробуйте ещё раз.');
    }
  }
});

// Закрытие окна успеха
events.on('success:close', () => {
  modal.close();
});

// Закрытие модалки
events.on('modal:close', () => {
});

// Открыть модальное окно
function openModal(content: HTMLElement): void {
  modal.content = content;
  modal.open();
}

// Загрузка с сервера
api.getProducts()
  .then(products => {
    catalogModel.setItems(products);
  })
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });