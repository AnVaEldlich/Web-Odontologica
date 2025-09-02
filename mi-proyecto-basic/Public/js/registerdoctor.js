document.getElementById('odontologo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('.submit-button');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    // Add loading state
    submitButton.classList.add('loading');
    submitButton.textContent = 'Enviando...';
    
    // Simulate form submission
    setTimeout(() => {
        // Show confirmation message
        confirmationMessage.style.display = 'block';
        confirmationMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Reset button
        submitButton.classList.remove('loading');
        submitButton.textContent = 'Registrarme';
        
        // Reset form
        this.reset();
        
        // Hide confirmation message after 5 seconds
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 5000);
    }, 2000);
});

// Enhanced form validation
const requiredFields = document.querySelectorAll('input[required]');
requiredFields.forEach(field => {
    field.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });

    field.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });
});

// Email validation
const emailField = document.getElementById('email');
emailField.addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#ef4444';
        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
});

// Phone number formatting
const phoneField = document.getElementById('telefono');
phoneField.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
});

// NIT formatting
const nitField = document.getElementById('nit');
nitField.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d\-]/g, '');
    e.target.value = value;
});