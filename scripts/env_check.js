(function () {
    if (window.location.protocol === 'file:') {
        var warning = document.createElement('div');
        warning.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; background-color: #ff4757; color: white; text-align: center; padding: 15px; font-family: system-ui, -apple-system, sans-serif; font-weight: bold; z-index: 9999; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
        warning.textContent = '⚠️ Application is running via file:// protocol. API requests and Modules will not work. Please run using a local server (e.g., Live Server).';
        document.body.prepend(warning);
    }
})();
