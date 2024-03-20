import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GoogleLayer } from "react-leaflet";
import { Table } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import "./App.css";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import BarChart from "./components/BarChart";
import Chart from "./components/ChartDate";
import ColumnCountPeriodo from "./components/ColumnCountPeriodo";
import { Scatter } from 'react-chartjs-2';
import * as d3 from 'd3';


const BackendDataDisplay = () => {

    
    const [backendData, setBackendData] = useState({});
    useEffect(() => {
        // Função para buscar os dados do backend
        const fetchData = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/api");
            const data = await response.json();
            setBackendData(data);
          } catch (error) {
            console.error("Erro ao buscar os dados do backend:", error);
          }
        };
    
        fetchData();
      }, []);
    
    const [vehicleData, setVehicleData] = useState({});
    useEffect (() => {
      //Função para buscar os dados do backend
      const fetchData = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/vehicle");
            const data = await response.json();
            setVehicleData(data);
          } catch (error) {
            console.error("Erro ao buscar os dados", error);
          }
      };
      fetchData();
    }, []);
    
    const [weatherData, setWeatherData] = useState([]);
    const [weatherData2, setWeatherData2] = useState([]);
    useEffect(() => {
     //Fazer chamada à API e atualizar o estado
    const fetchWeatherData = async () => {
       try {
          const response = await fetch('http://127.0.0.1:5000/clima');
          const data = await response.json();
          setWeatherData(data.response.forecast.forecastday);
        }catch(error) {
          console.error('Erro ao buscar os dados', error);
        }
      };
    const fetchWeather2Data = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/clima2');
        const data = await response.json();
        setWeatherData2(data.response.forecast.forecastday);
      }catch(error) {
        console.error('Erro ao buscar dados');
      }
    };

    fetchWeatherData();    
    fetchWeather2Data();    
    }, []);
    
    const [dataFrameEx, setDataFrameEx] = useState([]);
    useEffect(() => {
      if (weatherData.length > 0 /*&& weatherData2.length > 0*/) {

        const formattedDataFrame2 = weatherData2.map(entry => {
          return {
            Date: entry.date,
            DateEpoch: entry.date_epoch,
            AvgTemperatureC: entry.day.avgtemp_c,
            AvgTemperatureF: entry.day.avgtemp_f,
            MaxTemperatureC: entry.day.maxtemp_c,
            MaxTemperatureF: entry.day.maxtemp_f
          }
        })
        const formattedDataFrame = weatherData.map(entry => {
          return {
            Date: entry.date,
            DateEpoch: entry.date_epoch,
            AvgTemperatureC: entry.day.avgtemp_c,
            AvgTemperatureF: entry.day.avgtemp_f,
            MaxTemperatureC: entry.day.maxtemp_c,
            MaxTemperatureF: entry.day.maxtemp_f
            // ... Add more fields as needed
            //AvgTemperatureC: weatherData2Entry.day.avgtemp_c,
            //AvgTemperatureF: weatherData2Entry.day.avgtemp_f,
          };
        });
        const combinedDataFrames = [...formattedDataFrame, ...formattedDataFrame2];
        setDataFrameEx(combinedDataFrames);       
      }
    }, [weatherData, weatherData2]);
    
    const columns = ['Vehicle Type','Event Time','Hora do dia','Event Types','Trip_ID','Device ID','Vehicle Id',
                    'Propulsion Type','Coordinates','Date','NumeroScooterNoDia','AvgTemperatureC',
                    'AvgTemperatureF','MaxTemperatureC','MaxTemperatureF'];
    const columns2 = ['Vehicle Type','Event Time','Hora do dia','Event Types','Vehicle_ID','Device ID',' Provider Id',
                      'Coordinates','Coordinates2','Date','NumeroScooterNoDia','AvgTemperatureC',
                      'AvgTemperatureF','MaxTemperatureC','MaxTemperatureF'];
    
    const Header = ({columns}) => {
       return(
        <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="users-table-cell">{column}</th>
              ))}
            </tr>
          </thead>
       );
    };
    
    const Header2 = ({columns2}) => {
      return(
       <thead>
           <tr>
             {columns2.map((column) => (
               <th key={column} className="users-table-cell">{column}</th>
             ))}
           </tr>
         </thead>
      );
   };
   

    // Convert the JSON string to a JavaScript object
    const dataFrame = JSON.parse(backendData.Dataframe || "[]");
    //const uniqueDates = [...new Set(dataFrame.map((item) => item.Date))]; // Obter datas únicas
    //Convert the JSON string to dataframe2 JavaScript object
    const dataframe2 = JSON.parse(vehicleData.Dataframe || "[]");
    const correlation_matrix = JSON.parse(vehicleData.data || "[]");
    dataframe2.sort((a,b) => a.last_event_time - b.last_event_time);
    const tripCount = dataFrame.filter((item) => item["event_types"].includes("trip_start")).length;
    console.log("tripCount:", tripCount);
    console.log('Dataframe', vehicleData.MatrizColunas)
    
    let counter = 0;
    let counter2 = 0;
    let currentDate = "";
    const finalValuesByDate = {};
    const finalValuesByDate2 = {};
    const scooterCountByMonth = {};

    let counter2M = 0;
    let counter2T = 0;
    let counter2N = 0;
    let counter2Ma = 0;
    let contarMad = 0 ;
    let contarMan = 0;
    let contarTa = 0;
    let contarNoi = 0;

    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const years = ["2022","2023"]
    const counters = {
      Madrugada: Array(monthNames.length).fill(0),
      Manhã: Array(monthNames.length).fill(0),
      Tarde: Array(monthNames.length).fill(0),
      Noite: Array(monthNames.length).fill(0),
    };



    function CorrelationMatrix({ data, columns }) {
      useEffect(() => {
        if (data && columns) {
          // Crie a estrutura HTML da tabela
          const table = document.createElement('table');
          table.className = 'correlation-matrix';
    
          // Crie a linha de cabeçalho (rótulos das colunas)
          const headerRow = document.createElement('tr');
          headerRow.appendChild(document.createElement('th')); // Espaço vazio no canto superior esquerdo

          columns.forEach((column) => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
          });
          table.appendChild(headerRow);
    
          // Preencha a tabela com os valores de correlação
          data.forEach((row, rowIndex) => {
            const dataRow = document.createElement('tr');
            const rowHeader = document.createElement('th');
            rowHeader.textContent = columns[rowIndex];
            dataRow.appendChild(rowHeader);
            row.forEach((value, columnIndex) => {
              const td = document.createElement('td');
              td.textContent = value.toFixed(2); // Formate o valor da correlação
              dataRow.appendChild(td);
            });
            table.appendChild(dataRow);
          });
    
          // Limpe o contêiner do React e anexe a tabela HTML
          const container = document.getElementById('correlation-matrix');
          container.innerHTML = '';
          container.appendChild(table);
        }
      }, [data, columns]);
    
      return <div id="correlation-matrix"></div>;
    }



    return (
      <div>
        {backendData.ApiBolt}
        <Table>
          <Header columns={columns}/>
          <tbody>
                {dataFrame.map((item, index) => {
                    const key = `${item.vehicle_type}|${item.provider_id}|${item.provider_name}`;
                    const coords = backendData.Coordinates[key] || [];
                    const eventType = item["Event Types"];
                    // Convert Unix timestamp to a readable date format
                    const eventTime = new Date(item.event_time);
                    const formattedDate = eventTime.toLocaleString();
                    let eventTimePeriod = "";
                    const hour = eventTime.getHours();
                    if (hour >= 7 && hour < 12) {
                      eventTimePeriod = "Manhã";
                    } else if (hour >= 12 && hour < 20) {
                      eventTimePeriod = "Tarde";
                    } else if (hour >= 20 && hour < 24){
                      eventTimePeriod = "Noite";
                    }else {
                      eventTimePeriod = "Madrugada";
                    }
                    const eventDate = eventTime.toISOString().split('T')[0]; 
                    // Find the corresponding weather data for this date
                    const matchingWeatherData = dataFrameEx.find(
                      weather => weather.Date === eventDate
                    );

                    
                    // Increment the counter only if the eventType is "trip_st
                    if (eventDate !== currentDate ) {
                      counter = 1;
                      finalValuesByDate[eventDate] = 0
                      currentDate = eventDate;
                    } else if(item["event_types"].includes("trip_start")) {
                      counter++;
                    }
                    finalValuesByDate[currentDate] = counter;
                    
                    return (
                      <tr key={index}>
                        <td>{item.vehicle_type}</td>
                        <td>{formattedDate}</td>
                        <td>{eventTimePeriod.toLocaleString()}</td>
                        <td>{item.event_types}</td>
                        <td>{item.trip_id}</td>
                        <td>{item.device_id}</td>
                        <td>{item.vehicle_id}</td>
                        <td>{item.propulsion_types}</td>   
                        <td>{`${coords[index]}`}</td>
                        <td>{eventDate}</td>
                        <td>{counter}</td>
                        <td>{matchingWeatherData?.AvgTemperatureC}</td>
                        <td>{matchingWeatherData?.AvgTemperatureF}</td>
                        <td>{matchingWeatherData?.MaxTemperatureC}</td>
                        <td>{matchingWeatherData?.MaxTemperatureF}</td>   
                      </tr>                 
                    );
                })}
          </tbody> 
          <tfoot>
            {Object.keys(finalValuesByDate).map((date) => (
              <tr key={date}>
                <td colSpan="10">Total para {date}:</td>
                <td>{finalValuesByDate[date]}</td>
              </tr>
            ))}          
          </tfoot>
        </Table>
        {backendData.Coordinates && (
          <div style={{ width:"50%", height: "320px",  margin: "0 auto" }}>
            <MapContainer center={[41.44088, -8.303444]} zoom={13}  style={{ width: "100%", height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

                {Object.entries(backendData.Coordinates).map(([key, coords], index) => {
                const [vehicleType, providerId] = key.split("|");
                const iconSize = [32, 32];
                const customIconUrl = "path/to/custom-icon.png"; // Substitua pelo caminho do ícone desejado
                const customIcon = new L.Icon({
                  iconUrl: customIconUrl,
                  iconSize,
                });


                return coords.map((coord, i) => (
                  <Marker key={i} position={[coord[1], coord[0]]} // latitude, longitude 
                  icon={customIcon}
                  >
                    <Popup>
                      Vehicle Type: {vehicleType}
                      <br />
                      Provider ID: {providerId}
                      <br />
                      Latitude: {coord[1]}, Longitude: {coord[0]}
                      <br />
                      Battery: {coord[2]}
                    </Popup>
                  </Marker>
                ));
              })}

            </MapContainer>
          </div>
        )}
        <hr></hr>
        <p>Vehicles: </p>
        <Table>
          <Header2 columns2={columns2}/>
          <tbody>
          {dataframe2.map((item, index) => {
                  
                  const key = `${item.vehicle_type}|${item.provider_id}|${item.provider_name}`;
                  //|${item.provider_id}|${item.provider_name}
                  const coords = vehicleData.Coordinates[key] || [];
                  //const coords2 = vehicleData.Current_Coordinates && vehicleData.Current_Coordinates[key] ? vehicleData.Current_Coordinates[key] : [];
                  const coordsString = coords[index] ? coords[index].join(", ") : "Coordinates N/A"; // Convert coords array to string
                  //const coordsString2 = coords2[index] ? coords2[index].join(", ") : "Coordinates N/A";

                  // Convert Unix timestamp to a readable date format
                  const eventTime = new Date(item.last_event_time);
                  const formattedDate = eventTime.toLocaleString();
                  let eventTimePeriod = "";

                  const hour = eventTime.getHours();
                  const monthIndex = eventTime.getMonth()
                  if (hour >= 7 && hour < 12) {
                    eventTimePeriod = "Manhã";
                    counters[eventTimePeriod][monthIndex]++
                    counter2M++;
                  } else if (hour >= 12 && hour < 20) {
                    eventTimePeriod = "Tarde";
                    counters[eventTimePeriod][monthIndex]++
                    counter2T++;
                  } else if (hour >= 20 && hour < 24){
                    eventTimePeriod = "Noite";
                    counters[eventTimePeriod][monthIndex]++
                    counter2N++;
                  }else {
                    eventTimePeriod = "Madrugada";
                    counters[eventTimePeriod][monthIndex]++
                    counter2Ma++;
                  }

                  if (hour >= 7 && hour < 12) {
                    eventTimePeriod = "Manhã";
                    contarMan ++;
                  } else if (hour >= 12 && hour <20) {
                    eventTimePeriod = "Tarde";
                    contarTa ++;
                  } else if (hour >=20 && hour < 24) {
                    eventTimePeriod = "Noite";
                    contarNoi ++;
                  } else {
                    contarMad ++;
                  }


                  const eventDate = eventTime.toISOString().split('T')[0];            
                  const matchingWeatherData = dataFrameEx.find(
                    weather => weather.Date === eventDate
                  );

                  // Increment the counter only if the eventType is "trip_st
                  if (eventDate !== currentDate ) {
                    counter = 1;
                    finalValuesByDate2[eventDate] = 0
                    currentDate = eventDate;
                  } else {
                    counter++;
                  }
                  finalValuesByDate2[currentDate] = counter;

                  const [year, month] = eventDate.split("-");
                  const monthKey = `${year}-${month}`;

                  if (!scooterCountByMonth[monthKey]) {
                    counter2=0;
                    scooterCountByMonth[monthKey] =0;
                  } 
                  scooterCountByMonth[monthKey]++


                  return (
                    <>
                    <tr key={index}> 
                      <td>{item.vehicle_type}</td>
                      <td>{formattedDate}</td>
                      <td>{eventTimePeriod}</td>
                      <td>{item.last_event_types}</td>
                      <td>{item.vehicle_id}</td>
                      <td>{item.device_id}</td> 
                      <td>{item.provider_id}</td>                  
                      <td>{coordsString}</td>
                      <td>{eventDate}</td>
                      <td>{counter}</td>
                      <td>{scooterCountByMonth[month]}</td>
                      <td>{matchingWeatherData?.AvgTemperatureC}</td>
                      <td>{matchingWeatherData?.AvgTemperatureF}</td>
                      <td>{matchingWeatherData?.MaxTemperatureC}</td>
                      <td>{matchingWeatherData?.MaxTemperatureF}</td>
                    </tr>             
                  </>
                  )
              })}
          </tbody>
          <tfoot>
            <tr>
              <td>Manhã:</td> 
              <td>{contarMan}</td>
              <td>Tarde:</td>
              <td>{contarTa}</td>
              <td>Noite:</td>
              <td>{contarNoi}</td>
              <td>Madrugada:</td>
              <td>{contarMad}</td>
              
            </tr>
          </tfoot>
        </Table> 
        <div style={{ position: 'relative', width: '35vw', height: '40vh' }}>
          {<BarChart counter2M={counter2M} counter2T={counter2T} counter2N={counter2N} counter2Ma={counter2Ma}/>}
        </div>
        <div style={{ position: 'relative', width: '35vw', height: '40vh' }}>
          {<Chart scooterCountByMonth={scooterCountByMonth}/>}
        </div>
        <div style={{ position: 'relative', width: '35vw', height: '40vh' }}>
          {<ColumnCountPeriodo counters={counters} monthNames={monthNames}/>}
        </div>
        <div>
          {vehicleData.MatrizCorrelacao && (
           <div>
          {<CorrelationMatrix data={vehicleData.MatrizCorrelacao.data} columns={vehicleData.MatrizCorrelacao.columns}/>}
          </div>
          )}
        </div> 
        <hr></hr>    
        <hr></hr>
        {vehicleData.Coordinates && (
          <div style={{ width:"30%", height: "320px",  margin: "0 auto" }}>
            <MapContainer center={[41.44088, -8.303444]} zoom={13}  style={{ width: "100%", height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

                {Object.entries(vehicleData.Coordinates).map(([key, coords], index) => {
                const [vehicleType, providerId] = key.split("|");
                const iconSize = [32, 32];
                const customIconUrl = "path/to/custom-icon.png"; // Substitua pelo caminho do ícone desejado
                const customIcon = new L.Icon({
                  iconUrl: customIconUrl,
                  iconSize,
                });


                return coords.map((coord, i) => (
                  <Marker key={i} position={[coord[1], coord[0]]} // latitude, longitude 
                  icon={customIcon}
                  >
                    <Popup>
                      Vehicle Type: {vehicleType}
                      <br />
                      Provider ID: {providerId}
                      <br />
                      Latitude: {coord[1]}, Longitude: {coord[0]}
                      <br />
                      Battery: {coord[2]}
                    </Popup>
                  </Marker>
                ));
              })}

            </MapContainer>
          </div>
        )}
        <p>APIBolt_Temperatura</p>
        <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Temperature ºC</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((dayData, dayIndex) => (
            dayData.hour.map((hourData, hourIndex) =>(
            <tr key={`${dayIndex}-${hourIndex}`}>
              <td>{dayData.date}</td>
              <td>{hourData.time}</td>
              <td>{hourData.temp_c}</td>
            </tr>
            ))
          ))}
        </tbody>
        </Table>
        <p>Vehicles_Temperature</p>
        <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Date Epoch</th>
            <th>Avg Temp (C)</th>
            <th>Avg Temp (F)</th>
            <th>Max Temp (C)</th>
            <th>Max Temp (F)</th>
            {/* Add more table headers for other fields */}
          </tr>
        </thead>
        <tbody>
          {dataFrameEx.map((entry, index) => {
            // Find the corresponding entry in the first table dataFrame
            //const correspondingEntry = dataFrame.find(item => item.Date === entry.Date);
            return(  
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.DateEpoch}</td>
                <td>{entry.AvgTemperatureC}</td> 
                <td>{entry.AvgTemperatureF}</td>
                <td>{entry.MaxTemperatureC}</td>
                <td>{entry.MaxTemperatureF}</td>
                {/* Render other fields as well */}
              </tr>
              );
         })}
        </tbody>
        </Table>
      </div>
    );
  
    };
    
    export default BackendDataDisplay;