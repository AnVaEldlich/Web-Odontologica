let currentTab = 'patient';
        
        function switchTab(tabType) {
            const tabs = document.querySelectorAll('.tab-button');
            const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
            
            // Remover clase active de todas las pestañas
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Agregar clase active a la pestaña seleccionada
            activeTab.classList.add('active');
            
            // Actualizar variable global
            currentTab = tabType;
            
            // Actualizar título según el tipo de usuario
            const title = document.querySelector('.form-title');
            title.textContent = tabType === 'patient' ? 'Acceder a Mi Cuenta' : 'Acceso Profesional';
            
            // Actualizar placeholder del email si es necesario
            const emailInput = document.getElementById('email');
            if (tabType === 'doctor') {
                emailInput.placeholder = 'Email profesional*';
            } else {
                emailInput.placeholder = 'Correo electrónico*';
            }


            
            // Reset form
            resetForm();
        }


        function changelink(tabType) {

            currentTab = tabType;

            const link = document.getElementById('register-link');
            const container = document.getElementById('register');

            container.style.display = 'block';

            if (tabType === 'patient') {
                link.href = './Pages/register.html';
            } else if (tabType === 'doctor') {
                link.href = './Pages/registerdoctor.html';
            }
        }

       /*

        function showRegister() {
            alert(`Registro de ${currentTab === 'patient' ? 'paciente' : 'doctor'} - Por implementar`);
        } */

        function validateForm() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = document.getElementById('submit-btn');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = email && emailRegex.test(email);
            
            if (email && !isEmailValid) {
                emailInput.classList.add('error');
                emailError.classList.add('show');
            } else {
                emailInput.classList.remove('error');
                emailError.classList.remove('show');
            }
            
            // Habilitar/deshabilitar botón
            const isFormValid = isEmailValid && password.length > 0;
            submitBtn.disabled = !isFormValid;
        }

        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleButton = document.getElementById('password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleButton.textContent = '👁';
            }
        }

        function resetForm() {
            const form = document.getElementById('loginForm');
            const submitBtn = document.getElementById('submit-btn');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            
            form.reset();
            submitBtn.disabled = true;
            emailInput.classList.remove('error');
            emailError.classList.remove('show');
        }

        function handleSubmit(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = currentTab;
            
            // Simular proceso de login
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(`Login simulado:\nTipo: ${userType === 'patient' ? 'Paciente' : 'Doctor'}\nEmail: ${email}`);
                submitBtn.textContent = 'Iniciar sesión';
                validateForm();
            }, 2000);
        }

       /*  function showForgotPassword() {
            alert('Funcionalidad de recuperación de contraseña - Por implementar');
        } */

        
        // cambiar esto 
        /* function showRegister() {
            alert(`Registro de ${currentTab === 'patient' ? 'paciente' : 'doctor'} - Por implementar`);
        } */

        // Funciones del menú (mantener las existentes)
        function toggleMenu() {
            const nav = document.getElementById('navigation');
            const overlay = document.getElementById('overlay');
            
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function closeMenu() {
            const nav = document.getElementById('navigation');
            const overlay = document.getElementById('overlay');
            
            nav.classList.remove('active');
            overlay.classList.remove('active');
        }

        function closeMenuOnMobile() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        }

        // Auto-hide del menú en desktop cuando el mouse se aleja
        document.addEventListener('mouseleave', function(event) {
            const nav = document.getElementById('navigation');
            const isDesktop = window.innerWidth > 768;
            
            if (isDesktop && event.clientX < 250) {
                setTimeout(() => {
                    if (!nav.matches(':hover')) {
                        nav.classList.remove('show');
                    }
                }, 500);
            }
        });

        // Mostrar menú cuando el mouse está cerca del borde izquierdo (desktop)
        document.addEventListener('mousemove', function(event) {
            const nav = document.getElementById('navigation');
            const isDesktop = window.innerWidth > 768;
            
            if (isDesktop && event.clientX < 50) {
                nav.classList.add('show');
            } else if (isDesktop && event.clientX > 250 && !nav.matches(':hover')) {
                nav.classList.remove('show');
            }
        });

        // Manejar cambios de tamaño de ventana
        window.addEventListener('resize', function() {
            const nav = document.getElementById('navigation');
            const overlay = document.getElementById('overlay');
            
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                overlay.classList.remove('active');
            } else {
                nav.classList.remove('show');
            }
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        

        // Modificar esto -------------------------------------------

            // Validar formulario de registro
    function validateRegisterForm() {
        const form = document.querySelector('form[action="/submit"]');
        if (!form) return; // Si no existe el formulario, salir

        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input[required]');
        
        function checkForm() {
            let isValid = true;
            
            // Verificar que todos los campos requeridos tengan valor
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                }
            });
            
            // Verificar que las contraseñas coincidan
            const password = form.querySelector('#password').value;
            const confirmPassword = form.querySelector('#confirm-password').value;
            if (password && password !== confirmPassword) {
                isValid = false;
            }
            
            // Habilitar/deshabilitar botón
            submitBtn.disabled = !isValid;
            return isValid;
        }
        
        // Escuchar cambios en los inputs
        inputs.forEach(input => {
            input.addEventListener('input', checkForm);
        });
        
        // Validar al cargar la página
        checkForm();
    }

// Llamar a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', validateRegisterForm);