document.addEventListener('DOMContentLoaded', () => {
    // GOOGLE APPS SCRIPT 
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_tOBpM5AaQzdO0ivJJlMdfHrXV5JhzrBr0iI9nmaWM5oKdJD7b72pYNBzi6JOi8to/exec';

    // --- Dados e elementos do site (permanecem os mesmos) ---
    const players = [
        { name: 'Eduardo', fileName: 'Eduardo.jpeg', position: 'Goleiro', number: '2' },
        { name: 'Pedro Germano', fileName: 'Pedro Germano.jpeg', position: 'Ala Esquerda', number: '7' },
        { name: 'Geraldinho', fileName: 'Geraldinho.jpeg', position: 'Ala Esquerda', number: '7' },
        { name: 'Guilherme', fileName: 'Guilherme.jpeg', position: 'Ala Direito', number: '4' },
        { name: 'Gustavo', fileName: 'Gustavo.jpeg', position: 'Ala Direito', number: '20' },
        { name: 'Jardel', fileName: 'Jardel.jpeg', position: 'Ala Direita', number: '10' },
        { name: 'Matheus', fileName: 'Matheus.jpeg', position: 'Fixo', number: '5' },
        { name: 'Laércio Júnior', fileName: 'Laercio jr.jpeg', position: 'Fixo/Ala', number: '17' },
        { name: 'Nalderson', fileName: 'Nalderson.jpeg', position: 'Ala Direito', number: '8' },
        { name: 'Pedrinho', fileName: 'Pedrinho.jpeg', position: 'Ala Direito', number: '9' },
        { name: 'Davi', fileName: 'Davi.jpeg', position: 'Ala Direito', number: '19' },
        { name: 'Rivaldo', fileName: 'Rivaldo.jpeg', position: 'Pivô', number: '6' },
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
        hamburger.classList.toggle('active');
    });

    // Fechar o menu mobile ao clicar em um link
    document.querySelectorAll('.nav-menu ul li a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Sistema de avaliação por estrelas
    const stars = document.querySelectorAll('.stars .star');
    const currentRatingSpan = document.getElementById('rating-value');
    const submitRatingBtn = document.getElementById('submit-rating');
    const ratingMessage = document.getElementById('rating-message');
    let selectedRating = 0;

    // Carregar avaliação do localStorage (para persistência local no navegador do usuário)
    function loadRating() {
        const storedRating = localStorage.getItem('ajaxFutsalRating');
        if (storedRating) {
            selectedRating = parseInt(storedRating);
            currentRatingSpan.textContent = selectedRating;
            highlightStars(selectedRating);
            ratingMessage.textContent = `Sua última avaliação: ${selectedRating} estrelas.`;
            ratingMessage.style.color = '#fff';
        }
    }

    loadRating();

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

    // --- SEÇÃO MODIFICADA PARA ENVIAR AVALIAÇÃO AO GOOGLE APPS SCRIPT ---
    submitRatingBtn.addEventListener('click', () => {
        if (selectedRating > 0) {
            ratingMessage.textContent = `Enviando avaliação...`;
            ratingMessage.style.color = '#fff';

            // Salva a avaliação no localStorage do usuário (opcional, para feedback local)
            localStorage.setItem('ajaxFutsalRating', selectedRating);

            // Prepara os dados para enviar ao Apps Script
            const dataToSend = new URLSearchParams();
            dataToSend.append('rating', selectedRating);
            // O Apps Script que te passei já tenta pegar o IP, mas se quiser passar do lado do cliente:
            // dataToSend.append('ip_address', 'IP_AQUI_SE_TIVER'); // Pode tentar pegar de um serviço externo ou deixar em branco para o Apps Script lidar

            fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para contornar problemas de CORS com Apps Script
                body: dataToSend,
            })
            .then(response => {
                // Como usamos 'no-cors', a resposta sempre será 'opaque'.
                // Não podemos ler o corpo da resposta aqui, mas sabemos que a requisição foi enviada.
                console.log('Requisição de avaliação enviada. Verifique sua Planilha Google.');
                ratingMessage.textContent = `Obrigado por avaliar com ${selectedRating} estrelas!`;
                ratingMessage.style.color = '#8cff8c';
            })
            .catch(error => {
                console.error('Erro ao enviar avaliação:', error);
                ratingMessage.textContent = `Erro ao enviar avaliação. Tente novamente.`;
                ratingMessage.style.color = '#ff8c8c';
            })
            .finally(() => {
                setTimeout(() => {
                    // Após 3 segundos, volta para a mensagem de última avaliação localmente armazenada
                    const lastStoredRating = localStorage.getItem('ajaxFutsalRating');
                    if (lastStoredRating) {
                        ratingMessage.textContent = `Sua última avaliação: ${lastStoredRating} estrelas.`;
                        ratingMessage.style.color = '#fff';
                    } else {
                        ratingMessage.textContent = ''; // Se não houver, limpa
                    }
                }, 3000);
            });

        } else {
            ratingMessage.textContent = 'Por favor, selecione uma avaliação!';
            ratingMessage.style.color = '#ff8c8c';
            setTimeout(() => {
                const lastStoredRating = localStorage.getItem('ajaxFutsalRating');
                if (lastStoredRating) {
                    ratingMessage.textContent = `Sua última avaliação: ${lastStoredRating} estrelas.`;
                    ratingMessage.style.color = '#fff';
                } else {
                    ratingMessage.textContent = '';
                }
            }, 3000);
        }
    });
    // --- FIM DA SEÇÃO MODIFICADA ---

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
