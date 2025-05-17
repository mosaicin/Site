// Улучшенный скрипт для тетриса, строящего пирамиду
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных для тетриса
    let tetrisBlocks = 0;
    const maxTetrisBlocks = 50; // Количество блоков для полной пирамиды
    let tetrisInterval = null;
    let score = 0;
    
    // Инициализация тетриса
    function initTetris() {
        // Получаем контейнер для тетриса
        const tetrisContainer = document.getElementById('tetris-container');
        if (!tetrisContainer) return;
        
        // Очищаем контейнер
        const existingBlocks = tetrisContainer.querySelectorAll('.tetris-block');
        existingBlocks.forEach(block => block.remove());
        
        // Создаем сетку для тетриса, если её ещё нет
        let tetrisGrid = tetrisContainer.querySelector('.tetris-grid');
        if (!tetrisGrid) {
            tetrisGrid = document.createElement('div');
            tetrisGrid.className = 'tetris-grid';
            tetrisContainer.appendChild(tetrisGrid);
        }
        
        // Очищаем сетку
        tetrisGrid.innerHTML = '';
        
        // Создаем ячейки сетки
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-grid-cell';
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);
                tetrisGrid.appendChild(cell);
            }
        }
        
        // Создаем контур пирамиды, если его ещё нет
        let pyramidOutline = tetrisContainer.querySelector('.pyramid-outline');
        if (!pyramidOutline) {
            pyramidOutline = document.createElement('div');
            pyramidOutline.className = 'pyramid-outline';
            tetrisContainer.appendChild(pyramidOutline);
        }
        
        // Добавляем статус тетриса
        let tetrisStatus = tetrisContainer.querySelector('.tetris-status');
        if (!tetrisStatus) {
            tetrisStatus = document.createElement('div');
            tetrisStatus.className = 'tetris-status';
            tetrisContainer.appendChild(tetrisStatus);
        }
        tetrisStatus.textContent = 'Набирайте очки, чтобы строить пирамиду!';
        
        // Сбрасываем счетчик блоков
        tetrisBlocks = 0;
        
        // Запускаем автоматическое добавление блоков для демонстрации
        startDemoTetris();
    }
    
    // Запуск демонстрационного режима тетриса
    function startDemoTetris() {
        // Останавливаем предыдущий интервал, если он был
        if (tetrisInterval) {
            clearInterval(tetrisInterval);
        }
        
        // Запускаем новый интервал для добавления блоков
        tetrisInterval = setInterval(() => {
            // Добавляем блок, если пирамида ещё не построена
            if (tetrisBlocks < maxTetrisBlocks) {
                addTetrisBlock();
                
                // Обновляем статус
                updateTetrisStatus();
            } else {
                // Останавливаем интервал, если пирамида построена
                clearInterval(tetrisInterval);
                
                // Празднуем завершение пирамиды
                celebratePyramidCompletion();
            }
        }, 2000); // Добавляем блок каждые 2 секунды
    }
    
    // Добавление блока тетриса
    function addTetrisBlock() {
        if (tetrisBlocks >= maxTetrisBlocks) {
            return; // Пирамида уже построена
        }
        
        tetrisBlocks++;
        
        // Получаем контейнер для тетриса
        const tetrisContainer = document.getElementById('tetris-container');
        if (!tetrisContainer) return;
        
        // Создаем новый блок
        const block = document.createElement('div');
        block.className = 'tetris-block';
        block.setAttribute('data-index', tetrisBlocks);
        
        // Определяем позицию блока в пирамиде
        const position = calculateBlockPosition(tetrisBlocks);
        block.style.left = `${position.x}px`;
        block.style.top = `${position.y}px`;
        
        // Добавляем случайный египетский символ на блок
        const symbols = ['☥', '𓂀', '𓃀', '𓆣', '𓇯', '𓊖', '𓅓', '𓆓', '𓏏', '𓊽'];
        block.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Добавляем блок в контейнер
        tetrisContainer.appendChild(block);
        
        // Анимируем падение блока
        animateBlockFall(block, position);
        
        // Проверяем, завершено ли строительство пирамиды
        if (tetrisBlocks >= maxTetrisBlocks) {
            celebratePyramidCompletion();
        }
        
        // Обновляем счет
        updateScore(10);
    }
    
    // Расчет позиции блока в пирамиде
    function calculateBlockPosition(blockNumber) {
        // Определяем размеры пирамиды
        const baseWidth = 10; // Количество блоков в основании пирамиды
        const blockSize = 28; // Размер блока в пикселях
        const spacing = 2; // Расстояние между блоками
        
        // Вычисляем, в каком ряду находится блок
        let row = 0;
        let blocksInPreviousRows = 0;
        
        while (blocksInPreviousRows + (baseWidth - row) < blockNumber) {
            blocksInPreviousRows += (baseWidth - row);
            row++;
        }
        
        // Вычисляем позицию блока в текущем ряду
        const positionInRow = blockNumber - blocksInPreviousRows;
        
        // Вычисляем координаты
        const x = (positionInRow - 1) * (blockSize + spacing) + (row * (blockSize + spacing) / 2);
        const y = row * (blockSize + spacing);
        
        return { x, y };
    }
    
    // Анимация падения блока
    function animateBlockFall(block, finalPosition) {
        // Начальная позиция (над пирамидой)
        block.style.top = '-30px';
        
        // Анимируем падение
        setTimeout(() => {
            block.style.transition = 'top 0.5s ease-in';
            block.style.top = `${finalPosition.y}px`;
            
            // Добавляем звуковой эффект падения
            playBlockSound();
        }, 50);
    }
    
    // Воспроизведение звука падения блока
    function playBlockSound() {
        // Создаем аудио-элемент
        const audio = new Audio();
        
        // Устанавливаем случайный звук из нескольких вариантов
        const sounds = [
            'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABMYXZmNTguMTMuMTAw',
            'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABMYXZmNTguMTMuMTAw'
        ];
        audio.src = sounds[Math.floor(Math.random() * sounds.length)];
        
        // Устанавливаем громкость
        audio.volume = 0.2;
        
        // Воспроизводим звук
        audio.play().catch(e => {
            // Игнорируем ошибки воспроизведения (некоторые браузеры блокируют автоматическое воспроизведение)
            console.log('Звук блокирован браузером:', e);
        });
    }
    
    // Празднование завершения пирамиды
    function celebratePyramidCompletion() {
        // Создаем эффект празднования
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.textContent = 'Пирамида построена!';
        document.body.appendChild(celebration);
        
        // Добавляем фейерверк
        createFireworks();
        
        // Обновляем статус тетриса
        updateTetrisStatus('Пирамида построена! Поздравляем!');
        
        // Удаляем празднование через 5 секунд
        setTimeout(() => {
            celebration.remove();
        }, 5000);
    }
    
    // Создание эффекта фейерверка
    function createFireworks() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                // Случайная позиция
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight / 2;
                
                firework.style.left = `${x}px`;
                firework.style.top = `${y}px`;
                
                // Случайный цвет
                const colors = ['#FF4500', '#FFD700', '#00BFFF', '#32CD32', '#FF69B4'];
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                document.body.appendChild(firework);
                
                // Удаляем фейерверк через случайное время
                setTimeout(() => {
                    firework.remove();
                }, 1000 + Math.random() * 3000);
            }, i * 200); // Запускаем фейерверки с интервалом
        }
    }
    
    // Обновление статуса тетриса
    function updateTetrisStatus(customText) {
        const tetrisContainer = document.getElementById('tetris-container');
        if (!tetrisContainer) return;
        
        const tetrisStatus = tetrisContainer.querySelector('.tetris-status');
        if (!tetrisStatus) return;
        
        if (customText) {
            tetrisStatus.textContent = customText;
        } else {
            const progress = Math.floor((tetrisBlocks / maxTetrisBlocks) * 100);
            tetrisStatus.textContent = `Построено: ${progress}% (${tetrisBlocks}/${maxTetrisBlocks} блоков)`;
        }
    }
    
    // Обновление счета
    function updateScore(points) {
        score += points;
        
        // Обновляем отображение счета
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
            scoreValue.textContent = score;
        }
        
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
    
    // Добавляем функцию для добавления блока тетриса при наборе очков
    window.addTetrisBlockOnScore = function() {
        addTetrisBlock();
    };
    
    // Инициализируем тетрис при загрузке страницы
    initTetris();
});
