document.addEventListener("DOMContentLoaded", () => {
    // Manejo del formulario de pacientes
    const patientForm = document.getElementById("patient-login-form");
    if (patientForm) {
        patientForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("patient-email").value;
            const password = document.getElementById("patient-password").value;

            try {
                const res = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (data.success) {
                    // Guardamos datos en localStorage
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // Redirigimos al perfil
                    window.location.href = "perfil.html";
                } else {
                    alert(data.message || "Error al iniciar sesión");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Error de conexión con el servidor");
            }
        });
    }

    // Manejo del formulario de doctores
    const doctorForm = document.getElementById("doctor-login-form");
    if (doctorForm) {
        doctorForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("doctor-email").value;
            const identificacion = document.getElementById("doctor-identificacion").value;

            try {
                const res = await fetch("http://localhost:3000/login-dentist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, identificacion })
                });

                const data = await res.json();

                if (data.success) {
                    // Guardamos los datos del odontólogo
                    localStorage.setItem("doctor", JSON.stringify(data.doctor));

                    // Redirigimos a la página de perfil del odontólogo
                    window.location.href = "perfildoctor.html";
                } else {
                    alert(data.message || "Error al iniciar sesión");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Error de conexión con el servidor");
            }
        });
    }

    // Manejo de la activación del botón submit para el formulario de pacientes
    if (patientForm) {
        const patientEmail = document.getElementById("patient-email");
        const patientPassword = document.getElementById("patient-password");
        const patientSubmitBtn = document.getElementById("patient-submit-btn");

        const validatePatientForm = () => {
            const isValid = patientEmail.value.trim() !== "" && 
                          patientPassword.value.trim().length >= 6;
            patientSubmitBtn.disabled = !isValid;
            if (isValid) {
                patientSubmitBtn.classList.add("valid");
            } else {
                patientSubmitBtn.classList.remove("valid");
            }
        };

        patientEmail.addEventListener("input", validatePatientForm);
        patientPassword.addEventListener("input", validatePatientForm);
    }

    // Manejo de la activación del botón submit para el formulario de doctores
    if (doctorForm) {
        const doctorEmail = document.getElementById("doctor-email");
        const doctorIdentificacion = document.getElementById("doctor-identificacion");
        const doctorSubmitBtn = document.getElementById("doctor-submit-btn");

        const validateDoctorForm = () => {
            const isValid = doctorEmail.value.trim() !== "" && 
                          doctorIdentificacion.value.trim().length >= 6;
            doctorSubmitBtn.disabled = !isValid;
            if (isValid) {
                doctorSubmitBtn.classList.add("valid");
            } else {
                doctorSubmitBtn.classList.remove("valid");
            }
        };

        doctorEmail.addEventListener("input", validateDoctorForm);
        doctorIdentificacion.addEventListener("input", validateDoctorForm);
    }

    // Manejo de la visualización de la contraseña
    const passwordToggle = document.getElementById("patient-password-toggle");
    if (passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const passwordInput = document.getElementById("patient-password");
            const icon = passwordToggle.querySelector("i");
            
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    }

    // Manejo de las pestañas (tabs)
    const tabs = document.querySelectorAll(".tab-button");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove("active"));
            
            // Agregar clase active a la pestaña clickeada
            tab.classList.add("active");

            // Mostrar el formulario correspondiente
            const formType = tab.dataset.tab;
            const formContainer = document.querySelector(".form-container");
            
            document.querySelectorAll(".form-wrapper").forEach(wrapper => {
                wrapper.classList.add("hidden");
                wrapper.classList.remove("active");
            });

            const targetWrapper = document.getElementById(`${formType}-form-wrapper`);
            if (targetWrapper) {
                targetWrapper.classList.remove("hidden");
                targetWrapper.classList.add("active");
            }

            // Actualizar el estilo del contenedor según el tipo de usuario
            formContainer.className = `form-container ${formType}-mode`;
        });
    });
});