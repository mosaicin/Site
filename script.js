document.addEventListener('DOMContentLoaded', function() {
    // Создаем маленькие круги по периметру для каждого большого круга
    const circles = document.querySelectorAll('.circle');
    const circleWrappers = document.querySelectorAll('.circle-wrapper');
    const resetBtn = document.getElementById('reset-btn');
    
    // Конфигурация для кругов
    const config = {
        smallCirclesCount: 12, // Количество маленьких кругов на каждом большом круге
        rotationSpeeds: [0, 0, 0], // Текущие скорости вращения для каждого круга
        rotationDirections: [1, 1, 1], // Направления вращения (1: по часовой, -1: против часовой)
        rotationAngles: [0, 0, 0], // Текущие углы поворота
        maxSpeed: 10, // Максимальная скорость вращения
        friction: 0.98, // Коэффициент трения (замедление)
        colorRanges: {
            cold: { r: 41, g: 128, b: 185 }, // Холодный цвет (#2980b9)
            hot: { r: 231, g: 76, b: 60 }    // Горячий цвет (#e74c3c)
        }
    };
    
    // Создаем маленькие круги для каждого большого круга
    circles.forEach((circle, circleIndex) => {
        for (let i = 0; i < config.smallCirclesCount; i++) {
            const angle = (i / config.smallCirclesCount) * 2 * Math.PI;
            const smallCircle = document.createElement('div');
            smallCircle.className = 'small-circle';
            
            // Позиционируем маленькие круги по окружности
            const radius = circle.offsetWidth / 2 - 15; // Радиус размещения маленьких кругов
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            smallCircle.style.transform = `translate(${x}px, ${y}px)`;
            circle.appendChild(smallCircle);
        }
    });
    
    // Обработка событий мыши и касаний для вращения
    circleWrappers.forEach((wrapper, index) => {
        let isDragging = false;
        let startX, startY;
        let lastX, lastY;
        let lastTime = 0;
        
        // Функции для обработки событий мыши
        function handleStart(e) {
            isDragging = true;
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            startX = lastX = clientX;
            startY = lastY = clientY;
            lastTime = Date.now();
            wrapper.style.cursor = 'grabbing';
            e.preventDefault();
        }
        
        function handleMove(e) {
            if (!isDragging) return;
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Вычисляем углы для текущей и предыдущей позиции относительно центра
            const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
            const lastAngle = Math.atan2(lastY - centerY, lastX - centerX);
            let deltaAngle = currentAngle - lastAngle;
            
            // Корректируем скачки при переходе через ±π
            if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
            
            // Обновляем скорость вращения
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > 0) {
                // Вычисляем скорость на основе изменения угла и времени
                const speed = deltaAngle / (deltaTime / 1000);
                config.rotationSpeeds[index] = speed;
                config.rotationDirections[index] = Math.sign(speed) || 1;
                
                // Обновляем цвет в зависимости от скорости
                updateCircleColor(index, Math.abs(speed));
            }
            
            // Обновляем угол поворота
            config.rotationAngles[index] += deltaAngle;
            wrapper.querySelector('.circle').style.transform = `rotate(${config.rotationAngles[index]}rad)`;
            
            lastX = clientX;
            lastY = clientY;
            lastTime = currentTime;
            e.preventDefault();
        }
        
        function handleEnd() {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        }
        
        // Добавляем обработчики событий для мыши
        wrapper.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        
        // Добавляем обработчики событий для сенсорных устройств
        wrapper.addEventListener('touchstart', handleStart);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);
    });
    
    // Функция для обновления цвета круга в зависимости от скорости
    function updateCircleColor(index, speed) {
        const circle = circles[index];
        const normalizedSpeed = Math.min(Math.abs(speed) / config.maxSpeed, 1);
        
        // Интерполяция между холодным и горячим цветом
        const r = Math.round(config.colorRanges.cold.r + normalizedSpeed * (config.colorRanges.hot.r - config.colorRanges.cold.r));
        const g = Math.round(config.colorRanges.cold.g + normalizedSpeed * (config.colorRanges.hot.g - config.colorRanges.cold.g));
        const b = Math.round(config.colorRanges.cold.b + normalizedSpeed * (config.colorRanges.hot.b - config.colorRanges.cold.b));
        
        circle.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    
    // Анимация вращения с инерцией
    function animate() {
        circles.forEach((circle, index) => {
            if (!circleWrappers[index].querySelector(':active')) {
                // Применяем инерцию только если не перетаскиваем
                config.rotationSpeeds[index] *= config.friction;
                
                // Останавливаем вращение, если скорость очень мала
                if (Math.abs(config.rotationSpeeds[index]) < 0.01) {
                    config.rotationSpeeds[index] = 0;
                }
                
                // Обновляем угол поворота
                config.rotationAngles[index] += config.rotationSpeeds[index] * 0.016; // примерно 60 FPS
                circle.style.transform = `rotate(${config.rotationAngles[index]}rad)`;
                
                // Обновляем цвет
                updateCircleColor(index, Math.abs(config.rotationSpeeds[index]));
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    // Сброс вращения
    resetBtn.addEventListener('click', function() {
        config.rotationSpeeds = [0, 0, 0];
        circles.forEach((circle, index) => {
            config.rotationAngles[index] = 0;
            circle.style.transform = 'rotate(0rad)';
            updateCircleColor(index, 0);
        });
    });
    
    // Запускаем анимацию
    animate();
});
