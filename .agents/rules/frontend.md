---
description: "Правила архитектуры компонентов, чистого кода и рабочего процесса"
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
---

# Frontend Architecture & Engineering Guidelines

## 1. Запрет на несанкционированные билды
- **НИКОГДА** не запускать `npm run build` без прямого запроса/разрешения пользователя.
- Для проверки кода использовать: `./node_modules/.bin/tsc --noEmit` и `npm run lint`.

## 2. Архитектура папок и компонентов
- Все подпапки в `components/` строго в **lowercase** (`ui/`, `layout/`, `providers/`, `sections/`, `auth/`).
- `components/ui/` — строго универсальные дизайн-примитивы (`Button`, `Card`, `Badge`, `SafeImage`, `Toast`, `Alert`, `Surface`, `Input`).
- `components/providers/` — React Context провайдеры (`SessionProvider`).
- `components/layout/` — `Navbar`, `Footer`, `CookieConsent`.
- Приватные компоненты роутов — колоцируются рядом с роутом.

## 3. Декларативность и DRY (никакого хардкода JSX вместо .map())
- Ссылки навигации, меню и списки обязаны браться из типизированных массивов и рендериться через `.map()`.
- Единый источник навигации — `constants/navigation.ts` (используется синхронно в `Navbar.tsx` и `Footer.tsx`).
- Большие SVG (водяные знаки, сложные иллюстрации) инкапсулируются в отдельные компоненты (например, `FooterWatermark.tsx`).

## 4. Строгий TypeScript (Zero any)
- Запрещено использовать `any` в базовых UI-компонентах.
- Полная поддержка `...rest` HTML-атрибутов.
- Поддержка Next.js `Link` для внутренних маршрутов и `<a>` для внешних.
