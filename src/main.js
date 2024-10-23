document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        if (slides.length === 0) {
            console.error("No se encontraron elementos con la clase 'mySlides'.");
            return;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  // Oculta todas las diapositivas
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }  // Reinicia al principio
        slides[slideIndex - 1].style.display = "block";  // Muestra la diapositiva actual
        setTimeout(showSlides, 3000);  // Cambia cada 3 segundos
    }
});
