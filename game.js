// Интеграция всех игровых элементов и обратной связи
document.addEventListener('DOMContentLoaded', function() {
    // Игровые переменные
    let score = 0;
    let level = 1;
    let targetPositions = [];
    let currentInterval = null;
    let gameStarted = false;
    
    // Инициализация игры
    function initGame() {
        // Создаем игровой интерфейс, если его еще нет
        createGameUI();
        
        // Добавляем обработчик для кнопки начала игры
        const startButton = document.getElementById('start-game');
        if (startButton) {
            startButton.addEventListener('click', startGame);
        }
    }
    
    // Создание игрового интерфейса
    function createGameUI() {
        // Проверяем, существует ли уже счетчик очков
        if (!document.getElementById('score-container')) {
            // Добавляем счетчик очков
            const scoreContainer = document.createElement('div');
            scoreContainer.id = 'score-container';
            scoreContainer.innerHTML = `
                <div class="score-label">Очки:</div>
                <div id="score-value">0</div>
                <div class="level-label">Уровень:</div>
                <div id="level-value">1</div>
            `;
            document.body.appendChild(scoreContainer);
        }
        
        // Проверяем, существуют ли уже инструкции
        if (!document.getElementById('instructions')) {
            // Добавляем инструкции
            const instructions = document.createElement('div');
            instructions.id = 'instructions';
            instructions.innerHTML = `
                <h3>Инструкции:</h3>
                <p>Вращайте круги, чтобы совместить их с целевыми позициями в указанное время!</p>
                <button id="start-game">Начать игру</button>
            `;
            document.body.appendChild(instructions);
        }
    }
    
    // Запуск игры
    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
        
        // Скрываем инструкции
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
        
        // Сбрасываем счет и уровень
        score = 0;
        level = 1;
        updateScoreDisplay();
        
        // Запускаем первый раунд
        startNewRound();
        
        // Показываем сообщение о начале игры
        showGameMessage('Игра началась! Вращайте круги!', 2000);
    }
    
    // Запуск нового раунда
    function startNewRound() {
        // Генерируем новые целевые позиции
        generateTargetPositions();
        
        // Показываем целевые маркеры
        showTargetMarkers();
        
        // Устанавливаем таймер для раунда
        const timeLimit = Math.max(3000, 10000 - (level * 500)); // Уменьшаем время с каждым уровнем, но не меньше 3 секунд
        
        // Показываем таймер
        showTimer(timeLimit);
        
        // Запускаем проверку позиций
        currentInterval = setInterval(() => {
            checkPositions();
        }, 100);
        
        // Устанавливаем таймаут для завершения раунда
        setTimeout(() => {
            endRound(false); // Раунд завершен по таймауту
        }, timeLimit);
    }
    
    // Генерация целевых позиций
    function generateTargetPositions() {
        const circles = document.querySelectorAll('.circle');
        targetPositions = [];
        
        circles.forEach((circle, index) => {
            // Генерируем случайный угол от 0 до 359 градусов
            const targetAngle = Math.floor(Math.random() * 360);
            targetPositions.push(targetAngle);
            
            // Создаем или обновляем маркер, если его еще нет
            let targetMarker = document.getElementById(`target-${index}`);
            if (!targetMarker) {
                targetMarker = document.createElement('div');
                targetMarker.className = 'target-marker';
                targetMarker.id = `target-${index}`;
                circle.parentNode.appendChild(targetMarker);
            }
            
            // Устанавливаем позицию маркера
            const radius = 85; // Радиус большого круга минус радиус маркера
            const angle = targetAngle * (Math.PI / 180);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            targetMarker.style.left = `calc(50% + ${x}px - 20px)`;
            targetMarker.style.top = `calc(50% + ${y}px - 20px)`;
        });
    }
    
    // Показ целевых маркеров
    function showTargetMarkers() {
        const targetMarkers = document.querySelectorAll('.target-marker');
        targetMarkers.forEach(marker => {
            marker.style.display = 'block';
            marker.classList.remove('aligned');
        });
    }
    
    // Показ таймера
    function showTimer(timeLimit) {
        // Создаем или обновляем таймер
        let timer = document.getElementById('timer');
        if (!timer) {
            timer = document.createElement('div');
            timer.id = 'timer';
            document.body.appendChild(timer);
        }
        
        // Устанавливаем начальное значение
        timer.style.width = '100%';
        
        // Устанавливаем начальное время
        const startTime = Date.now();
        const endTime = startTime + timeLimit;
        
        // Обновляем таймер каждые 50 мс
        const timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = Math.max(0, endTime - currentTime);
            const percent = (remainingTime / timeLimit) * 100;
            
            timer.style.width = `${percent}%`;
            
            // Меняем цвет таймера в зависимости от оставшегося времени
            if (percent < 20) {
                timer.style.backgroundColor = '#FF0000';
            } else if (percent < 50) {
                timer.style.backgroundColor = '#FFA500';
            } else {
                timer.style.backgroundColor = '#FF4500';
            }
            
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
            }
        }, 50);
    }
    
    // Проверка позиций кругов
    function checkPositions() {
        const circles = document.querySelectorAll('.circle');
        let allAligned = true;
        
        circles.forEach((circle, index) => {
            // Получаем текущий угол круга
            const currentRotation = getCurrentRotation(circle);
            
            // Проверяем, совпадает ли он с целевым углом (с погрешностью)
            const targetAngle = targetPositions[index];
            const tolerance = 15; // Допустимая погрешность в градусах
            
            // Проверяем совпадение с учетом погрешности и цикличности углов
            const diff = Math.abs(((currentRotation - targetAngle) + 180) % 360 - 180);
            const isAligned = diff <= tolerance;
            
            // Обновляем визуальное состояние маркера
            const targetMarker = document.getElementById(`target-${index}`);
            if (targetMarker) {
                if (isAligned) {
                    targetMarker.classList.add('aligned');
                } else {
                    targetMarker.classList.remove('aligned');
                    allAligned = false;
                }
            }
        });
        
        // Если все круги совмещены с целями
        if (allAligned) {
            // Завершаем раунд успешно
            endRound(true);
        }
    }
    
    // Завершение раунда
    function endRound(success) {
        // Очищаем интервал проверки
        clearInterval(currentInterval);
        
        if (success) {
            // Начисляем очки
            const pointsEarned = 100 * level;
            addScore(pointsEarned);
            
            // Показываем сообщение об успехе
            showGameMessage(`Отлично! +${pointsEarned} очков!`, 1500);
            
            // Добавляем блок тетриса
            if (typeof window.addTetrisBlockOnScore === 'function') {
                window.addTetrisBlockOnScore();
            }
            
            // Проверяем, нужно ли повысить уровень
            if (score >= level * 1000) {
                levelUp();
            }
        } else {
            // Показываем сообщение о неудаче
            showGameMessage('Время вышло! Попробуйте снова.', 1500);
        }
        
        // Скрываем целевые маркеры
        const targetMarkers = document.querySelectorAll('.target-marker');
        targetMarkers.forEach(marker => {
            marker.style.display = 'none';
            marker.classList.remove('aligned');
        });
        
        // Небольшая пауза перед следующим раундом
        setTimeout(() => {
            startNewRound();
        }, 2000);
    }
    
    // Добавление очков
    function addScore(points) {
        score += points;
        updateScoreDisplay();
        
        // Анимация начисления очков
        const scoreAnimation = document.createElement('div');
        scoreAnimation.className = 'score-animation';
        scoreAnimation.textContent = `+${points}`;
        
        const scoreContainer = document.getElementById('score-container');
        if (scoreContainer) {
            scoreContainer.appendChild(scoreAnimation);
            
            // Удаляем анимацию через 1 секунду
            setTimeout(() => {
                scoreAnimation.remove();
            }, 1000);
        }
    }
    
    // Обновление отображения счета
    function updateScoreDisplay() {
        const scoreValue = document.getElementById('score-value');
        const levelValue = document.getElementById('level-value');
        
        if (scoreValue) {
            scoreValue.textContent = score;
        }
        
        if (levelValue) {
            levelValue.textContent = level;
        }
    }
    
    // Повышение уровня
    function levelUp() {
        level++;
        updateScoreDisplay();
        
        // Анимация повышения уровня
        const levelAnimation = document.createElement('div');
        levelAnimation.className = 'level-animation';
        levelAnimation.textContent = `Уровень ${level}!`;
        document.body.appendChild(levelAnimation);
        
        // Удаляем анимацию через 2 секунды
        setTimeout(() => {
            levelAnimation.remove();
        }, 2000);
        
        // Показываем сообщение о повышении уровня
        showGameMessage(`Поздравляем! Вы достигли уровня ${level}!`, 2000);
    }
    
    // Показ игрового сообщения
    function showGameMessage(message, duration) {
        // Создаем элемент сообщения
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        // Удаляем сообщение через указанное время
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, duration);
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
    
    // Инициализируем игру при загрузке страницы
    initGame();
});
