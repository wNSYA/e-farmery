// MQTT connection (test setup — replace with yours)
const mqttHost = 'wss://test.mosquitto.org:8081';
const client = mqtt.connect(mqttHost);

client.on('connect', () => {
  console.log('Connected to MQTT');
  client.subscribe('irrigation/moisture');
  client.subscribe('irrigation/valveStatus');
});

client.on('message', (topic, message) => {
  if (topic === 'irrigation/moisture') {
    document.getElementById('moisture').innerText = message.toString();
  }
  if (topic === 'irrigation/valveStatus') {
    document.getElementById('valve').innerText = message.toString();
  }
});

function toggleValve() {
  client.publish('irrigation/control', 'toggle');
}

// Open-Meteo Weather API
const latitude = -6.9559;
const longitude = 107.6499;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,rain,showers,cloud_cover&timezone=auto`)
  .then(res => res.json())
  .then(data => {
    const now = new Date();
    const hour = now.toISOString().slice(0, 13);
    const idx = data.hourly.time.findIndex(t => t.startsWith(hour));

    if (idx !== -1) {
      const temp = data.hourly.temperature_2m[idx];
      const rain = data.hourly.rain[idx];
      const showers = data.hourly.showers[idx];
      const cloud = data.hourly.cloud_cover[idx];
      const precip = data.hourly.precipitation[idx];
      const precipProb = data.hourly.precipitation_probability[idx];

      const weatherText = `
Temperature: ${temp}°C
Rain: ${rain} mm
Showers: ${showers} mm
Precipitation: ${precip} mm
Precipitation Probability: ${precipProb}%
Cloud Cover: ${cloud}%`;

      document.getElementById('weather').innerText = weatherText;
    } else {
      document.getElementById('weather').innerText = 'No weather data for this hour.';
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('weather').innerText = 'Failed to fetch weather.';
  });
