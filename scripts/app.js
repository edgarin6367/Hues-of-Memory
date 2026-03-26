document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const memoryText = document.getElementById('memory-text');

    let currentAudio = null;
    let mineralInterval = null;

    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            const randomMemory = data[Math.floor(Math.random() * data.length)];

            mainContent.classList.remove('special-texture-page', 'watercolor-effect', 'shaking-effect', 'mineral-fire-effect');

            if (randomMemory.class === 'mineral-fire-effect') {
                createMineralParticles();
            } else {
                document.getElementById('mineral-fire-bg').innerHTML = '';
            }

            if (randomMemory.class === 'watercolor-effect') {
                mainContent.style.backgroundColor = '#ffffff';
            } else {
                mainContent.style.backgroundColor = randomMemory.color;
            }
            memoryText.textContent = randomMemory.text;

            if (randomMemory.class) {
                mainContent.classList.add(randomMemory.class);
            }


            if (randomMemory.audio) {
                currentAudio = new Audio();
                currentAudio.src = randomMemory.audio;
                currentAudio.preload = 'auto';
                currentAudio.load();
            }

            setTimeout(() => {
                revealMemory();

                if (currentAudio) {
                    // 1. Intentamos reproducir directamente
                    currentAudio.play().catch(error => {
                        console.warn("Autoplay bloqueado. Esperando interacción del usuario...");

                        // 2. Si falla, creamos una función de desbloqueo único
                        const unlock = () => {
                            currentAudio.play()
                                .then(() => {
                                    console.log("Audio desbloqueado con éxito");
                                    // Limpiamos los eventos una vez que funcione
                                    document.removeEventListener('click', unlock);
                                    document.removeEventListener('touchstart', unlock);
                                    document.removeEventListener('keydown', unlock);
                                })
                                .catch(e => console.error("Error al reproducir tras interacción:", e));
                        };

                        // 3. Escuchamos CUALQUIER interacción en el documento
                        document.addEventListener('click', unlock);
                        document.addEventListener('touchstart', unlock);
                        document.addEventListener('keydown', unlock);
                    });
                }
            }, 3000);
        })
        .catch(error => {
            console.error('Error loading memories:', error);
            revealMemory();
        });

    function revealMemory() {
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.classList.add('visible');
            loadingScreen.style.transition = 'opacity 1s ease-out';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }, 50);
    }

    //   particles of fire

    function createMineralParticles() {
        const container = document.getElementById('mineral-fire-bg');
        if (!container || container.children.length > 0) return;

        for (let i = 0; i < 80; i++) {
            const p = document.createElement('div');
            const isFront = Math.random() > 0.5;
            p.className = isFront ? 'particle particle-front' : 'particle particle-back';

            // Posición inicial aleatoria en todo el ancho
            p.style.left = Math.random() * 100 + '%';

            // Variamos la duración del ascenso para que unas adelanten a otras
            const duration = Math.random() * 5 + 5 + 's';
            p.style.animationDuration = `${duration}, 20s, 10s`; // Ascenso, Danza, Color

            p.style.animationDelay = `${Math.random() * -10}s`;

            container.appendChild(p);
        }

        const minerals = ['copper', 'strontium', 'lead', 'sodium'];
        let currentIndex = 0;
        container.setAttribute('data-mineral', minerals[currentIndex]);

        if (mineralInterval) clearInterval(mineralInterval);
        mineralInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % minerals.length;
            container.setAttribute('data-mineral', minerals[currentIndex]);
        }, 5000);
    }

    // Función para limpiar el efecto de fuego
    function clearMineralEffect() {
        const container = document.getElementById('mineral-fire-bg');
        if (container) container.innerHTML = '';
        if (mineralInterval) clearInterval(mineralInterval);
        container.removeAttribute('data-mineral');
    }
});