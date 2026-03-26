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
let currentBasketView: BasketView | null = null;
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// Создание карточки каталога
function renderCatalogCard(product: IProduct): HTMLElement {
  const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
    onClick: () => events.emit('card:select', product)
  });
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  // Формируем полный URL к изображению
  const imageUrl = product.image.startsWith('http') ? product.image : CDN_URL + product.image;
  card.image = imageUrl;
  return card.render();
}

// Создание карточки корзины
function renderBasketCard(product: IProduct, index: number): HTMLElement {
  const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
    onClick: () => events.emit('basket:remove', { id: product.id })
  });
  card.title = product.title;
  card.price = product.price;
  card.index = index;
  return card.render();
}

// Обновление счётчика в шапке
function updateHeaderCounter(): void {
  header.counter = cartModel.getCount();
}

// Открыть модальное окно
function openModal(content: HTMLElement): void {
  modal.content = content;
  modal.open();
}

// Обновить корзину (если открыта)
function refreshBasketView(): void {
  if (currentBasketView) {
    const items = cartModel.getItems().map((item, idx) => renderBasketCard(item, idx + 1));
    currentBasketView.items = items;
    currentBasketView.total = cartModel.getTotal();
    currentBasketView.checkoutEnabled = cartModel.getCount() > 0;
  }
}

// События моделей

// Каталог изменился — перерисовываем галерею
events.on('catalog:changed', (products: IProduct[]) => {
  const cards = products.map(renderCatalogCard);
  gallery.catalog = cards;
});

// Корзина изменилась — обновляем счётчик и корзину
events.on('cart:changed', () => {
  updateHeaderCounter();
  refreshBasketView();
});

// Данные покупателя изменились — обновляем валидацию форм
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
  
  if (currentOrderForm) {
    currentOrderForm.valid = isValid;
    currentOrderForm.errors = errors;
  }
  
  if (currentContactsForm) {
    currentContactsForm.valid = isValid;
    currentContactsForm.errors = errors;
  }
});

//События представления

// Открытие корзины
events.on('basket:open', () => {
  const basketView = new BasketView(cloneTemplate(basketTemplate), events);
  currentBasketView = basketView;
  
  const items = cartModel.getItems().map((item, idx) => renderBasketCard(item, idx + 1));
  basketView.items = items;
  basketView.total = cartModel.getTotal();
  basketView.checkoutEnabled = cartModel.getCount() > 0;
  
  openModal(basketView.render());
});

// Выбор карточки товара (клик по карточке в каталоге)
events.on('card:select', (product: IProduct) => {
  const inCart = cartModel.containsItem(product.id);
  const hasPrice = product.price !== null && product.price > 0;
  
  const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('preview:action', product)
  });
  
  previewCard.title = product.title;
  previewCard.price = product.price;
  previewCard.category = product.category;
  const imageUrl = product.image.startsWith('http') ? product.image : CDN_URL + product.image;
  previewCard.image = imageUrl;
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

// Действие в карточке товара (купить/удалить)
events.on('preview:action', (product: IProduct) => {
  if (cartModel.containsItem(product.id)) {
    cartModel.removeItem(product.id);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

// Удаление товара из корзины
events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

// Оформление заказа (кнопка в корзине)
events.on('order:open', () => {
  const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
  currentOrderForm = orderForm;
  
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  // Проверяем валидность
  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
  orderForm.valid = isValid;
  orderForm.errors = errors;
  
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

// Отправка формы заказа (переход ко второй форме)
events.on('order:submit', () => {
  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
  
  if (isValid) {
    const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
    currentContactsForm = contactsForm;
    
    const buyerData = buyerModel.getData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    
    // Проверяем валидность контактов
    const contactsErrors = buyerModel.validate();
    const contactsValid = Object.keys(contactsErrors).length === 0;
    contactsForm.valid = contactsValid;
    contactsForm.errors = contactsErrors;
    
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

// Отправка формы контактов (оформление заказа)
events.on('contacts:submit', async () => {
  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
  
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
      
      // Показываем экран успеха
      const success = new Success(cloneTemplate(successTemplate), events);
      success.total = result.total;
      openModal(success.render());
      
      // Очищаем корзину и данные покупателя
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

// Закрытие модалки — очищаем текущие компоненты
events.on('modal:close', () => {
  currentBasketView = null;
  currentOrderForm = null;
  currentContactsForm = null;
});

// Загрузка товаров с сервера
api.getProducts()
  .then(products => {
    catalogModel.setItems(products);
  })
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });