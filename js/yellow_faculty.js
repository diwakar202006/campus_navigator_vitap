document.addEventListener("DOMContentLoaded", () => {
  fetch("faculty_yellow_tag.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("yellow-faculty-container");

      data.forEach((faculty, index) => {
        const card = document.createElement("div");
        card.classList.add("faculty-card");

        // Add delay so each card animates one after another
        card.style.animationDelay = `${index * 0.2}s`;

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
