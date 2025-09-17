document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("facultyContainer");
    const searchBar = document.getElementById("searchBar");
    const departmentFilter = document.getElementById("departmentFilter");
    let facultyData = [];
    let currentDepartment = "all";

    // Extract department from school1 field, based on parentheses at the end
    const getDepartment = (school1) => {
        const match = school1.match(/\(([^)]+)\)$/); // Matches content inside last parentheses
        if (match && match[1]) {
            return match[1].toLowerCase(); // e.g., 'scope', 'sense', 'vish', 'sas', 'smec', 'vsl'
        }
        return "unknown";
    };

    async function loadFaculty() {
        try {
            const response = await fetch("data/faculty.json");
            if (!response.ok) throw new Error("Failed to load faculty.json");
            const data = await response.json();

            // Enrich data by adding department extracted from school1
            facultyData = data.map(faculty => ({
                ...faculty,
                department: getDepartment(faculty.school1)
            }));

            renderFacultyCards(facultyData);
        } catch (error) {
            console.error("Error loading faculty.json:", error);
            container.innerHTML = "<p>⚠️ Could not load faculty data.</p>";
        }
    }

    function renderFacultyCards(data) {
        container.innerHTML = "";
        if (!data.length) {
            container.innerHTML = "<p>No faculty found.</p>";
            return;
        }
        data.forEach(faculty => {
            const card = document.createElement("div");
            card.className = "faculty-card";

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${faculty.photo_url}" alt="${faculty.name}" loading="lazy" onerror="this.src='images/fallback.png'">
                        <h3>${faculty.name}</h3>
                        <p>${faculty.school}</p>
                    </div>
                    <div class="card-back">
                        <p><strong>School:</strong> ${faculty.school1}</p>
                        <p><strong>Specialisation:</strong> ${faculty.specialisation.replace("Specialisation : ", "")}</p>
                        <p><strong>Email:</strong> <a href="mailto:${faculty.email.replace("Email : ", "")}">${faculty.email.replace("Email : ", "")}</a></p>
                        <p><strong>Cabin:</strong> ${faculty.cabin.replace("Office Address : ", "")}</p>
                        <p><a href="${faculty.url}" target="_blank">More Info</a></p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function filterAndRender() {
        const query = searchBar.value.toLowerCase();
        let filtered = facultyData;

        if (query) {
            filtered = filtered.filter(faculty =>
                faculty.name.toLowerCase().includes(query) ||
                faculty.school.toLowerCase().includes(query) ||
                faculty.school1.toLowerCase().includes(query) ||
                faculty.specialisation.toLowerCase().includes(query) ||
                faculty.email.toLowerCase().includes(query) ||
                faculty.cabin.toLowerCase().includes(query)
            );
        }
        if (currentDepartment !== "all") {
            filtered = filtered.filter(faculty => faculty.department.toLowerCase() === currentDepartment);
        }
        renderFacultyCards(filtered);
    }

    searchBar.addEventListener("input", filterAndRender);
    departmentFilter.addEventListener("change", () => {
        currentDepartment = departmentFilter.value;
        filterAndRender();
    });

    loadFaculty();
});
