document.addEventListener('DOMContentLoaded', () => {
    const players = [
        { name: 'Erick', fileName: 'erick.jpg', position: 'Goleiro', number: '1' },
        { name: 'Geraldinho', fileName: 'geraldinho.jpg', position: 'Ala Esquerda', number: '7' },
        { name: 'Guilherme', fileName: 'guilherme.jpg', position: 'Fixo', number: '4' },
        { name: 'Gustavo', fileName: 'gustavo.jpg', position: 'Pivô', number: '9' },
        { name: 'Jardel', fileName: 'jardel.jpg', position: 'Ala Direita', number: '10' },
        { name: 'Matheus', fileName: 'matheus.jpg', position: 'Fixo', number: '5' },
        { name: 'Nalderson', fileName: 'nalderson.jpg', position: 'Ala Esquerda', number: '11' },
        { name: 'Pablo', fileName: 'pablo.jpg', position: 'Ala Direita', number: '8' },
        { name: 'Pedrinho', fileName: 'pedrinho.jpg', position: 'Pivô', number: '6' },
        // Adicione mais jogadores aqui
    ];

    const playerGrid = document.querySelector('.player-grid');
    const playerModal = document.getElementById('player-modal');
    const modalPlayerImg = document.getElementById('modal-player-img');
    const modalPlayerName = document.getElementById('modal-player-name');
    const modalPlayerPosition = document.getElementById('modal-player-position');
    const modalPlayerNumber = document.getElementById('modal-player-number');
    const closeButton = document.querySelector('.close-button');

    // Elementos do menu hambúrguer
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Popular a grade de jogadores
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');
        playerCard.innerHTML = `
            <img src="${player.fileName}" alt="Foto de ${player.name}">
            <div class="player-info">
                <h3>${player.name}</h3>
            </div>
        `;
        playerCard.addEventListener('click', () => {
            modalPlayerImg.src = player.fileName;
            modalPlayerName.textContent = player.name;
            modalPlayerPosition.textContent = `Posição: ${player.position}`;
            modalPlayerNumber.textContent = `Número: ${player.number}`;
            playerModal.style.display = 'block';
            // Fechar menu mobile se estiver aberto ao abrir modal
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        playerGrid.appendChild(playerCard);
    });

    // Fechar modal
    closeButton.addEventListener('click', () => {
        playerModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == playerModal) {
            playerModal.style.display = 'none';
        }
    });

    // Lógica do menu hambúrguer
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Para animar o hambúrguer para 'X'
    });

    // Fechar o menu mobile ao clicar em um link
    document.querySelectorAll('.nav-menu ul li a').forEach(link => { // Modificado de 'nav ul li a'
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Rola para a seção
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Fecha o menu mobile após clicar em um link
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Sistema de avaliação por estrelas (permanece o mesmo)
    const stars = document.querySelectorAll('.stars .star');
    const currentRatingSpan = document.getElementById('rating-value');
    const submitRatingBtn = document.getElementById('submit-rating');
    const ratingMessage = document.getElementById('rating-message');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            resetStars();
            const value = parseInt(star.dataset.value);
            highlightStars(value);
        });

        star.addEventListener('mouseout', () => {
            resetStars();
            highlightStars(selectedRating);
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            currentRatingSpan.textContent = selectedRating;
            resetStars();
            highlightStars(selectedRating);
        });
    });

    submitRatingBtn.addEventListener('click', () => {
        if (selectedRating > 0) {
            ratingMessage.textContent = `Obrigado por avaliar com ${selectedRating} estrelas!`;
            ratingMessage.style.color = '#8cff8c'; // Verde para sucesso
            setTimeout(() => {
                ratingMessage.textContent = '';
            }, 3000); // Mensagem some após 3 segundos
        } else {
            ratingMessage.textContent = 'Por favor, selecione uma avaliação!';
            ratingMessage.style.color = '#ff8c8c'; // Vermelho para erro
            setTimeout(() => {
                ratingMessage.textContent = '';
            }, 3000); // Mensagem some após 3 segundos
        }
    });

    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('selected');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('selected');
            star.classList.remove('hovered');
        });
    }
});
