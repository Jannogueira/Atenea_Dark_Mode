/**
 * PRE-LOADER - Se ejecuta ANTES de document_start
 * Añade la clase dark-mode-enabled inmediatamente para evitar flash
 */

(function() {
    'use strict';
    
    // Leer preferencia de forma SÍNCRONA desde localStorage como fallback
    // (chrome.storage es asíncrono y no sirve aquí)
    const darkModeEnabled = localStorage.getItem('atenea-dark-mode');
    
    // Si es la primera vez, asumimos que está activado (default: ON)
    if (darkModeEnabled === null || darkModeEnabled === 'true') {
        // Añadir la clase INMEDIATAMENTE (antes de que se renderice nada)
        document.documentElement.classList.add('dark-mode-enabled');
        
        // También al body cuando esté disponible
        if (document.body) {
            document.body.classList.add('dark-mode-enabled');
        } else {
            // Si el body no existe aún, esperamos a que exista
            const observer = new MutationObserver(() => {
                if (document.body) {
                    document.body.classList.add('dark-mode-enabled');
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }
})();
