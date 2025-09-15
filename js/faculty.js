document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("facultyContainer");
    const searchBar = document.getElementById("searchBar");
    const departmentFilter = document.getElementById("departmentFilter");
    let facultyData = [];
    let currentDepartment = "all"; // default to show all
    const departments = ['scope', 'sense', 'vish', 'sas', 'other'];

    async function loadDepartments() {
        for (let dept of departments) {
            try {
                const response = await fetch(`data/${dept}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${dept}.json`);
                }
                const data = await response.json();
                const enriched = data.faculties.map(fac => ({
                    ...fac,
                    department: data.department
                }));
                facultyData = facultyData.concat(enriched);
            } catch (error) {
                console.error(error);
            }
        }
        renderFacultyCards(facultyData);
    }

    function renderFacultyCards(data) {
        container.innerHTML = "";
        if (!data || data.length === 0) {
            container.innerHTML = "<p>No faculty found.</p>";
            return;
        }
        const grouped = data.reduce((acc, faculty) => {
            if (!acc[faculty.department]) {
                acc[faculty.department] = [];
            }
            acc[faculty.department].push(faculty);
            return acc;
        }, {});
        for (let dept in grouped) {
            const section = document.createElement("div");
            section.className = "department-section";
            const title = document.createElement("h2");
            title.className = "department-title";
            title.textContent = dept;
            section.appendChild(title);
            const grid = document.createElement("div");
            grid.className = "cards-grid";
            grouped[dept].forEach(faculty => {
                const card = document.createElement("div");
                card.className = "faculty-card";
                card.innerHTML = `
                    <img src="${faculty.photoUrl || 'fallback.png'}" alt="${faculty.name}" loading="lazy" onerror="this.src='fallback.png'">
                    <h3>${faculty.name}</h3>
                    <p><strong>Designation:</strong> ${faculty.designation}</p>
                    <p><strong>School:</strong> ${faculty.school}</p>
                    <p><strong>Specialisation:</strong> ${faculty.specialisation}</p>
                    <p><strong>Email:</strong> <a href="mailto:${faculty.email}">${faculty.email}</a></p>
                    <p><strong>Cabin:</strong> ${faculty.cabin}</p>
                `;
                grid.appendChild(card);
            });
            section.appendChild(grid);
            container.appendChild(section);
        }
    }

    searchBar.addEventListener("input", function () {
        filterAndRender();
    });

    departmentFilter.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            document.querySelectorAll(".department-filter button").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            currentDepartment = e.target.getAttribute("data-dept");
            filterAndRender();
        }
    });

    function filterAndRender() {
        const query = searchBar.value.toLowerCase();
        let filtered = facultyData;
        if (query) {
            filtered = filtered.filter(faculty =>
                faculty.name.toLowerCase().includes(query) ||
                faculty.designation.toLowerCase().includes(query) ||
                faculty.specialisation.toLowerCase().includes(query) ||
                faculty.school.toLowerCase().includes(query) ||
                faculty.email.toLowerCase().includes(query) ||
                faculty.cabin.toLowerCase().includes(query)
            );
        }
        if (currentDepartment !== "all") {
            filtered = filtered.filter(fac => fac.department === currentDepartment);
        }
        renderFacultyCards(filtered);
    }

    loadDepartments();
});
