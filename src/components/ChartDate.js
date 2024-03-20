import React from "react";
import { Line } from "react-chartjs-2";

const Chart = ({ scooterCountByMonth }) => {

  // Calcular scooterCountByMonth a partir de dataframe2

  const chartData = {
    labels: Object.keys(scooterCountByMonth),
    datasets: [
      {
        label: "Scooters por Mês",
        data: Object.values(scooterCountByMonth),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ position: 'relative', width: '35vw', height: '35vh' }}>
      <h2>Gráfico de Scooters por Mês</h2>
      <Line data={chartData} options={{ /* Opções personalizadas do gráfico */ }} />
    </div>
  );
};

export default Chart;