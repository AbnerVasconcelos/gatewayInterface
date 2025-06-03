export const temperaturas = [
    {
      "Zona": "Zona 1",
      "Temp. Real": 148,
      "SetPoint": 184
    },
    {
      "Zona": "Zona 2",
      "Temp. Real": 160,
      "SetPoint": 129
    },
    {
      "Zona": "Zona 3",
      "Temp. Real": 196,
      "SetPoint": 136
    },
    {
      "Zona": "Zona 4",
      "Temp. Real": 100,
      "SetPoint": 192
    },
    {
      "Zona": "Zona 5",
      "Temp. Real": 171,
      "SetPoint": 144
    },
    {
      "Zona": "Zona 6",
      "Temp. Real": 102,
      "SetPoint": 156
    },
    {
      "Zona": "Zona 7",
      "Temp. Real": 187,
      "SetPoint": 177
    }
    
  ];

export const   dataMotors = [
  { id: 1, motores: "Extrusora", type: "RPM", name: 90, speed: 90, corrente: 50 },
  { id: 2, motores: "Puxador 1", type: "m/min", name: 55, speed: 55, corrente: 60 },
  { id: 3, motores: "Puxador 2", type: "%", name: 10, speed: 10, corrente: 61 },
  { id: 4, motores: "Bobinador 1", type: "%", name: 10, speed: 10, corrente: 65 },
  { id: 5, motores: "Bobinador 2", type: "%", name: 10, speed: 10, corrente: 67 },
  { id: 6, motores: "Anel de Ar", type: "Hz", name: 10, speed: 10, corrente: 50 },
  { id: 7, motores: "Giratório", type: "on/off", name: "true", speed: "", corrente: "" },
];

export const teste = {
  monthlyData: generateMonthlyData(),
};

function generateMonthlyData() {
  const startDate = new Date(); // Start from the current date and time
  startDate.setSeconds(0); // Reset the seconds to 0 to start from the beginning of the minute

  const monthlyData = [];

  for (let i = 0; i < 50; i++) {
    const timeStamp = new Date(startDate.getTime() + i * 60000); // Add i minutes to the start date
    const pressure = getRandomValue(100, 130);
    const current = getRandomValue(100, 130);

    // Format the date as "hours:minutes"
    const hours = timeStamp.getHours();
    const minutes = timeStamp.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    monthlyData.push({
      timeStamp: formattedTime,
      pressure: pressure,
      current: current,
      _id: `637000f7a5a686695b5170b${i + 1}`,
    });
  }

  return monthlyData;
}


function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
