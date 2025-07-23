let photos = [];
let shownSlides = new Set();
let currentIndex = 0;
let mode = 'manual';
let theme = "A";
let timer = null;

document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const sampleBtn = document.getElementById('sampleBtn');

    ['dragenter', 'dragover', 'dragleave'].forEach(evt => {
        dropArea.addEventListener(evt, e => e.preventDefault());
    });

    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', e => {
        handleFiles(e.target.files);
    });

    sampleBtn.addEventListener('click', () => {
        loadSamplePhotos();
    });

    document.getElementById('modeSelect').addEventListener('change', e => {
        setMode(e.target.value);
    });

    setMode(document.getElementById('modeSelect').value ?? "manual");

    document.getElementById('themeSelect').addEventListener('change', e => {
        setTheme(e.target.value);
    });

    setTheme(document.getElementById("themeSelect").value ?? "A");

    document.addEventListener('keydown', e => {
        if (mode === 'manual') {
            if (e.key === 'ArrowRight') { nextSlide(); }
            else if (e.key === 'ArrowLeft') { prevSlide(); }
        }
        if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
            e.preventDefault();
            openCommandBar();
        }
        if (e.key === 'Escape') {
            closeCommandBar();
        }
    });

    setupCommandBar();
});


function formatCaption(filename) {
    var name = filename.substring(0, filename.lastIndexOf("."));
    if (name.startsWith('images/')) name = name.substring(7);
    const words = name.replaceAll('_', ' ').replaceAll('-', ' ').split(' ');

    return words.map((w, index) => {
        const word = document.createElement("span");
        word.className = "word";
        word.style.setProperty("--word-index", index);
        word.textContent = w.charAt(0).toUpperCase() + w.slice(1) + " "
        return word;
    });
}

function handleFiles(fileList) {
    const newPhotos = [];

    [...fileList].forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e => {
            newPhotos.push({
                src: e.target.result,
                caption: formatCaption(file.name),
                angle: (Math.random() * 10 - 5).toFixed(2)
            });

            if (newPhotos.length === fileList.length) {
                photos.push(...newPhotos);
                updatePhotoListUI();
                renderSlidesOnce();
            }
        };
        reader.readAsDataURL(file);
    });
}

function loadSamplePhotos() {
    const sampleUrls = [
        'images/basilique-notre-dame-de-fourviere-lyon.jpg',
        'images/beautiful-view-in-lyon.jpg',
        'images/place-bellecour-lyon.jpg',
        'images/tour-metalique-lyon.jpg'
    ];

    sampleUrls.forEach(url => {
        const caption = formatCaption(url);
        photos.push({
            src: url,
            caption,
            angle: (Math.random() * 10 - 5).toFixed(2)
        });
    });

    updatePhotoListUI();
    renderSlidesOnce();
}


function showSlide(index) {
    if (photos.length === 0) return;

    const slideshow = document.getElementById('slideshow');
    const allSlides = slideshow.querySelectorAll('.slide');
    const previousIndex = currentIndex;

    currentIndex = (index + photos.length) % photos.length;

    allSlides.forEach((slide, i) => {
        slide.classList.remove('active', 'last-one');

        if (i === previousIndex && i === currentIndex) {
            slide.classList.add('active');
        } else {
            if (i === previousIndex) slide.classList.add('last-one');
            if (i === currentIndex) slide.classList.add('active');
        }

        if (theme === "D") {
            const src = photos[i]?.src;

            if (i === currentIndex && src) {
                if (!shownSlides.has(src)) {
                    shownSlides.add(src);
                } else if (shownSlides.size === photos.length) {
                    shownSlides.delete(src);
                    shownSlides.add(src);

                    const newAngle = (Math.random() * 10 - 5).toFixed(2);
                    photos[i].angle = newAngle;
                    slide.style.setProperty('--rotate-angle', `${newAngle}deg`);
                }
            }

            if (shownSlides.has(src)) {
                const index = [...shownSlides].indexOf(src);
                slide.classList.add("shown");
                slide.style.setProperty('--show-index', index);
                slide.style.setProperty('--rotate-angle', `${photos[i].angle}deg`);
            }
        }

    });
}

function renderSlidesOnce() {
    const slideshow = document.getElementById('slideshow');
    slideshow.innerHTML = '';

    photos.forEach((photo, i) => {
        const fig = document.createElement('div');
        fig.className = `slide`;

        if (theme === "D") {
            const angle = photos[i].angle ?? "0";
            fig.style.setProperty('--rotate-angle', `${angle}deg`);
        }

        const img = document.createElement('img');
        img.src = photo.src;

        if (theme === "E") {
            const leftWrapper = document.createElement('div');
            leftWrapper.className = "left"
            leftWrapper.appendChild(img);

            fig.appendChild(leftWrapper);

            const second_img = document.createElement('img');
            second_img.src = photo.src;
            
            const rightWrapper = document.createElement('div');
            rightWrapper.className = "right"
            rightWrapper.appendChild(second_img);

            fig.appendChild(rightWrapper);
        } else {
            fig.appendChild(img);
        }

        const cap = document.createElement('div');
        cap.className = "caption"
        cap.replaceChildren(...photo.caption);
        fig.appendChild(cap);

        slideshow.appendChild(fig);
    });

    shownSlides.clear();

    showSlide(currentIndex);
}


function nextSlide() {
    showSlide(currentIndex + 1);
}
function prevSlide() {
    showSlide(currentIndex - 1);
}

function setMode(newMode) {
    mode = newMode;
    clearInterval(timer);
    if (mode === 'auto') {
        timer = setInterval(nextSlide, 5000);
    } else if (mode === 'random') {
        timer = setInterval(() => showSlide(Math.floor(Math.random() * photos.length)), 5000);
    }
}

function setTheme(newTheme) {
    const slideshow = document.getElementById('slideshow');

    slideshow.classList.forEach(cls => {
        if (cls.startsWith('theme-')) {
            slideshow.classList.remove(cls);
        }
    });

    shownSlides.clear();

    theme = newTheme;
    slideshow.classList.add(`theme-${theme}`);

    document.getElementById('themeSelect').value = theme;

    showSlide(currentIndex);

    renderSlidesOnce();
}


function openCommandBar() {
    document.getElementById('commandBar').classList.remove('hidden');
    document.getElementById('commandInput').focus();
    document.body.classList.add('dimmed');
}
function closeCommandBar() {
    document.getElementById('commandBar').classList.add('hidden');
    document.body.classList.remove('dimmed');
}
function setupCommandBar() {
    const input = document.getElementById('commandInput');
    const options = document.querySelectorAll('#commandOptions li');
    let selected = 0;
    options[selected].classList.add('highlight');

    document.addEventListener('keydown', e => {
        if (document.getElementById('commandBar').classList.contains('hidden')) return;
        if (e.key === 'ArrowDown') {
            options[selected].classList.remove('highlight');
            selected = (selected + 1) % options.length;
            options[selected].classList.add('highlight');
        } else if (e.key === 'ArrowUp') {
            options[selected].classList.remove('highlight');
            selected = (selected - 1 + options.length) % options.length;
            options[selected].classList.add('highlight');
        } else if (e.key === 'Enter') {
            const cmd = options[selected].dataset.command;
            handleCommand(cmd);
            closeCommandBar();
        }
    });
}
function handleCommand(cmd) {
    if (cmd.startsWith('mode-')) {
        setMode(cmd.split('-')[1]);
    } else if (cmd.startsWith('theme-')) {
        setTheme(cmd.split('-')[1]);
    }
}

function updatePhotoListUI() {
    const list = document.getElementById('photoList');
    list.innerHTML = '';
    photos.forEach((p, i) => {
        const li = document.createElement('li');
        console.log(p.caption)
        li.replaceChildren(...p.caption.map(cap => cap.cloneNode(1)));
        li.draggable = true;
        li.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', i);
        });
        li.addEventListener('dragover', e => {
            e.preventDefault();
        });
        li.addEventListener('drop', e => {
            e.preventDefault();
            const from = parseInt(e.dataTransfer.getData('text/plain'));
            const to = i;

            const currentPhotoSrc = photos[currentIndex]?.src;

            photos.splice(to, 0, photos.splice(from, 1)[0]);

            updatePhotoListUI();
            renderSlidesOnce();

            currentIndex = photos.findIndex(p => p.src === currentPhotoSrc);
            showSlide(currentIndex);
        });

        list.appendChild(li);
    });
}
