// Sample faculty data (for testing)
// Replace this with data loaded from JSON or backend later
const facultyData = [
    {
        name: "Dr. A. Suresh",
        department: "Computer Science",
        cabin: "AB1-203",
        image: "images/faculty/suresh.jpg"
    },
    {
        name: "Dr. R. Meena",
        department: "Mathematics",
        cabin: "AB1-115",
        image: "images/faculty/meena.jpg"
    },
    {
        name: "Prof. N. Kishore",
        department: "Electrical",
        cabin: "AB2-310",
        image: "images/faculty/kishore.jpg"
    }
    // Add more entries here or load from external JSON
];

// Render all faculty cards
function renderFacultyCards(data) {
    const container = document.getElementById('facultyContainer');
    container.innerHTML = ''; // Clear previous

    if (data.length === 0) {
        container.innerHTML = "<p>No faculty found.</p>";
        return;
    }

    data.forEach(faculty => {
        const card = document.createElement('div');
        card.className = 'faculty-card';

        card.innerHTML = `
            <img src="${faculty.image}" alt="${faculty.name}">
            <h3>${faculty.name}</h3>
            <p>${faculty.department}</p>
            <p><strong>Cabin:</strong> ${faculty.cabin}</p>
        `;

        container.appendChild(card);
    });
}

// Filter function for search bar
document.getElementById('searchBar').addEventListener('input', function () {
    const query = this.value.toLowerCase();

    const filtered = facultyData.filter(faculty =>
        faculty.name.toLowerCase().includes(query) ||
        faculty.department.toLowerCase().includes(query)
    );

    renderFacultyCards(filtered);
});

// Initial render
renderFacultyCards(facultyData);
