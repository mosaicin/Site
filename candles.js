// Скрипт для управления свечками, пентаграммой и оплатой
document.addEventListener('DOMContentLoaded', function() {
    // Создаем элементы интерфейса
    createCandleShop();
    createPentagramContainer();
    createFanButton();
    createShapeSelector();
    createMusicPlayer();
    createPaymentModal();
    
    // Инициализация переменных
    let currentShape = 'pentagram';
    let candles = [];
    let musicPlaying = false;
    let currentSong = '';
    
    // Обработчики событий
    document.getElementById('buy-candle').addEventListener('click', function() {
        showPaymentModal('Свеча', 1);
    });
    
    document.getElementById('buy-music').addEventListener('click', function() {
        showPaymentModal('Музыка', 2);
    });
    
    document.getElementById('payment-confirm').addEventListener('click', function() {
        const itemType = document.getElementById('payment-item-type').textContent;
        const itemPrice = parseInt(document.getElementById('payment-item-price').textContent);
        
        if (itemType === 'Свеча') {
            hidePaymentModal();
            showShapeSelector();
        } else if (itemType === 'Музыка') {
            hidePaymentModal();
            playRandomMusic();
        }
    });
    
    document.getElementById('payment-cancel').addEventListener('click', function() {
        hidePaymentModal();
    });
    
    document.getElementById('fan-button').addEventListener('click', function() {
        extinguishAllCandles();
    });
    
    // Обработчики для выбора формы
    document.querySelectorAll('.shape-option').forEach(option => {
        option.addEventListener('click', function() {
            const shape = this.getAttribute('data-shape');
            selectShape(shape);
        });
    });
    
    // Функции для работы с интерфейсом
    function createCandleShop() {
        const shopContainer = document.createElement('div');
        shopContainer.className = 'candle-shop-container';
        shopContainer.innerHTML = `
            <div class="shop-title">Магазин свечей</div>
            <div class="shop-items">
                <div class="shop-item">
                    <span class="item-name">Свеча</span>
                    <span class="item-price">1 ₽</span>
                    <button class="buy-button" id="buy-candle">Купить</button>
                </div>
                <div class="shop-item">
                    <span class="item-name">Музыка</span>
                    <span class="item-price">2 ₽</span>
                    <button class="buy-button" id="buy-music">Купить</button>
                </div>
            </div>
        `;
        document.body.appendChild(shopContainer);
    }
    
    function createPentagramContainer() {
        const pentagramContainer = document.createElement('div');
        pentagramContainer.className = 'pentagram-container';
        pentagramContainer.id = 'pentagram-container';
        
        const pentagram = document.createElement('div');
        pentagram.className = 'pentagram';
        pentagram.id = 'pentagram';
        
        // Добавляем точки для размещения свечей
        const pointPositions = [
            { top: '10%', left: '50%' },
            { top: '38%', left: '85%' },
            { top: '80%', left: '75%' },
            { top: '80%', left: '25%' },
            { top: '38%', left: '15%' }
        ];
        
        pointPositions.forEach((pos, index) => {
            const point = document.createElement('div');
            point.className = 'pentagram-point';
            point.style.top = pos.top;
            point.style.left = pos.left;
            point.setAttribute('data-point-index', index);
            
            point.addEventListener('click', function() {
                const pointIndex = this.getAttribute('data-point-index');
                placeCandle(pointIndex);
            });
            
            pentagram.appendChild(point);
        });
        
        pentagramContainer.appendChild(pentagram);
        document.body.appendChild(pentagramContainer);
    }
    
    function createFanButton() {
        const fanButton = document.createElement('div');
        fanButton.className = 'fan-button';
        fanButton.id = 'fan-button';
        fanButton.innerHTML = '<div class="fan-icon"></div>';
        document.body.appendChild(fanButton);
    }
    
    function createShapeSelector() {
        const shapeSelector = document.createElement('div');
        shapeSelector.className = 'shape-selector';
        shapeSelector.id = 'shape-selector';
        shapeSelector.innerHTML = `
            <div class="shape-title">Выберите фигуру</div>
            <div class="shape-options">
                <div class="shape-option shape-pentagram selected" data-shape="pentagram"></div>
                <div class="shape-option shape-circle" data-shape="circle"></div>
                <div class="shape-option shape-triangle" data-shape="triangle"></div>
            </div>
        `;
        document.body.appendChild(shapeSelector);
    }
    
    function createMusicPlayer() {
        const musicPlayer = document.createElement('div');
        musicPlayer.className = 'music-player';
        musicPlayer.id = 'music-player';
        musicPlayer.innerHTML = `
            <div class="music-controls">
                <div class="music-button" id="music-pause">❚❚</div>
                <div class="music-button" id="music-stop">■</div>
                <div class="music-title" id="music-title">Нет музыки</div>
            </div>
        `;
        document.body.appendChild(musicPlayer);
        
        document.getElementById('music-pause').addEventListener('click', function() {
            toggleMusic();
        });
        
        document.getElementById('music-stop').addEventListener('click', function() {
            stopMusic();
        });
    }
    
    function createPaymentModal() {
        const paymentModal = document.createElement('div');
        paymentModal.className = 'payment-modal';
        paymentModal.id = 'payment-modal';
        paymentModal.innerHTML = `
            <div class="payment-content">
                <div class="sberbank-logo"></div>
                <div class="payment-header">Оплата</div>
                <div class="payment-details">
                    <div class="payment-row">
                        <span>Товар:</span>
                        <span id="payment-item-type">Свеча</span>
                    </div>
                    <div class="payment-row">
                        <span>Стоимость:</span>
                        <span id="payment-item-price">1</span> ₽
                    </div>
                </div>
                <div class="payment-buttons">
                    <button class="payment-button payment-confirm" id="payment-confirm">Оплатить</button>
                    <button class="payment-button payment-cancel" id="payment-cancel">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(paymentModal);
    }
    
    // Функции для работы со свечками и фигурами
    function showPaymentModal(itemType, price) {
        document.getElementById('payment-item-type').textContent = itemType;
        document.getElementById('payment-item-price').textContent = price;
        document.getElementById('payment-modal').style.display = 'flex';
    }
    
    function hidePaymentModal() {
        document.getElementById('payment-modal').style.display = 'none';
    }
    
    function showShapeSelector() {
        document.getElementById('shape-selector').style.display = 'block';
    }
    
    function hideShapeSelector() {
        document.getElementById('shape-selector').style.display = 'none';
    }
    
    function selectShape(shape) {
        currentShape = shape;
        
        // Обновляем выделение в селекторе
        document.querySelectorAll('.shape-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`.shape-option[data-shape="${shape}"]`).classList.add('selected');
        
        // Показываем соответствующую фигуру
        showPentagram(shape);
    }
    
    function showPentagram(shape) {
        const pentagram = document.getElementById('pentagram');
        hideShapeSelector();
        
        // Устанавливаем соответствующий фон для фигуры
        if (shape === 'pentagram') {
            pentagram.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,5 L61,40 L97,40 L68,62 L79,95 L50,75 L21,95 L32,62 L3,40 L39,40 Z" fill="none" stroke="%23FFD700" stroke-width="2"/></svg>\')';
        } else if (shape === 'circle') {
            pentagram.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%23FFD700" stroke-width="2"/></svg>\')';
        } else if (shape === 'triangle') {
            pentagram.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 L90,80 L10,80 Z" fill="none" stroke="%23FFD700" stroke-width="2"/></svg>\')';
        }
        
        document.getElementById('pentagram-container').style.display = 'block';
    }
    
    function placeCandle(pointIndex) {
        const point = document.querySelector(`.pentagram-point[data-point-index="${pointIndex}"]`);
        const rect = point.getBoundingClientRect();
        
        // Создаем свечу
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.left = `${rect.left}px`;
        candle.style.top = `${rect.top}px`;
        
        // Добавляем пламя
        const flame = document.createElement('div');
        flame.className = 'candle-flame';
        candle.appendChild(flame);
        
        // Добавляем свечу на страницу
        document.body.appendChild(candle);
        
        // Сохраняем свечу в массив
        candles.push(candle);
        
        // Скрываем пентаграмму
        document.getElementById('pentagram-container').style.display = 'none';
        
        // Показываем уведомление
        showNotification('Свеча установлена!');
    }
    
    function extinguishAllCandles() {
        const fanButton = document.getElementById('fan-button');
        fanButton.querySelector('.fan-icon').classList.add('fan-active');
        
        // Удаляем все свечи
        candles.forEach(candle => {
            candle.remove();
        });
        candles = [];
        
        // Показываем уведомление
        showNotification('Все свечи потушены!');
        
        // Убираем анимацию вентилятора через некоторое время
        setTimeout(() => {
            fanButton.querySelector('.fan-icon').classList.remove('fan-active');
        }, 500);
    }
    
    // Функции для работы с музыкой
    function playRandomMusic() {
        const songs = [
            'Египетская молитва',
            'Храмовое песнопение',
            'Мистическая мелодия',
            'Древний ритуал',
            'Песнь фараонов'
        ];
        
        currentSong = songs[Math.floor(Math.random() * songs.length)];
        document.getElementById('music-title').textContent = currentSong;
        document.getElementById('music-player').style.display = 'block';
        musicPlaying = true;
        
        // Показываем уведомление
        showNotification(`Играет: ${currentSong}`);
    }
    
    function toggleMusic() {
        if (musicPlaying) {
            document.getElementById('music-pause').textContent = '▶';
            musicPlaying = false;
            showNotification('Музыка на паузе');
        } else {
            document.getElementById('music-pause').textContent = '❚❚';
            musicPlaying = true;
            showNotification(`Играет: ${currentSong}`);
        }
    }
    
    function stopMusic() {
        document.getElementById('music-player').style.display = 'none';
        document.getElementById('music-pause').textContent = '❚❚';
        musicPlaying = false;
        currentSong = '';
        showNotification('Музыка остановлена');
    }
    
    // Вспомогательные функции
    function showNotification(message) {
        // Удаляем предыдущее уведомление, если оно есть
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 2 секунды
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
});
