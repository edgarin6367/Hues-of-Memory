document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const memoryText = document.getElementById('memory-text');

    let currentAudio = null;

    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            const randomMemory = data[Math.floor(Math.random() * data.length)];

            mainContent.classList.remove('special-texture-page', 'watercolor-effect');

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
                    const playPromise = currentAudio.play();

                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn("Autoplay bloqueado.");
                            const playOnInteraction = () => {
                                currentAudio.play();
                                document.removeEventListener('click', playOnInteraction);
                                document.removeEventListener('touchstart', playOnInteraction);
                            };
                            document.addEventListener('click', playOnInteraction);
                            document.addEventListener('touchstart', playOnInteraction);
                        });
                    }
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
});