document.addEventListener("DOMContentLoaded", () => {
  fetch("faculty_yellow_tag.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("faculty-container");

      data.forEach(faculty => {
        const card = document.createElement("div");
        card.classList.add("yellow-faculty-card");

        card.innerHTML = `
          <h3>${faculty.name}</h3>
          <p><strong>Roll:</strong> ${faculty.roll}</p>
          <p><strong>Employee ID:</strong> ${faculty.id}</p>
          <p><strong>Cabin:</strong> ${faculty.cabin}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading JSON:", error));
});
