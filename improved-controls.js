// Улучшенный скрипт для более понятного управления
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем ручки для вращения к каждому кругу
    addRotationHandles();
    
    // Создаем маленькие круги по периметру для каждого вращающегося круга
    createSmallCircles();
    
    // Добавляем обработчики событий для вращения кругов
    addRotationEventListeners();
    
    // Добавляем инструкции по управлению
    addControlInstructions();
    
    // Добавляем поддержку клавиатуры
    addKeyboardSupport();
    
    // Инициализируем сетку для тетриса
    initTetrisGrid();
});

// Добавление ручек для вращения
function addRotationHandles() {
    const circleContainers = document.querySelectorAll('.circle-container');
    
    circleContainers.forEach((container, index) => {
        // Создаем левую ручку для вращения против часовой стрелки
        const leftHandle = document.createElement('div');
        leftHandle.className = 'rotation-handle left';
        leftHandle.setAttribute('data-circle', index + 1);
        leftHandle.setAttribute('data-direction', 'left');
        container.appendChild(leftHandle);
        
        // Создаем правую ручку для вращения по часовой стрелке
        const rightHandle = document.createElement('div');
        rightHandle.className = 'rotation-handle right';
        rightHandle.setAttribute('data-circle', index + 1);
        rightHandle.setAttribute('data-direction', 'right');
        container.appendChild(rightHandle);
    });
}

// Создание маленьких кругов по периметру
function createSmallCircles() {
    const circles = document.querySelectorAll('.circle');
    
    circles.forEach(circle => {
        // Проверяем, есть ли уже маленькие круги
        const existingSmallCircles = circle.querySelectorAll('.small-circle');
        if (existingSmallCircles.length > 0) {
            return; // Если круги уже созданы, пропускаем
        }
        
        // Создаем 8 маленьких кругов по периметру
        for (let i = 0; i < 8; i++) {
            const smallCircle = document.createElement('div');
            smallCircle.className = `small-circle small-circle-${i + 1}`;
            
            // Позиционируем маленькие круги равномерно по периметру
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 85; // Радиус большого круга минус радиус маленького круга
            
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            smallCircle.style.left = `calc(50% + ${x}px - 15px)`;
            smallCircle.style.top = `calc(50% + ${y}px - 15px)`;
            
            circle.appendChild(smallCircle);
        }
    });
}

// Добавление обработчиков событий для вращения
function addRotationEventListeners() {
    // Обработчики для ручек вращения
    const rotationHandles = document.querySelectorAll('.rotation-handle');
    rotationHandles.forEach(handle => {
        handle.addEventListener('click', handleRotationClick);
        handle.addEventListener('touchstart', handleRotationTouch);
    });
    
    // Обработчики для вращения мышью
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.addEventListener('mousedown', handleMouseDown);
        circle.addEventListener('touchstart', handleTouchStart, { passive: false });
    });
    
    // Глобальные обработчики для завершения вращения
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
}

// Обработчик клика по ручке вращения
function handleRotationClick(event) {
    const circleId = event.target.getAttribute('data-circle');
    const direction = event.target.getAttribute('data-direction');
    const circle = document.getElementById(`circle-${circleId}`);
    
    // Получаем текущий угол поворота
    let currentRotation = getCurrentRotation(circle);
    
    // Вращаем на 45 градусов в нужном направлении
    if (direction === 'left') {
        currentRotation -= 45;
    } else {
        currentRotation += 45;
    }
    
    // Применяем новый угол поворота
    circle.style.transform = `rotate(${currentRotation}deg)`;
    
    // Обновляем цвет в зависимости от скорости вращения
    updateCircleColor(circle, 45);
    
    // Показываем визуальный эффект нажатия
    event.target.style.transform = event.target.classList.contains('left') ? 
        'translateY(-50%) scale(0.9)' : 'translateY(-50%) scale(0.9)';
    
    setTimeout(() => {
        event.target.style.transform = event.target.classList.contains('left') ? 
            'translateY(-50%)' : 'translateY(-50%)';
    }, 100);
}

// Обработчик касания ручки вращения
function handleRotationTouch(event) {
    event.preventDefault();
    handleRotationClick(event);
}

// Переменные для отслеживания вращения мышью
let isDragging = false;
let startAngle = 0;
let currentCircle = null;
let lastRotation = 0;
let rotationSpeed = 0;
let lastTime = 0;

// Обработчик нажатия мыши на круг
function handleMouseDown(event) {
    if (isDragging) return;
    
    isDragging = true;
    currentCircle = event.target.closest('.circle');
    
    // Получаем координаты центра круга
    const rect = currentCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем начальный угол
    startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    lastRotation = getCurrentRotation(currentCircle);
    lastTime = Date.now();
    
    // Добавляем класс активного вращения
    currentCircle.classList.add('rotating');
    
    // Показываем подсказку о вращении
    showRotationHint(currentCircle);
}

// Обработчик начала касания круга
function handleTouchStart(event) {
    event.preventDefault();
    if (isDragging) return;
    
    const touch = event.touches[0];
    isDragging = true;
    currentCircle = event.target.closest('.circle');
    
    // Получаем координаты центра круга
    const rect = currentCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем начальный угол
    startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    lastRotation = getCurrentRotation(currentCircle);
    lastTime = Date.now();
    
    // Добавляем класс активного вращения
    currentCircle.classList.add('rotating');
    
    // Показываем подсказку о вращении
    showRotationHint(currentCircle);
}

// Обработчик движения мыши
function handleMouseMove(event) {
    if (!isDragging || !currentCircle) return;
    
    // Получаем координаты центра круга
    const rect = currentCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем текущий угол
    const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    
    // Вычисляем разницу углов
    let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
    
    // Применяем новый угол поворота
    const newRotation = lastRotation + angleDiff;
    currentCircle.style.transform = `rotate(${newRotation}deg)`;
    
    // Вычисляем скорость вращения
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    
    if (timeDiff > 0) {
        rotationSpeed = Math.abs(angleDiff) / timeDiff * 100;
        
        // Обновляем цвет в зависимости от скорости вращения
        updateCircleColor(currentCircle, rotationSpeed);
        
        lastTime = currentTime;
    }
}

// Обработчик движения при касании
function handleTouchMove(event) {
    event.preventDefault();
    if (!isDragging || !currentCircle) return;
    
    const touch = event.touches[0];
    
    // Получаем координаты центра круга
    const rect = currentCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Вычисляем текущий угол
    const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    
    // Вычисляем разницу углов
    let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
    
    // Применяем новый угол поворота
    const newRotation = lastRotation + angleDiff;
    currentCircle.style.transform = `rotate(${newRotation}deg)`;
    
    // Вычисляем скорость вращения
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;
    
    if (timeDiff > 0) {
        rotationSpeed = Math.abs(angleDiff) / timeDiff * 100;
        
        // Обновляем цвет в зависимости от скорости вращения
        updateCircleColor(currentCircle, rotationSpeed);
        
        lastTime = currentTime;
    }
}

// Обработчик отпускания кнопки мыши
function handleMouseUp() {
    if (!isDragging) return;
    
    isDragging = false;
    
    if (currentCircle) {
        // Удаляем класс активного вращения
        currentCircle.classList.remove('rotating');
        
        // Скрываем подсказку о вращении
        hideRotationHint();
        
        // Добавляем инерцию вращения
        addRotationInertia(currentCircle, rotationSpeed);
        
        currentCircle = null;
    }
}

// Обработчик завершения касания
function handleTouchEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    
    if (currentCircle) {
        // Удаляем класс активного вращения
        currentCircle.classList.remove('rotating');
        
        // Скрываем подсказку о вращении
        hideRotationHint();
        
        // Добавляем инерцию вращения
        addRotationInertia(currentCircle, rotationSpeed);
        
        currentCircle = null;
    }
}

// Добавление инерции вращения
function addRotationInertia(circle, speed) {
    // Ограничиваем максимальную скорость инерции
    const maxInertiaSpeed = 50;
    const inertiaSpeed = Math.min(speed, maxInertiaSpeed);
    
    if (inertiaSpeed < 5) return; // Игнорируем слишком медленное вращение
    
    // Получаем текущий угол поворота
    const currentRotation = getCurrentRotation(circle);
    
    // Определяем направление вращения (по часовой или против)
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Вычисляем длительность инерции в зависимости от скорости
    const inertiaDuration = inertiaSpeed * 50; // миллисекунды
    
    // Вычисляем угол инерции
    const inertiaAngle = inertiaSpeed * direction;
    
    // Применяем инерцию с плавным замедлением
    circle.style.transition = `transform ${inertiaDuration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
    circle.style.transform = `rotate(${currentRotation + inertiaAngle}deg)`;
    
    // Обновляем цвет в зависимости от скорости инерции
    updateCircleColor(circle, inertiaSpeed);
    
    // Сбрасываем transition после завершения анимации
    setTimeout(() => {
        circle.style.transition = '';
    }, inertiaDuration);
}

// Получение текущего угла поворота элемента
function getCurrentRotation(element) {
    const style = window.getComputedStyle(element);
    const matrix = style.getPropertyValue('transform');
    
    if (matrix === 'none') {
        return 0;
    }
    
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    
    return (angle < 0) ? angle + 360 : angle;
}

// Обновление цвета круга в зависимости от скорости вращения
function updateCircleColor(circle, speed) {
    // Нормализуем скорость от 0 до 1
    const normalizedSpeed = Math.min(speed / 100, 1);
    
    // Вычисляем цвет от холодного (синий) до горячего (красный)
    // Используем HSL для плавного перехода цветов
    const hue = 240 - normalizedSpeed * 240; // от 240 (синий) до 0 (красный)
    const saturation = 70 + normalizedSpeed * 30; // увеличиваем насыщенность с ростом скорости
    const lightness = 50; // постоянная яркость
    
    // Применяем цвет к маленьким кругам
    const smallCircles = circle.querySelectorAll('.small-circle');
    smallCircles.forEach(smallCircle => {
        smallCircle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        smallCircle.style.boxShadow = `0 0 ${5 + normalizedSpeed * 10}px hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
}

// Показ подсказки о вращении
function showRotationHint(circle) {
    // Проверяем, существует ли уже подсказка
    let hint = document.getElementById('rotation-hint');
    
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'rotation-hint';
        hint.className = 'rotation-hint';
        hint.textContent = 'Вращайте круг движением мыши или пальца';
        document.body.appendChild(hint);
    }
    
    // Позиционируем подсказку над кругом
    const rect = circle.getBoundingClientRect();
    hint.style.left = `${rect.left + rect.width / 2}px`;
    hint.style.top = `${rect.top - 40}px`;
    hint.style.display = 'block';
    
    // Скрываем подсказку через 3 секунды
    setTimeout(() => {
        hint.style.opacity = '0';
    }, 3000);
}

// Скрытие подсказки о вращении
function hideRotationHint() {
    const hint = document.getElementById('rotation-hint');
    if (hint) {
        hint.style.opacity = '0';
        setTimeout(() => {
            hint.style.display = 'none';
        }, 500);
    }
}

// Добавление инструкций по управлению
function addControlInstructions() {
    // Проверяем, существуют ли уже инструкции
    let instructions = document.querySelector('.control-instructions');
    
    if (!instructions) {
        instructions = document.createElement('div');
        instructions.className = 'control-instructions';
        instructions.innerHTML = `
            <h3>Как управлять:</h3>
            <ul>
                <li>Нажмите и перетащите круг для вращения</li>
                <li>Используйте золотые ручки для точного вращения</li>
                <li>Совместите круги с целевыми позициями</li>
            </ul>
            <div class="keyboard-controls">
                Клавиатура: <span class="keyboard-key">←</span> <span class="keyboard-key">→</span> для выбора круга, 
                <span class="keyboard-key">A</span> <span class="keyboard-key">D</span> для вращения
            </div>
        `;
        document.body.appendChild(instructions);
        
        // Добавляем кнопку для скрытия/показа инструкций
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-instructions';
        toggleButton.textContent = 'Скрыть инструкции';
        toggleButton.addEventListener('click', function() {
            const content = instructions.querySelector('ul');
            const keyboardControls = instructions.querySelector('.keyboard-controls');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                keyboardControls.style.display = 'block';
                this.textContent = 'Скрыть инструкции';
            } else {
                content.style.display = 'none';
                keyboardControls.style.display = 'none';
                this.textContent = 'Показать инструкции';
            }
        });
        instructions.appendChild(toggleButton);
    }
}

// Добавление поддержки клавиатуры
function addKeyboardSupport() {
    let selectedCircleIndex = 0;
    const circles = document.querySelectorAll('.circle');
    
    // Добавляем обработчик клавиш
    document.addEventListener('keydown', function(event) {
        // Выбор круга
        if (event.key === 'ArrowLeft') {
            selectedCircleIndex = (selectedCircleIndex - 1 + circles.length) % circles.length;
            highlightSelectedCircle();
        } else if (event.key === 'ArrowRight') {
            selectedCircleIndex = (selectedCircleIndex + 1) % circles.length;
            highlightSelectedCircle();
        }
        
        // Вращение выбранного круга
        if (selectedCircleIndex >= 0 && selectedCircleIndex < circles.length) {
            const circle = circles[selectedCircleIndex];
            let currentRotation = getCurrentRotation(circle);
            
            if (event.key === 'a' || event.key === 'A') {
                // Вращение против часовой стрелки
                currentRotation -= 15;
                circle.style.transform = `rotate(${currentRotation}deg)`;
                updateCircleColor(circle, 30);
            } else if (event.key === 'd' || event.key === 'D') {
                // Вращение по часовой стрелке
                currentRotation += 15;
                circle.style.transform = `rotate(${currentRotation}deg)`;
                updateCircleColor(circle, 30);
            }
        }
    });
    
    // Функция для подсветки выбранного круга
    function highlightSelectedCircle() {
        circles.forEach((circle, index) => {
            if (index === selectedCircleIndex) {
                circle.parentNode.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
            } else {
                circle.parentNode.style.boxShadow = '';
            }
        });
    }
}

// Инициализация сетки для тетриса
function initTetrisGrid() {
    const tetrisContainer = document.getElementById('tetris-container');
    if (!tetrisContainer) return;
    
    const tetrisGrid = tetrisContainer.querySelector('.tetris-grid');
    if (!tetrisGrid) return;
    
    // Очищаем существующую сетку
    tetrisGrid.innerHTML = '';
    
    // Создаем ячейки сетки
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'tetris-grid-cell';
        cell.setAttribute('data-index', i);
        tetrisGrid.appendChild(cell);
    }
    
    // Добавляем статус тетриса
    const tetrisStatus = document.createElement('div');
    tetrisStatus.className = 'tetris-status';
    tetrisStatus.textContent = 'Тетрис готов к построению пирамиды';
    tetrisContainer.appendChild(tetrisStatus);
}
