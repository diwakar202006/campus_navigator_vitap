document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("facultyContainer");
    const searchBar = document.getElementById("searchBar");
    let facultyData = [];

    // Load faculty.json
    fetch("data/faculty.json")
        .then(response => response.json())
        .then(data => {
            facultyData = data;
            renderFacultyCards(facultyData);
        })
        .catch(error => {
            console.error("Error loading faculty.json:", error);
            container.innerHTML = "<p>⚠️ Could not load faculty data.</p>";
        });

    // Render all faculty cards
    function renderFacultyCards(data) {
        container.innerHTML = ""; // Clear previous

        if (data.length === 0) {
            container.innerHTML = "<p>No faculty found.</p>";
            return;
        }

        data.forEach(faculty => {
            const card = document.createElement("div");
            card.className = "faculty-card";

            card.innerHTML = `
                <img src="${faculty.photoUrl}" alt="${faculty.name}" loading="lazy">
                <h3>${faculty.name}</h3>
                <p><strong>Designation:</strong> ${faculty.designation}</p>
                <p><strong>School:</strong> ${faculty.school}</p>
                <p><strong>Specialisation:</strong> ${faculty.specialisation}</p>
                <p><strong>Email:</strong> <a href="mailto:${faculty.email}">${faculty.email}</a></p>
                <p><strong>Cabin:</strong> ${faculty.cabin}</p>
            `;

            container.appendChild(card);
        });
    }

    // Filter function for search bar
    searchBar.addEventListener("input", function () {
        const query = this.value.toLowerCase();

        const filtered = facultyData.filter(faculty =>
            faculty.name.toLowerCase().includes(query) ||
            faculty.designation.toLowerCase().includes(query) ||
            faculty.specialisation.toLowerCase().includes(query) ||
            faculty.school.toLowerCase().includes(query)
        );

        renderFacultyCards(filtered);
    });
});
