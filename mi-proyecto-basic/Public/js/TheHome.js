document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
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
  });
  