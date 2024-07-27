document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById("wrapper");
    const sidebar = document.getElementById("sidebar-wrapper");
    const toggleButton = document.getElementById("menu-toggle");

    // Toggle sidebar and content classes
    toggleButton.addEventListener("click", function() {
        wrapper.classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".bg-half-gradient").classList.toggle("toggled");
        document.querySelector(".bg-gradient").classList.toggle("toggled");
    });

    // Close the sidebar if clicking outside of it
    document.addEventListener("click", function(event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target) && wrapper.classList.contains("toggled")) {
            wrapper.classList.remove("toggled");
            document.querySelector(".main-content").classList.remove("toggled");
            document.querySelector(".bg-half-gradient").classList.remove("toggled");
            document.querySelector(".bg-gradient").classList.remove("toggled");
        }
    });
});