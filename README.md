# Вращающиеся круги - Интерактивный компонент

Интерактивный веб-компонент с тремя вращающимися кругами, расположенными один над другим. Каждый круг содержит маленькие круги по периметру (как в подшипнике) и может вращаться в обоих направлениях. Цвет кругов меняется в зависимости от скорости вращения: от холодных оттенков при медленном вращении до красных при быстром.

## Особенности

- Три вращающихся круга, расположенных один над другим
- Маленькие круги по периметру каждого большого круга (как в подшипнике)
- Вращение в обоих направлениях
- Изменение цвета в зависимости от скорости вращения (от холодных до красных)
- Поддержка управления мышью и сенсорными устройствами
- Плавная анимация с инерцией
- Совместимость с Ruby on Rails

## Структура проекта

```
rotating_circles_app/
├── index.html      # Основной HTML-файл
├── css/
│   └── style.css   # Стили компонента
└── js/
    └── script.js   # JavaScript-логика вращения и анимации
```

## Интеграция с Ruby on Rails

Для интеграции компонента с Ruby on Rails выполните следующие шаги:

1. Скопируйте файлы `style.css` и `script.js` в соответствующие директории вашего Rails-проекта:
   - `style.css` в `app/assets/stylesheets/`
   - `script.js` в `app/assets/javascripts/`

2. Добавьте ссылки на эти файлы в ваш макет или представление:

```erb
<%# В файле app/views/layouts/application.html.erb %>
<%= stylesheet_link_tag 'style' %>
<%= javascript_include_tag 'script' %>
```

3. Добавьте HTML-структуру компонента в нужное представление:

```erb
<%# В файле вашего представления, например app/views/pages/home.html.erb %>
<div class="container">
  <div class="controls">
    <button id="reset-btn">Сбросить</button>
  </div>
  <div class="circles-container">
    <div class="circle-wrapper" id="circle-wrapper-1">
      <div class="circle" id="circle-1"></div>
    </div>
    <div class="circle-wrapper" id="circle-wrapper-2">
      <div class="circle" id="circle-2"></div>
    </div>
    <div class="circle-wrapper" id="circle-wrapper-3">
      <div class="circle" id="circle-3"></div>
    </div>
  </div>
</div>
```

4. Убедитесь, что в вашем Rails-проекте настроена обработка JavaScript:

```ruby
# В файле config/initializers/assets.rb
Rails.application.config.assets.precompile += %w( script.js style.css )
```

## Настройка и кастомизация

Вы можете настроить компонент, изменяя параметры в файле `script.js`:

```javascript
// Конфигурация для кругов
const config = {
    smallCirclesCount: 12, // Количество маленьких кругов на каждом большом круге
    maxSpeed: 10,          // Максимальная скорость вращения
    friction: 0.98,        // Коэффициент трения (замедление)
    colorRanges: {
        cold: { r: 41, g: 128, b: 185 }, // Холодный цвет (#2980b9)
        hot: { r: 231, g: 76, b: 60 }    // Горячий цвет (#e74c3c)
    }
};
```

## Использование

- Для вращения кругов: нажмите и перетащите любой круг в нужном направлении
- Для сброса вращения: нажмите кнопку "Сбросить"
- Скорость вращения и цвет зависят от интенсивности движения
