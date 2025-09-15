document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("facultyContainer");
    const searchBar = document.getElementById("searchBar");
    const departmentFilter = document.getElementById("departmentFilter");
    let facultyData = [];
    let currentDepartment = "all"; // default view shows all
    const departments = ['scope', 'sense', 'vish', 'sas', 'other'];

    // Load all department files
    async function loadDepartments() {
        for (let dept of departments) {
            try {
                const response = await fetch(`data/${dept}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${dept}.json`);
                }
                const data = await response.json();

                // Enrich data by adding department name and cleaning fields
                const enriched = data.map(faculty => ({
                    name: faculty.name,
                    photoUrl: faculty.photo_url,
                    designation: faculty.school,
                    school: faculty.school1,
                    specialisation: faculty.specialisation.replace("Specialisation : ", ""),
                    email: faculty.email.replace("Email : ", ""),
                    cabin: faculty.cabin.replace("Office Address : ", ""),
                    url: faculty.url,
                    department: dept.charAt(0).toUpperCase() + dept.slice(1) // Capitalize
                }));

                facultyData = facultyData.concat(enriched);
            } catch (error) {
                console.error(error);
            }
        }
        renderFacultyCards(facultyData);
    }

    // Render the faculty cards grouped by department
    function renderFacultyCards(data) {
        container.innerHTML = "";
        if (!data || data.length === 0) {
            container.innerHTML = "<p>No faculty found.</p>";
            return;
        }

        // Group by department
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
                    <img src="${faculty.photoUrl || 'images/fallback.png'}" alt="${faculty.name}" loading="lazy" onerror="this.src='images/fallback.png'">
                    <h3>${faculty.name}</h3>
                    <p><strong>Designation:</strong> ${faculty.designation}</p>
                    <p><strong>School:</strong> ${faculty.school}</p>
                    <p><strong>Specialisation:</strong> ${faculty.specialisation}</p>
                    <p><strong>Email:</strong> <a href="mailto:${faculty.email}">${faculty.email}</a></p>
                    <p><strong>Cabin:</strong> ${faculty.cabin}</p>
                    <p><a href="${faculty.url}" target="_blank">More Info</a></p>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        }
    }

    // Filter based on search query and selected department
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
            filtered = filtered.filter(faculty => faculty.department.toLowerCase() === currentDepartment);
        }

        renderFacultyCards(filtered);
    }

    // Handle
