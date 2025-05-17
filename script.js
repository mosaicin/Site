// Оригинальный скрипт для вращения кругов и интерактивности
document.addEventListener('DOMContentLoaded', function() {
    // Создаем маленькие круги по периметру для каждого вращающегося круга
    createSmallCircles();
    
    // Добавляем обработчики событий для вращения кругов
    setupRotationControls();
    
    // Добавляем обработчики для египетских богов
    setupEgyptianGods();
    
    // Инициализируем третью голову дракона с эффектом изменения
    initDragonThirdHead();
});

// Создание маленьких кругов по периметру большого круга
function createSmallCircles() {
    const smallCirclesContainers = document.querySelectorAll('.small-circles');
    
    smallCirclesContainers.forEach(container => {
        const numCircles = 12; // Количество маленьких кругов
        const radius = 100; // Радиус большого круга
        
        for (let i = 0; i < numCircles; i++) {
            const angle = (i / numCircles) * Math.PI * 2; // Угол в радианах
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            const smallCircle = document.createElement('div');
            smallCircle.className = 'small-circle';
            smallCircle.style.left = `${x + radius - 10}px`; // -10 для центрирования (половина ширины)
            smallCircle.style.top = `${y + radius - 10}px`; // -10 для центрирования (половина высоты)
            
            container.appendChild(smallCircle);
        }
    });
}

// Настройка управления вращением
function setupRotationControls() {
    const circles = document.querySelectorAll('.rotating-circle');
    
    circles.forEach(circle => {
        let isDragging = false;
        let startX, startY;
        let rotationSpeed = 0;
        let currentRotation = 0;
        let autoRotation = null;
        
        // Остановка автоматического вращения при взаимодействии
        circle.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            if (autoRotation) {
                clearInterval(autoRotation);
                autoRotation = null;
            }
            circle.style.animation = 'none';
        });
        
        // Обработка движения мыши для вращения
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Вычисляем скорость вращения на основе движения мыши
            rotationSpeed = deltaX * 0.5;
            
            // Обновляем текущий угол вращения
            currentRotation += rotationSpeed;
            
            // Применяем вращение
            circle.style.transform = `rotateY(${currentRotation}deg)`;
            
            // Обновляем цвет в зависимости от скорости
            updateColorBasedOnSpeed(circle, Math.abs(rotationSpeed));
            
            startX = e.clientX;
            startY = e.clientY;
        });
        
        // Прекращение вращения при отпускании кнопки мыши
        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            
            // Запускаем автоматическое вращение с текущей скоростью и затуханием
            startAutoRotation(circle, rotationSpeed, currentRotation);
        });
        
        // Обработка сенсорных событий для мобильных устройств
        circle.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            if (autoRotation) {
                clearInterval(autoRotation);
                autoRotation = null;
            }
            circle.style.animation = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            rotationSpeed = deltaX * 0.5;
            currentRotation += rotationSpeed;
            
            circle.style.transform = `rotateY(${currentRotation}deg)`;
            updateColorBasedOnSpeed(circle, Math.abs(rotationSpeed));
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', function() {
            if (!isDragging) return;
            isDragging = false;
            
            startAutoRotation(circle, rotationSpeed, currentRotation);
        });
        
        // Функция для запуска автоматического вращения с затуханием
        function startAutoRotation(element, initialSpeed, initialRotation) {
            let speed = initialSpeed;
            let rotation = initialRotation;
            
            autoRotation = setInterval(() => {
                // Применяем затухание к скорости
                speed *= 0.95;
                
                // Обновляем вращение
                rotation += speed;
                element.style.transform = `rotateY(${rotation}deg)`;
                
                // Обновляем цвет в зависимости от скорости
                updateColorBasedOnSpeed(element, Math.abs(speed));
                
                // Останавливаем автоматическое вращение, когда скорость становится очень маленькой
                if (Math.abs(speed) < 0.1) {
                    clearInterval(autoRotation);
                    autoRotation = null;
                    
                    // Возвращаем стандартную анимацию вращения
                    element.style.animation = 'rotate 20s linear infinite';
                    element.classList.remove('speed-cold', 'speed-medium', 'speed-hot');
                    element.classList.add('speed-cold');
                }
            }, 16); // ~60fps
        }
    });
}

// Обновление цвета круга в зависимости от скорости вращения
function updateColorBasedOnSpeed(element, speed) {
    // Удаляем все классы скорости
    element.classList.remove('speed-cold', 'speed-medium', 'speed-hot');
    
    // Добавляем соответствующий класс в зависимости от скорости
    if (speed < 5) {
        element.classList.add('speed-cold');
    } else if (speed < 15) {
        element.classList.add('speed-medium');
    } else {
        element.classList.add('speed-hot');
    }
}

// Настройка интерактивности египетских богов
function setupEgyptianGods() {
    const gods = document.querySelectorAll('.god');
    
    gods.forEach(god => {
        god.addEventListener('click', function() {
            // Получаем тип жеста из атрибута data-gesture
            const gestureType = this.getAttribute('data-gesture');
            
            // Показываем жест
            showGesture(gestureType);
            
            // Анимация бога
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 500);
        });
    });
}

// Показ жеста при нажатии на египетского бога
function showGesture(gestureType) {
    // Создаем элемент для отображения жеста
    const gesture = document.createElement('div');
    gesture.className = 'gesture ' + gestureType;
    gesture.style.position = 'absolute';
    gesture.style.top = '50%';
    gesture.style.left = '50%';
    gesture.style.transform = 'translate(-50%, -50%)';
    gesture.style.width = '200px';
    gesture.style.height = '200px';
    gesture.style.backgroundSize = 'contain';
    gesture.style.backgroundRepeat = 'no-repeat';
    gesture.style.backgroundPosition = 'center';
    gesture.style.zIndex = '100';
    
    // Устанавливаем изображение жеста в зависимости от типа
    switch(gestureType) {
        case 'gesture-1':
            gesture.style.backgroundImage = 'url("images/gesture_1.png")';
            break;
        case 'gesture-2':
            gesture.style.backgroundImage = 'url("images/gesture_2.png")';
            break;
        case 'gesture-3':
            gesture.style.backgroundImage = 'url("images/gesture_3.png")';
            break;
    }
    
    // Добавляем жест на страницу
    document.body.appendChild(gesture);
    
    // Анимация появления и исчезновения
    gesture.style.opacity = '0';
    gesture.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        gesture.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        gesture.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(gesture);
        }, 500);
    }, 2000);
}

// Инициализация третьей головы дракона с эффектом изменения
function initDragonThirdHead() {
    const transparentHead = document.querySelector('.head-dragon-transparent');
    
    // Массив возможных изображений для третьей головы
    const possibleHeads = [
        'images/dragon_head_variant_1.png',
        'images/dragon_head_variant_2.png',
        'images/dragon_head_variant_3.png'
    ];
    
    // Периодически меняем изображение третьей головы
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * possibleHeads.length);
        transparentHead.style.backgroundImage = `url('${possibleHeads[randomIndex]}')`;
    }, 5000); // Меняем каждые 5 секунд
}
