# Радиоточка — Платформа и сайт цифрового агентства

Официальный веб-сайт и панель управления контентом для агентства цифрового маркетинга и разработки **«Радиоточка»**. Проект построен на стеке **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Prisma ORM** (PostgreSQL) и **NextAuth v5 (Auth.js)** с двухфакторной аутентификацией (2FA).

---

## ⚡ Особенности и возможности

### 🎨 Клиентская часть (Frontend & UX)
- **Awwwards-уровень дизайна**: микро-анимации, бегущие строки (Marquee), интерактивные карточки услуг и кейсов, типографика без артефактов обрезки символов.
- **Адаптивность**: оптимизация от мобильных экранов (360px+) до 2K (2560×1440) и ультрашироких мониторов.
- **Интерактивные секции**:
  - `Hero` — динамический главный экран с акцидентной типографикой.
  - `Manifesto` — ценности и манифест агентства.
  - `Services` — перечень услуг с аккордеонами и тегами.
  - `Work` — портфолио и кейсы студии.
  - `LogoSection` — клиенты и партнёры с плавным бесконечным скроллом и адаптивной скоростью.
  - `Process` — интерактивный горизонтальный процесс работы.
  - `Stats` — ключевые показатели и метрики в цифрах.
  - `Form` / `Footer` — интерактивная форма заявки с валидацией и отправкой через Web3Forms / Resend.

### 🛡️ Панель управления (Admin & Moderation)
- **Ролевая модель доступа (RBAC)**: `super_admin`, `admin`, `moderator`, `user`.
- **Визуальные редакторы секций**: возможность менять контент и изображения без вмешательства в код.
- **Аудит и история**: логирование действий администраторов (`AuditLog`) и история изменений контентных блоков (`ContentHistory`).
- **Безопасная авторизация**: NextAuth v5 с сессиями на базе JWT/Prisma, хешированием паролей (bcrypt) и двухфакторной аутентификацией (TOTP 2FA).

---

## 🛠️ Стек технологий

| Категория | Технологии |
|:---|:---|
| **Фреймворк** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Библиотека UI** | [React 19](https://react.dev/) |
| **Язык** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Стилизация** | [Tailwind CSS 3](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **База данных** | [PostgreSQL 16](https://www.postgresql.org/) |
| **ORM** | [Prisma 5](https://www.prisma.io/) |
| **Аутентификация** | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) + Speakeasy (TOTP 2FA) |
| **Формы и валидация** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Email-сервисы** | [Resend](https://resend.com/), [Web3Forms](https://web3forms.com/) |
| **Контейнеризация** | [Docker](https://www.docker.com/), Docker Compose |

---

## 📂 Структура проекта

```text
├── app/                      # Next.js App Router (страницы, layout, роуты)
│   ├── (admin)/admin/        # Панель управления и визуальные редакторы секций
│   ├── (auth)/auth/          # Страницы логина, регистрации и 2FA
│   ├── api/                  # API эндпоинты (формы, аутентификация)
│   ├── components/           # UI компоненты
│   │   ├── admin/            # Компоненты админки и редакторы секций
│   │   ├── sections/         # Секции главной страницы (Hero, Work, Stats, ...)
│   │   └── ui/               # Базовые UI элементы (Button, Input, Modal, ...)
│   ├── layout.tsx            # Корневой layout
│   └── page.tsx              # Главная страница сайта
├── constants/                # Роли пользователей, статусы контента
├── lib/                      # Вспомогательные утилиты и сервисы
│   ├── actions/              # Server Actions (аутентификация, админ-действия)
│   ├── services/             # Сервисный слой (пользователи, контент)
│   ├── db.ts                 # Инициализация Prisma Client
│   ├── mailer.ts             # Интеграция с Resend для отправки писем
│   ├── rate-limit.ts         # Защита от перебора запросов
│   └── validations.ts        # Zod-схемы валидации
├── prisma/                   # Схема базы данных, миграции и сидеры
│   ├── migrations/           # SQL-миграции Prisma
│   ├── schema.prisma         # Prisma Schema
│   └── seed.ts               # Начальный сидинг базы данных
├── public/                   # Статические файлы (шрифты, svg, логотипы, favicon)
├── types/                    # Описания типов TypeScript
├── auth.ts                   # Конфигурация NextAuth v5
├── middleware.ts             # Защита приватных роутов и статики
├── tailwind.config.ts        # Конфигурация Tailwind CSS (шрифты, цвета, брейкпоинты)
└── docker-compose.yml        # Docker Compose для запуска проекта
```

---

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/heayr/radiotochka.git
cd radiotochka
npm install
```

### 2. Настройка переменных окружения

Скопируйте пример файла конфигурации:

```bash
cp .env.example .env
```

Заполните переменные в `.env` (подробнее см. раздел [Переменные окружения](#-переменные-окружения)).

### 3. Настройка базы данных (Prisma)

Убедитесь, что PostgreSQL запущен, и выполните:

```bash
# Генерация Prisma Client
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Сидинг базы данных (создание дефолтных пользователей/контента)
npm run prisma:seed
```

### 4. Запуск сервера разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

---

## 🐳 Запуск через Docker

### Режим разработки (Hot Reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Продакшн-сборка

```bash
docker compose up --build -d
```

---

## 🔑 Переменные окружения

| Переменная | Обязательна | Описание | Пример |
|:---|:---:|:---|:---|
| `DATABASE_URL` | **Да** | Строка подключения к PostgreSQL | `postgresql://user:pass@localhost:5432/radiotochka?schema=public` |
| `AUTH_SECRET` | **Да** | Секретный ключ для подписи сессий и JWT (`openssl rand -base64 32`) | `secret_32_characters_long` |
| `AUTH_TRUST_HOST` | Нет | Доверять заголовку Host за обратным прокси | `true` |
| `AUTH_URL` | Нет | URL авторизации (для продакшна) | `https://radiotochka.ru` |
| `RESEND_API_KEY` | Опционально | API-ключ Resend для отправки писем и 2FA | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Опционально | Email отправителя | `noreply@radiotochka.ru` |
| `NEXT_PUBLIC_APP_URL` | Опционально | Публичный базовый URL сайта | `https://radiotochka.ru` |
| `NEXT_PUBLIC_ACCESS_KEY_WEB_FORM` | Опционально | Токен формы Web3Forms | `xxxxxxxx-xxxx-xxxx-xxxx` |

> ⚠️ **Важно**: Никогда не коммитьте файл `.env` в репозиторий. Все секреты должны быть в `.gitignore`.

---

## 📜 Доступные скрипты

| Скрипт | Описание |
|:---|:---|
| `npm run dev` | Запуск сервера разработки Next.js |
| `npm run build` | Генерация Prisma Client и сборка production-бандла |
| `npm run start` | Запуск собранного production-сервера |
| `npm run lint` | Проверка кодовой базы через ESLint |
| `npm run prisma:generate` | Генерация типов и клиента Prisma |
| `npm run prisma:migrate` | Создание и применение миграций схемы |
| `npm run prisma:seed` | Запуск скрипта начального заполнения БД (`prisma/seed.ts`) |

---

## 📄 Лицензия

Все права защищены © Студия разработки **«Радиоточка»**.
