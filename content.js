/**
 * Atenea Dark Mode - Content Script (Sin Flash Version)
 * Sincroniza con localStorage para evitar flash blanco
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'darkMode',
        LOCALSTORAGE_KEY: 'atenea-dark-mode',
        CONTAINER_ID: 'atenea-dark-mode-container',
        SWITCH_ID: 'atenea-dark-switch',
        CLASS_ENABLED: 'dark-mode-enabled',
        DEFAULT_STATE: true
    };

    /**
     * Inject the dark mode switch into the navbar
     */
    function injectDarkModeSwitch() {
        const bell = document.getElementById('nav-notification-popover-container');
        
        if (!bell || document.getElementById(CONFIG.CONTAINER_ID)) {
            return;
        }

        const container = document.createElement('div');
        container.id = CONFIG.CONTAINER_ID;
        container.className = 'd-flex align-items-center me-3';

        container.innerHTML = `
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="${CONFIG.SWITCH_ID}">
                <label class="custom-control-label" for="${CONFIG.SWITCH_ID}" style="cursor:pointer;">
                    <i class="fa fa-sun-o sun-icon" style="color: #676767;"></i>
                    <i class="fa fa-moon-o moon-icon" style="color: #80D8FF; display: none;"></i>
                </label>
            </div>
        `;

        bell.parentNode.insertBefore(container, bell);
        setupSwitch();
    }

    /**
     * Setup switch functionality
     */
    function setupSwitch() {
        const checkbox = document.getElementById(CONFIG.SWITCH_ID);
        const sunIcon = document.querySelector(`#${CONFIG.CONTAINER_ID} .sun-icon`);
        const moonIcon = document.querySelector(`#${CONFIG.CONTAINER_ID} .moon-icon`);

        if (!checkbox || !sunIcon || !moonIcon) {
            console.error('Atenea Dark Mode: Switch elements not found');
            return;
        }

        // Leer preferencia guardada (chrome.storage es la fuente de verdad)
        chrome.storage.local.get(CONFIG.STORAGE_KEY, (data) => {
            const isEnabled = data[CONFIG.STORAGE_KEY] !== false;
            checkbox.checked = isEnabled;
            applyTheme(isEnabled, sunIcon, moonIcon);
            
            // Sincronizar con localStorage
            localStorage.setItem(CONFIG.LOCALSTORAGE_KEY, isEnabled.toString());
        });

        // Listener para cambios
        checkbox.addEventListener('change', () => {
            const isEnabled = checkbox.checked;
            applyTheme(isEnabled, sunIcon, moonIcon);
            
            // Guardar en ambos lugares para sincronización
            chrome.storage.local.set({ [CONFIG.STORAGE_KEY]: isEnabled });
            localStorage.setItem(CONFIG.LOCALSTORAGE_KEY, isEnabled.toString());
        });
    }

    /**
     * Apply or remove dark mode theme
     */
    function applyTheme(isEnabled, sunIcon, moonIcon) {
        // Toggle class on both html and body
        document.documentElement.classList.toggle(CONFIG.CLASS_ENABLED, isEnabled);
        document.body.classList.toggle(CONFIG.CLASS_ENABLED, isEnabled);

        // Toggle icons
        if (isEnabled) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        } else {
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        }
    }

    /**
     * Watch for dynamic content changes
     */
    function observePageChanges() {
        if (!document.getElementById(CONFIG.SWITCH_ID)) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (!document.getElementById(CONFIG.CONTAINER_ID)) {
                injectDarkModeSwitch();
            }
        });

        const header = document.querySelector('header') || document.body;
        observer.observe(header, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Initialize the extension
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                injectDarkModeSwitch();
                observePageChanges();
            });
        } else {
            injectDarkModeSwitch();
            observePageChanges();
        }

        // Retry injection after a short delay
        setTimeout(() => {
            if (!document.getElementById(CONFIG.CONTAINER_ID)) {
                injectDarkModeSwitch();
            }
        }, 1000);
    }

    // Start the extension
    init();
})();