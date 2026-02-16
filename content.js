function injectDarkModeSwitch() {
    const bell = document.getElementById('nav-notification-popover-container');
    if (!bell || document.getElementById('atenea-dark-mode-container')) return;

    const container = document.createElement('div');
    container.id = 'atenea-dark-mode-container';
    container.className = 'd-flex align-items-center me-3';

    // Volvemos a la estructura simple que funcionaba visualmente
    container.innerHTML = `
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="atenea-dark-switch">
            <label class="custom-control-label" for="atenea-dark-switch" style="cursor:pointer;">
                <i class="fa fa-sun-o sun-icon" style="color: #676767;"></i>
                <i class="fa fa-moon-o moon-icon" style="color: #80D8FF; display: none;"></i>
            </label>
        </div>
    `;

    bell.parentNode.insertBefore(container, bell);

    const checkbox = document.getElementById('atenea-dark-switch');
    const sunIcon = container.querySelector('.sun-icon');
    const moonIcon = container.querySelector('.moon-icon');

    function applyTheme(isEnabled) {
        // Esta es la clave: añade o quita la clase al body
        document.body.classList.toggle('dark-mode-enabled', isEnabled);
        
        // Intercambio de iconos
        if (isEnabled) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        } else {
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        }
    }

    // Leer preferencia guardada
    chrome.storage.local.get('darkMode', (data) => {
        const isEnabled = data.darkMode !== false; // ON por defecto
        checkbox.checked = isEnabled;
        applyTheme(isEnabled);
    });

    checkbox.addEventListener('change', () => {
        applyTheme(checkbox.checked);
        chrome.storage.local.set({ darkMode: checkbox.checked });
    });
}

injectDarkModeSwitch();