let recentCities = [];

window.onload = () => {
  updateDateTime();
  setInterval(updateDateTime, 60000);
};

function updateDateTime() {
  const now = new Date();
  document.getElementById("dateTime").innerText = now.toLocaleString();
}

async function getWeather(cityInputValue) {
  const city = cityInputValue || document.getElementById('cityInput').value;

  if (!city) return;

  const res = await fetch(`/weather?city=${city}`);
  const data = await res.json();
  displayWeather(data);
}

function displayWeather(data) {
  const condition = data.description?.toLowerCase() || '';

  if (condition.includes("rain")) {
    document.body.style.background = "linear-gradient(to right, #667db6, #0082c8)";
  } else if (condition.includes("clear")) {
    document.body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
  } else if (condition.includes("cloud")) {
    document.body.style.background = "linear-gradient(to right, #d7d2cc, #304352)";
  } else {
    document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
  }

  const resultDiv = document.getElementById('weatherResult');
  if (data.error) {
    resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
  } else {
    resultDiv.innerHTML = `
      <h2>${data.name}, ${data.country}</h2>
      <p>🌡️ ${data.temp}°C</p>
      <p>💧 Humidity: ${data.humidity}%</p>
      <p><img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="icon" /> ${data.description}</p>
    `;
  }

  if (data.recent && data.recent.length > 0) {
    const recentEl = document.getElementById('recent');
    recentEl.innerHTML = `<h3>Recent Searches</h3><ul id="recent-list" style="list-style: none; padding: 0;"></ul>`;
    const ul = document.getElementById("recent-list");
    data.recent.forEach(cityName => {
      const li = document.createElement("li");
      li.textContent = `📍 ${cityName}`;
      li.classList.add("recent-item");
      li.onclick = () => getWeather(cityName);
      ul.appendChild(li);
    });
  }
}