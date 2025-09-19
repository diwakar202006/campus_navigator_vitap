
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/faculty_yellow_tag.json") // ✅ correct file path
    .then(response => {
      if (!response.ok) throw new Error("Failed to load faculty_yellow_tag.json");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("yellow-faculty-container");

      data.forEach((faculty, index) => {
        const card = document.createElement("div");
        card.classList.add("yellow-faculty-card");

        // animation delay for each card
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
          <h3>${faculty.name}</h3>
          <p><strong>Roll:</strong> ${faculty.roll}</p>
          <p><strong>Employee ID:</strong> ${faculty.id}</p>
          <p><strong>Cabin:</strong> ${faculty.cabin}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error loading JSON:", error);
      document.getElementById("yellow-faculty-container").innerHTML =
        "<p>⚠️ Could not load Yellow Tag Faculty data.</p>";
    });
});
