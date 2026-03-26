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
  const container = cloneTemplate(cardCatalogTemplate);
  const card = new CardCatalog(container, {
    onClick: () => events.emit('card:select', product)
  });
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  const imageUrl = product.image.startsWith('http') ? product.image : CDN_URL + product.image;
  card.image = imageUrl;
  return card.render();
}

// Создание карточки корзины
function renderBasketCard(product: IProduct, index: number): HTMLElement {
  const container = cloneTemplate(cardBasketTemplate);
  const card = new CardBasket(container, {
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
  // Для формы заказа (первый шаг) проверяем только оплату и адрес
  if (currentOrderForm) {
    const errors = buyerModel.validateFields(['payment', 'address']);
    const isValid = buyerModel.canProceedToContacts();
    currentOrderForm.valid = isValid;
    currentOrderForm.errors = errors;
  }
  
  // Для формы контактов (второй шаг) проверяем email и телефон
  if (currentContactsForm) {
    const errors = buyerModel.validateFields(['email', 'phone']);
    const isValid = buyerModel.canSubmitOrder();
    currentContactsForm.valid = isValid;
    currentContactsForm.errors = errors;
  }
});

// Открытие корзины
events.on('basket:open', () => {
  const container = cloneTemplate(basketTemplate);
  const basketView = new BasketView(container, events);
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
  
  const container = cloneTemplate(cardPreviewTemplate);
  const previewCard = new CardPreview(container, {
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

// Оформление заказа (кнопка в корзине) — открываем первый шаг
events.on('order:open', () => {
  const container = cloneTemplate(orderTemplate) as HTMLFormElement;
  const orderForm = new OrderForm(container, events);
  currentOrderForm = orderForm;
  
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  // Проверяем валидность первого шага
  const isValid = buyerModel.canProceedToContacts();
  orderForm.valid = isValid;
  const errors = buyerModel.validateFields(['payment', 'address']);
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

// Отправка формы заказа — переход ко второму шагу
events.on('order:submit', () => {
  const canProceed = buyerModel.canProceedToContacts();
  
  if (canProceed) {
    const container = cloneTemplate(contactsTemplate) as HTMLFormElement;
    const contactsForm = new ContactsForm(container, events);
    currentContactsForm = contactsForm;
    
    const buyerData = buyerModel.getData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    
    // Проверяем валидность второго шага
    const isValid = buyerModel.canSubmitOrder();
    contactsForm.valid = isValid;
    const errors = buyerModel.validateFields(['email', 'phone']);
    contactsForm.errors = errors;
    
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

// Отправка формы контактов — оформление заказа
events.on('contacts:submit', async () => {
  const canSubmit = buyerModel.canSubmitOrder();
  
  if (canSubmit) {
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
      const container = cloneTemplate(successTemplate);
      const success = new Success(container, events);
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

// Загрузка с сервера
api.getProducts()
  .then(products => {
    catalogModel.setItems(products);
  })
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });