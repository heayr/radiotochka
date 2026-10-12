# Frontend Architecture & Engineering Guidelines (Radiotochka)

## 1. Запрет на несанкционированные билды
- **НИКОГДА** не запускать `npm run build` без прямого запроса/разрешения пользователя.
- Для проверки кода использовать: `./node_modules/.bin/tsc --noEmit` и `npm run lint`.

## 2. Архитектура папок и компонентов
- Все подпапки в `components/` строго в **lowercase** (`ui/`, `layout/`, `providers/`, `sections/`, `auth/`).
- `app/components/ui/` — строго универсальные дизайн-примитивы (`Button`, `Card`, `Badge`, `SafeImage`, `Toast`, `Alert`, `Surface`, `Input`).
- `app/components/providers/` — React Context провайдеры (`SessionProvider`).
- `app/components/layout/` — `Navbar`, `Footer`, `CookieConsent`.
- Приватные компоненты роутов — колоцируются рядом с роутом (`app/admin/content/editors/EditorFormFooter.tsx`).

## 3. Декларативность и DRY (никакого хардкода JSX вместо .map())
- Ссылки навигации, меню и списки обязаны браться из типизированных массивов и рендериться через `.map()`.
- Единый источник навигации — `constants/navigation.ts` (используется синхронно в `Navbar.tsx` и `Footer.tsx`).
- Большие SVG (водяные знаки, сложные иллюстрации) инкапсулируются в отдельные компоненты (например, `FooterWatermark.tsx`).

## 4. Строгий TypeScript (Zero any)
- Запрещено использовать `any` в базовых UI-компонентах.
- Полная поддержка `...rest` HTML-атрибутов.
- Поддержка Next.js `Link` для внутренних маршрутов и `<a>` для внешних.
