document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const memoryText = document.getElementById('memory-text');

    let currentAudio = null;
    let mineralEmissionInterval = null;
    let colorCycleInterval = null;

    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            const randomMemory = data[Math.floor(Math.random() * data.length)];

            mainContent.classList.remove('special-texture-page', 'watercolor-effect', 'shaking-effect', 'mineral-fire-effect');
            clearMineralEffect();

            if (randomMemory.class === 'mineral-fire-effect') {
                createMineralParticles();
            }

            if (randomMemory.class === 'watercolor-effect') {
                mainContent.style.backgroundColor = '#ffffff';
            } else {
                mainContent.style.backgroundColor = randomMemory.color || '#000';
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
                    const playAudio = () => {
                        currentAudio.play()
                            .then(() => {
                                document.removeEventListener('click', playAudio);
                                document.removeEventListener('touchstart', playAudio);
                                document.removeEventListener('keydown', playAudio);
                            })
                            .catch(e => console.warn("Esperando interacción..."));
                    };

                    currentAudio.play().catch(() => {
                        document.addEventListener('click', playAudio);
                        document.addEventListener('touchstart', playAudio);
                        document.addEventListener('keydown', playAudio);
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

    function createMineralParticles() {
        const container = document.getElementById('mineral-fire-bg');
        if (!container) return;

        const minerals = ['copper', 'strontium', 'lead', 'sodium'];
        let currentMineralIndex = 0;

        colorCycleInterval = setInterval(() => {
            currentMineralIndex = (currentMineralIndex + 1) % minerals.length;
        }, 7000);

        mineralEmissionInterval = setInterval(() => {
            const p = document.createElement('div');
            const isFront = Math.random() > 0.5;
            const mineralClass = `mineral-${minerals[currentMineralIndex]}`;

            p.className = `particle ${isFront ? 'particle-front' : 'particle-back'} ${mineralClass}`;
            p.style.left = Math.random() * 100 + '%';

            const duration = Math.random() * 5 + 2;
            p.style.animationDuration = `${duration}s, ${Math.random() * 2 + 2}s`;

            container.appendChild(p);

            setTimeout(() => {
                p.remove();
            }, duration * 1000);

        }, 70);
    }

    function clearMineralEffect() {
        const container = document.getElementById('mineral-fire-bg');
        if (container) container.innerHTML = '';
        if (mineralEmissionInterval) clearInterval(mineralEmissionInterval);
        if (colorCycleInterval) clearInterval(colorCycleInterval);
    }
});