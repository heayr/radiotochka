import SafeImage from "./SafeImage";
import Button from "./Button";
import { SectionHeader } from "./sections/SectionHeader";

const STATIONS = [
  {
    id: "dorozhnoe",
    name: "Дорожное радио",
    frequency: "103.5 FM",
    city: "г. Балаково",
    logoSrc: "/images/dorozhnoe.svg",
    tagline: "Вместе в пути!",
    badge: "ТОП-3 в России",
    badgeColor: "bg-pink-100 text-brand-pink border-brand-pink/30",
    description:
      "Одна из крупнейших радиосетей страны с ежедневной аудиторией свыше 8 млн слушателей. Идеальный охват водителей, автомобилистов и семейной платёжеспособной аудитории 30–55 лет.",
    formats: ["Спонсорство прогноза погоды", "Прайм-тайм ротация", "Индивидуальные сценарии"],
    reach: "> 8 000 000 в день",
  },
  {
    id: "nashe",
    name: "Наше Радио",
    frequency: "96.6 FM",
    city: "г. Балаково",
    logoSrc: "/images/nashe.svg",
    tagline: "Главная рок-волна страны",
    badge: "Премиальная лояльность",
    badgeColor: "bg-purple-100 text-brand-purple border-brand-purple/30",
    description:
      "Легендарная радиостанция с максимально вовлеченной и лояльной аудиторией 25–45 лет. Высокая покупательская способность, предприниматели и специалисты.",
    formats: ["Спонсорство утренних шоу", "Имиджевые аудиоролики", "Интеграции в эфир"],
    reach: "Лояльное ядро 25-45 лет",
  },
];

const REGIONAL_CITIES = [
  "Саратов",
  "Вольск",
  "Пугачёв",
  "Пенза",
  "Волгоград",
  "Балашов",
  "Петровск",
  "Калининск",
];

export default function RadioStations() {
  return (
    <section className="pt-12 sm:pt-16 lg:pt-20" id="radio">
      <SectionHeader
        title="Радиовещание"
        subtitle="Мы официальный и эксклюзивный представитель федеральных радиостанций в г. Балаково с прямым эфирным пулом."
        href="#radio"
      />

      <div className="max-w-container mx-auto">
        {/* Карточки ключевых станций */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-cards-gap mb-8">
          {STATIONS.map((station) => (
            <div
              key={station.id}
              className="bg-default-grey rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-gray-200/80 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Шапка карточки */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[60px]">
                    <SafeImage
                      src={station.logoSrc}
                      alt={station.name}
                      width={140}
                      height={45}
                      className="h-auto w-auto max-h-[38px] object-contain"
                    />
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm sm:text-base font-bold text-gray-950 block">
                      {station.frequency}
                    </span>
                    <span className="text-xs text-gray-500">{station.city}</span>
                  </div>
                </div>

                {/* Бейдж и слоган */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${station.badgeColor}`}
                  >
                    {station.badge}
                  </span>
                  <span className="text-sm font-medium text-gray-600 italic">
                    «{station.tagline}»
                  </span>
                </div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  {station.description}
                </p>

                {/* Популярные форматы */}
                <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Форматы размещения:
                  </div>
                  {station.formats.map((format) => (
                    <div
                      key={format}
                      className="flex items-center gap-2 text-sm text-gray-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                      <span>{format}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Футер карточки с кнопкой */}
              <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500">Охват аудитории:</div>
                  <div className="text-base font-bold text-gray-900">{station.reach}</div>
                </div>
                <Button
                  href="#consultation"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Забронировать эфир
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Инфо-блок: Звуковая студия + Прямые договоры */}
        <div className="bg-gradient-to-br from-brand-pink/5 via-white to-brand-purple/5 border border-brand-purple/20 rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-brand-purple text-xs font-semibold mb-3">
                <span>🎙️</span>
                Собственная звуковая студия
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mb-3">
                Изготовление аудиороликов под ключ
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Наши ролики звучат на радиостанциях по всей России. Разрабатываем
                продающий сценарий, привлекаем профессиональных дикторов и пишем
                запоминающийся саунд-дизайн. Готовность — от 24 часов.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Прямые договоры со станциями в городах:
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONAL_CITIES.map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 shadow-sm"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Запустим межрегиональную рекламную кампанию без посредников и лишних наценок.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
