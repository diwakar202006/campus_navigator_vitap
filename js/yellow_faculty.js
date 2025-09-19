document.addEventListener("DOMContentLoaded", () => {
  let facultyData = [];

  const container = document.getElementById("yellow-faculty-container");
  const searchInput = document.getElementById("yellow-faculty-search");

  // Function to highlight matched text
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
  }

  // Function to render cards
  function renderCards(data, searchTerm = "") {
    container.innerHTML = ""; // Clear previous cards

    data.forEach((faculty, index) => {
      const card = document.createElement("div");
      card.classList.add("yellow-faculty-card");
      card.style.animationDelay = `${index * 0.2}s`;

      card.innerHTML = `
        <h3>${highlightText(faculty.name, searchTerm)}</h3>
        <p><strong>Roll:</strong> ${faculty.roll}</p>
        <p><strong>Employee ID:</strong> ${faculty.id}</p>
        <p><strong>Cabin:</strong> ${faculty.cabin}</p>
      `;

      container.appendChild(card);
    });
  }

  // Fetch faculty data
  fetch("data/faculty_yellow_tag.json")
    .then(response => response.json())
    .then(data => {
      facultyData = data;
      renderCards(facultyData);
    })
    .catch(error => console.error("Error loading JSON:", error));

  // Add search functionality
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = facultyData.filter(faculty =>
      faculty.name.toLowerCase().includes(searchTerm)
    );
    renderCards(filtered, searchTerm);
  });
});
