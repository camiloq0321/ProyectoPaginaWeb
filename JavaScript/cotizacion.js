class CotizacionSystem {
    constructor() {
        this.productRows = [];
        this.form = null;
        this.init();
    }

    // Inicializar el sistema
    init() {
        this.setupForm();
        this.setupProductRows();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    // Configurar el formulario
    setupForm() {
        this.form = document.getElementById('cotizacionForm');
        if (!this.form) {
            console.warn('Formulario de cotización no encontrado');
            return;
        }
    }

    // Configurar las filas de productos
    setupProductRows() {
        this.productRows = document.querySelectorAll('.product-row');
        
        if (this.productRows.length === 0) {
            console.warn('No se encontraron filas de productos');
            return;
        }

        // Configurar estado inicial de cada fila
        this.productRows.forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const qtyInput = row.querySelector('input[type="number"]');
            
            if (checkbox && qtyInput) {
                // Configurar estado inicial
                this.toggleQuantityField(checkbox, qtyInput);
                
                // Agregar atributos de datos para identificación
                row.dataset.index = index;
                row.dataset.productName = checkbox.value;
            }
        });
    }

    // Configurar event listeners
    setupEventListeners() {
        this.productRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const qtyInput = row.querySelector('input[type="number"]');
            
            if (checkbox && qtyInput) {
                // Event listener para checkbox
                checkbox.addEventListener('change', () => {
                    this.toggleQuantityField(checkbox, qtyInput);
                });
                
                // Event listener para cantidad
                qtyInput.addEventListener('input', () => {
                    this.validateQuantity(qtyInput);
                });
            }
        });
    }

    // Configurar validación del formulario
    setupFormValidation() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    // Alternar estado del campo de cantidad
    toggleQuantityField(checkbox, qtyInput) {
        const enabled = checkbox.checked;
        qtyInput.disabled = !enabled;
        
        if (!enabled) {
            qtyInput.value = '';
            qtyInput.classList.remove('valid', 'invalid');
        }
    }

    // Validar cantidad ingresada
    validateQuantity(qtyInput) {
        const value = parseInt(qtyInput.value);
        
        if (value <= 0) {
            qtyInput.classList.add('invalid');
            qtyInput.classList.remove('valid');
        } else {
            qtyInput.classList.add('valid');
            qtyInput.classList.remove('invalid');
        }
    }

    // Verificar si hay productos seleccionados
    hasSelectedProducts() {
        return Array.from(this.productRows).some(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const qtyInput = row.querySelector('input[type="number"]');
            
            return checkbox.checked && qtyInput.value && parseInt(qtyInput.value) > 0;
        });
    }

    // Obtener productos seleccionados-------
    getSelectedProducts() {
        const selected = [];
        
        this.productRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const qtyInput = row.querySelector('input[type="number"]');
            
            if (checkbox.checked && qtyInput.value && parseInt(qtyInput.value) > 0) {
                selected.push({
                    name: checkbox.value,
                    quantity: parseInt(qtyInput.value)
                });
            }
        });
        
        return selected;
    }

    // Manejar envío del formulario
    handleFormSubmit(e) {
        e.preventDefault();
        // Verificar que al menos un producto esté seleccionado
        if (!this.hasSelectedProducts()) {
            this.showError('⚠️ Debes seleccionar al menos un producto e ingresar una cantidad válida.');
            return false;
        }
        
        // Verificar que todas las cantidades sean válidas
        const selectedProducts = this.getSelectedProducts();
        const invalidQuantities = selectedProducts.filter(product => 
            !product.quantity || product.quantity <= 0
        );
        
        if (invalidQuantities.length > 0) {
            this.showError('⚠️ Por favor, verifica que todas las cantidades sean mayores a 0.');
            return false;
        }
        
        // Obtener datos del formulario--------
        const formData = new FormData(this.form);
        const cotizacionData ={
            nombre: formData.get('nombre'),
            ciudad: formData.get('ciudad'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            productos: selectedProducts
        };

        //Enviar datos al servidor
        this.enviarCotizacion(cotizacionData);
    }

    // Enviar cotización al servidor-------------------
    async enviarCotizacion(cotizacionData) {
        this.showLoading('Enviando cotización...');
        
        try {
            const response = await fetch('/cotizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cotizacionData)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('¡Cotización enviada exitosamente! Redirigiendo a los resultados...');
                setTimeout(() => {
                    window.location.href = `/resultado/${result.cotizacionId}`;
                }, 2000);
            } else {
                throw new Error(result.message || 'Error al enviar la cotización');
            }
        } catch (error) {
            console.error('Error al enviar cotización:', error);
            this.showError(`Error al enviar la cotización: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    // Mostrar indicador de carga
    showLoading(message) {
        this.removeMenssage();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'cotizacion-loading';
        loadingDiv.style.cssText = `
            color: #2196f3;
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        loadingDiv.innerHTML = `⏳ ${message}`;
        
        if (this.form) {
            this.form.insertBefore(loadingDiv, this.form.firstChild);
        }
    }

    // Ocultar indicador de carga
    hideLoading() {
        const loadingDiv = document.getElementById('cotizacion-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    


    //Mostrar mensaje de exito
    showSuccess(message)
    {
        this.removeMenssage();

        const successDiv = document.createElement('div');
        successDiv.id = 'cotizacion-success';
        successDiv.style.cssText = `
            color: #4caf50;
            background-color: #e8f5e8;
            border: 1px solid #4caf50;
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        successDiv.innerHTML = `✅ ${message}`;
        
        if (this.form) {
            this.form.insertBefore(successDiv, this.form.firstChild);
        }
    }

    removeMenssage(){
        this.removeError();
        this.hideLoading();
        const successDiv = document.getElementById('cotizacion-success');
        if(successDiv){
            successDiv.remove();
        }
    }

    // Mostrar mensaje de error
    showError(message) {
        // Remover mensaje de error existente
        this.removeError();
        
        // Crear nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.id = 'cotizacion-error';
        errorDiv.style.cssText = `
            color: #ff6b6b;
            background-color: #ffe6e6;
            border: 1px solid #ff6b6b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        errorDiv.innerHTML = message;
        
        // Insertar mensaje al inicio del formulario
        if (this.form) {
            this.form.insertBefore(errorDiv, this.form.firstChild);
            
            // Hacer scroll hacia el mensaje de error
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            this.removeError();
        }, 5000);
    }

    // Remover mensaje de error
    removeError() {
        const existingError = document.getElementById('cotizacion-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Limpiar formulario
    clearForm() {
        this.productRows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const qtyInput = row.querySelector('input[type="number"]');
            
            if (checkbox && qtyInput) {
                checkbox.checked = false;
                qtyInput.value = '';
                qtyInput.disabled = true;
                qtyInput.classList.remove('valid', 'invalid');
            }
        });
        
        // Limpiar otros campos del formulario
        if (this.form) {
            this.form.reset();
        }
        
        this.removeError();
    }

    // Obtener resumen de cotización
    getCotizacionSummary() {
        const selected = this.getSelectedProducts();
        
        return {
            productos: selected,
            fecha: new Date().toLocaleDateString('es-CO'),
            items: selected.length,
            totalProductos: selected.reduce((sum, product) => sum + product.quantity, 0)
        };
    }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de cotización si existe
    if (document.querySelector('.product-row') || document.getElementById('cotizacionForm')) {
        console.log('Inicializando sistema de cotización...');
        window.cotizacionSystem = new CotizacionSystem();
        
        // Agregar botón de limpiar si no existe
        if (!document.getElementById('limpiar-cotizacion')) {
            const form = document.getElementById('cotizacionForm');
            if (form) {
                const clearButton = document.createElement('button');
                clearButton.type = 'button';
                clearButton.id = 'limpiar-cotizacion';
                clearButton.textContent = 'Limpiar Cotización';
                clearButton.style.cssText = `
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    background-color: #667eea;
                    color: white;
                `;
                
                // Efecto hover
                clearButton.addEventListener('mouseenter', () => {
                    clearButton.style.backgroundColor = '#667eea';
                });
                
                clearButton.addEventListener('mouseleave', () => {
                    clearButton.style.backgroundColor = '#667eea';
                });
                
                clearButton.addEventListener('click', () => {
                    if (window.cotizacionSystem) {
                        window.cotizacionSystem.clearForm();
                    }
                });
                
                // Insertar botón antes del botón de enviar
                const submitBtn = form.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.parentNode.insertBefore(clearButton, submitBtn);
                } else {
                    form.appendChild(clearButton);
                }
            }
        }
        
        console.log('Sistema de cotización inicializado correctamente');
    }
});