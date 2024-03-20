import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const BarChart = ({ counter2M, counter2T, counter2N, counter2Ma}) => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);
    useEffect(() => {
      // Crie os dados do gráfico
      const data = {
        labels: ["Manhã", "Tarde", "Noite","Madrugada"],
        datasets: [
          {
            label: "Contagem de Scouters",
            data: [parseInt(counter2M), parseInt(counter2T), parseInt(counter2N), parseInt(counter2Ma)],
            fill: false, // Para gráfico de linhas
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(192, 75, 192, 1)",
              "rgba(75, 75, 192, 1)",
            ],
            borderWidth: 1,
          },
        ]
      };

      // Se o gráfico já existe, atualize os dados
      if (chartRef.current) {
        chartRef.current.data = data;
        chartRef.current.update();
      } else {
        // Caso contrário, crie um novo gráfico
        setChartData(data);
      }
    }, [counter2M, counter2T, counter2N, counter2Ma]);
    return (
        <div>
            {chartData && (
                <Bar data={chartData} options={{ /* Opções personalizadas do gráfico */ }} />
            )}
        </div>
    );
  };

export default BarChart;