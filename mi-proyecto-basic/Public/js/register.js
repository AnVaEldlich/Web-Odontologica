// Generar días del mes
function generateDays() {
    const daySelect = document.getElementById('dia');
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i;
        daySelect.appendChild(option);
    }
}

// Generar años (desde 1920 hasta 2025)
function generateYears() {
    const yearSelect = document.getElementById('año');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1920; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// Seleccionar género
function selectGender(element, value) {
    document.querySelectorAll('.radio-group').forEach(group => group.classList.remove('selected'));
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    updateProgress();
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
}

// Update progress bar
function updateProgress() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    const radios = form.querySelectorAll('input[type="radio"]');
    
    let filled = 0;
    let total = inputs.length;
    
    // Check regular inputs
    inputs.forEach(input => {
        if (input.type !== 'radio' && input.value.trim() !== '') {
            filled++;
        }
    });
    
    // Check radio buttons
    const genderSelected = Array.from(radios).some(radio => radio.checked);
    if (genderSelected) {
        filled++; // Add 1 for gender selection
    }
    total++; // Add 1 to total for gender
    
    const progress = (filled / total) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    // Enable/disable submit button
    const submitButton = document.getElementById('submitButton');
    if (progress === 100 && validatePasswords()) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Validate passwords match
function validatePasswords() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMsg = document.getElementById('passwordError');
    const successMsg = document.getElementById('passwordSuccess');
    
    if (confirmPassword && password !== confirmPassword) {
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'block';
        return true;
    } else {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        return false;
    }
}

// Calculate age based on birth date
function calculateAge() {
    const mes = parseInt(document.getElementById('mes').value);
    const dia = parseInt(document.getElementById('dia').value);
    const año = parseInt(document.getElementById('año').value);
    
    if (mes && dia && año) {
        const today = new Date();
        const birthDate = new Date(año, mes - 1, dia);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        document.getElementById('edad').value = age;
        updateProgress();
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    generateDays();
    generateYears();
    
    // Add event listeners for progress tracking
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', updateProgress);
        element.addEventListener('change', updateProgress);
    });
    
    // Date change listeners for age calculation
    ['mes', 'dia', 'año'].forEach(id => {
        document.getElementById(id).addEventListener('change', calculateAge);
    });
    
    // Password strength indicator
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        if (password === '') {
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Ingresa tu contraseña';
            strengthText.className = 'strength-text';
        } else if (strength <= 2) {
            strengthBar.style.width = '33%';
            strengthBar.className = 'strength-bar strength-weak';
            strengthText.textContent = 'Contraseña débil';
            strengthText.className = 'strength-text strength-weak';
        } else if (strength <= 4) {
            strengthBar.style.width = '66%';
            strengthBar.className = 'strength-bar strength-medium';
            strengthText.textContent = 'Contraseña media';
            strengthText.className = 'strength-text strength-medium';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.className = 'strength-bar strength-strong';
            strengthText.textContent = 'Contraseña fuerte';
            strengthText.className = 'strength-text strength-strong';
        }
        
        updateProgress();
    });
    
    // Confirm password validation
    document.getElementById('confirmPassword').addEventListener('input', function() {
        validatePasswords();
        updateProgress();
    });
    
    // Form submission - Redirección directa sin alertas
    document.getElementById('registrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Tomar los datos del formulario
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Intentar enviar los datos al servidor (si existe)
            const response = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            // Redireccionar independientemente de la respuesta del servidor
            window.location.href = './TheHome.html';
            
        } catch (err) {
            // Si hay error en la conexión, aún así redireccionar
            console.log('No se pudo conectar al servidor, redireccionando...');
            window.location.href = './TheHome.html';
        }
    });
});