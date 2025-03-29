import React, { useEffect, useRef } from "react";
import { useVIFormContext } from "../../context/VIformcontext";
import { useEIFormContext } from "../../context/Eicontext";
import { useHIContext } from "../../context/hicontext";
import { useTranslation } from "react-i18next";
import { Chart } from "chart.js/auto";

const ChartComponent = () => {
  const { EIfinal } = useEIFormContext();
  const { utciArray = [] } = useHIContext();
  const { VIfinal } = useVIFormContext();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!chartRef.current) {
      console.warn("❌ Chart canvas not available.");
      return;
    }

    initializeChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      updateChart();
    }
  }, [EIfinal, VIfinal, utciArray]);

  const initializeChart = () => {
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: t("hourly_risk_index") || "Hourly Risk Index",
            data: new Array(24).fill(5), // Default values before first update
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    console.log("✅ Chart initialized");
  };

  const updateChart = () => {
    if (!chartInstance.current) return;

    const EI = parseFloat(EIfinal) || 1;
    const VI = parseFloat(VIfinal) || 1;

    const calculatedData = utciArray.length === 24
      ? utciArray.map(item => (typeof item === "number" ? item : item?.value ?? 0) * EI * VI)
      : new Array(24).fill(5);

    chartInstance.current.data.datasets[0].data = calculatedData;
    chartInstance.current.update();
    
    console.log("✅ Chart updated with calculated data:", calculatedData);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <canvas id="myChart" ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;



