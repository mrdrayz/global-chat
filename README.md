# Глобальный чат "Chill-Chat"

Веб-приложение для обмена сообщениями в реальном времени с авторизацией пользователей. Все участники общаются в едином глобальном чате, читать и отправлять сообщения могут только авторизованные пользователи. 

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-purple?logo=redux)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)

## Функциональность приложения 

### Регистрация и авторизация 

- Регистрация нового пользователя с уникальным именем
- Авторизация с получением JWT-токена
- Сохранение сессии в LocalStorage (повторный вход не требуется после перезагрузки);
- Простая валидация форм: 
   - проверка заполнения обязательных полей при регистрации и аутентификации
   - ограничение длины имени пользователя (30 символов) и пароля (50 символов)

### Глобальный чат

- Просмотр сообщений всех пользователей
- Отправка сообщений с ограничением в 150 символов
- Автоматическое обновление сообщений каждые 3 секунды
- Визуальное выделение собственных сообщений
- Наличие приписки "(Вы)" к собственному нику
- Возможность добавления эмодзи в сообщение

### Virtual Scroll 

- Рендеринг только видимых сообщений для оптимизации производительности
- Кнопка быстрой прокрутки вниз (появляется при прокрутке вверх)
- Счетчик новых сообщений с бейджем на кнопке прокрутки;
- Разделитель "Новые сообщения" между прочитанными и непрочитанными сообщениями
- Автоскролл к новым сообщениям (если пользователь находится в нижней части окна)

### Интерфейс 

- Космическая тема с анимированным градиентным фоном
- Glassmorphism-дизайн форм (полупрозрачные с размытием)
- Выпадающее меню профиля с автаром и ником
- Плавные анимации появления сообщений
- Адаптивный плавный скроллбар в фирменных цветах


## Технологии 

- React 18.2.0  -  UI-библиотека (Библиотека интерфейсов)
- TypeScript 5.3.3  -  Типизация (Статическая типизация)
- Redux Toolkit 2.0.1  -  Состояние (Управление состоянием)
- React Router DOM 7.13.1  -  Роутинг (Навигация между страницами)
- Vite 5.0.11  -  Сборка (Dev-сервер и сборка)
- Vitest 1.2.0  -  Тестирование (Unit-тесты)
- ESLint 8.56.0  -  Линтинг (Проверка качества кода)
- Prettier 3.8.1  -  Форматирование (Единообразное форматирование кода)
- Express  -  Бэкенд (REST API сервер)
- JWT  -  Авторизация (Токены аутентификации)

## API сервера 

Бэкенд реализован на Express и предоставляет REST API для авторизации и обмена сообщениями.

### Эндпоинты

В приложении реализованы следующие точки подключения:

- '/register' [POST]: для регистрации новых пользователей.
- '/login' [POST]: для входа в систему зарегистрированных пользователей.
- '/chats' [GET]: для получения всех чатов.
- '/chats' [POST]: для отправки сообщений в чат.

### Тестирование API в Swagger

Для тестирования API в Swagger нужно перейти по ссылке [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

### Изменение порта приложения

Порт сервера по умолчанию установлен как `3001`, но это значение может быть изменено в разделе вашего программного кода, где выполняется функция `getPort()`. В этой функции вы можете передать значение порта в качестве аргумента, и это значение будет использоваться приложением.

```javascript
app.listen(getPort(3005), () => {
    console.log(`Server started at http://localhost:${getPort(3005)}`);
});
```

В приведенном выше примере приложение будет доступно по адресу [http://localhost:3005/api-docs](http://localhost:3005/api-docs).

## Установка и запуск 

### Требования 
 
- Node.js v18+
- npm v9+

### Клонирование репозитория 

```bash
git clone https://gitlab.education.tbank.ru/frontend-academy-2-2026/homework-forks/i.oseledko/react-state-management.git

Необходимо запустить клиент и сервер в двух отдельных терминалах:

Терминал 1 - запуск сервера:

cd homework-backend
npm install
npm start

Сервер запустится на http://localhost:3001

Терминал 2 - запуск клиента:

cd homework-frontend
npm install
npm start

Клиент запустится на http://localhost:5173

Запуск тестов:

cd homework-frontend
npm test

Тестами покрыты: 

- Redux-слайсы (authSlice, chatSlice)
- API-сервис - моки fetch, проверка всех эндпоинтов, обработка ошибок

```

### Скрипты 

- npm run dev - Запуск dev-сервера
- npm run build - Сборка для продакшена
- npm run preview - Предпросмотр сборки
- npm test - Запуск тестов
- npm run lint - Проверка кода линтером
- npm run lint: fix - Автоисправление ошибок линтера
- npm run format - Форматирование кода Prettier
- npm run format: check - Проверка форматирования

## Демо-деплой

**Ссылка:** https://global-chat-frontend.onrender.com

> **Примечание:** Это демо-версия деплоя.
> Изменения не сохраняются после перезапуска сервера.
> Первая загрузка может занять ~30 секунд (холодный старт Render).
> После 15 минут бездействия в приложении сервер отключается.

## Демонстрация работы 


### Регистрация провалена

<img width="1521" height="942" alt="image" src="https://github.com/mrdrayz/global-chat-t-bank-frontend-course/blob/main/react-state-management/demo-images/registration-unsuccessful.png" />

### Регистрация прошла успешно

<img width="1521" height="942" alt="image" src="https://github.com/mrdrayz/global-chat-t-bank-frontend-course/blob/main/react-state-management/demo-images/registration-successful.png" />


### Попытка входа провалена

<img width="1521" height="942" alt="image" src="https://github.com/mrdrayz/global-chat-t-bank-frontend-course/blob/main/react-state-management/demo-images/unsuccessful-authentication.png" />

### Страница глобального чата

<img width="1521" height="942" alt="image" src="https://github.com/mrdrayz/global-chat-t-bank-frontend-course/blob/main/react-state-management/demo-images/chat-page.png" />
