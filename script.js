const apiKeyRead = "PLPULOQL4CDBEO9R"; // Sustituye con tu clave API de lectura
const channelID = "2716817"; // Sustituye con tu ID de canal
const historicalChartCtx = document.getElementById("historicalChart").getContext("2d");

let historicalData = {
    labels: [],
    flowRates: [],
    totalLiters: []
};

const fetchCurrentData = async () => {
    try {
        const response = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKeyRead}&results=1`);
        const data = await response.json();

        if (data.feeds.length > 0) {
            const feed = data.feeds[0];
            document.getElementById("flowRate").innerText = `${feed.field1} L/min`;
            document.getElementById("totalLiters").innerText = `${feed.field2} L`;
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
};

const fetchHistoricalData = async () => {
    try {
        const response = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKeyRead}&results=50`);
        const data = await response.json();

        if (data.feeds.length > 0) {
            historicalData.labels = data.feeds.map(feed => feed.created_at);
            historicalData.flowRates = data.feeds.map(feed => parseFloat(feed.field1));
            historicalData.totalLiters = data.feeds.map(feed => parseFloat(feed.field2));
            updateChart();
        }
    } catch (error) {
        console.error("Error al obtener datos históricos:", error);
    }
};

const updateChart = () => {
    const historicalChart = new Chart(historicalChartCtx, {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [
                {
                    label: 'Flujo de Agua (L/min)',
                    data: historicalData.flowRates,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Volumen Total (L)',
                    data: historicalData.totalLiters,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    title: {
                        display: true,
                        text: 'Fecha y Hora'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Mediciones'
                    }
                }
            }
        }
    });
};

const init = () => {
    fetchCurrentData();
    fetchHistoricalData();
    setInterval(fetchCurrentData, 5000);
};

init();
