import React, { useState, useEffect, useRef } from "react";
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ColumnCountPeriodo = ({ counters, monthNames}) => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);
    const month = monthNames
    useEffect(() => {
        // Crie os dados do gráfico
        const data = {
            labels: month, // Use o array de nomes de mês como rótulos
            datasets: [
              {
                label: "Manhã",
                data: counters.Manhã,
                fill: false, // Para gráfico de linhas
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Tarde",
                data: counters.Tarde,
                fill: false, // Para gráfico de linhas
                borderColor: "rgba(192, 75, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Noite",
                data: counters.Noite,
                fill: false, // Para gráfico de linhas
                borderColor: "rgba(75, 75, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Madrugada",
                data: counters.Madrugada,
                fill: false, // Para gráfico de linhas
                borderColor: "rgba(192, 192, 75, 1)",
                borderWidth: 1,
              },
            ],
          };
  
        // Se o gráfico já existe, atualize os dados
        if (chartRef.current) {
          chartRef.current.data = data;
          chartRef.current.update();
        } else {
          // Caso contrário, crie um novo gráfico
          setChartData(data);
        }
      }, [counters, month]);
    return (
        <div>
                 {chartData && <Line data={chartData} options={{ /* ref={chartRef} Opções personalizadas do gráfico */ }} />}
        </div>
    );
  };
  
  export default ColumnCountPeriodo;