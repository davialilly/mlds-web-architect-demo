/**
 * Loads the mock, aggregate-only dataset and renders:
 *  1. An accessible HTML data table (the primary, always-accessible source of truth)
 *  2. A simple inline SVG bar chart as a visual supplement, exposed to
 *     assistive technology as a single labeled group rather than decorative noise.
 *
 * No student-level or individually identifiable data is used anywhere in this file
 * or in data/enrollment-trends.json. See README.md, "FERPA alignment."
 */

async function loadDataset() {
  const response = await fetch("data/enrollment-trends.json");
  if (!response.ok) {
    throw new Error("Unable to load dataset: " + response.status);
  }
  return response.json();
}

function renderStats(years) {
  const latest = years[years.length - 1];
  const first = years[0];
  const delta = (latest.graduationRatePct - first.graduationRatePct).toFixed(1);

  document.getElementById("stat-enrollment").textContent =
    latest.totalEnrollment.toLocaleString("en-US");
  document.getElementById("stat-graduation").textContent =
    latest.graduationRatePct.toFixed(1) + "%";
  document.getElementById("stat-graduation-delta").textContent =
    (delta >= 0 ? "+" : "") + delta + " pts since " + first.year;
  document.getElementById("stat-districts").textContent =
    latest.districtsReporting;
}

function renderTable(years) {
  const tbody = document.querySelector("#trends-table tbody");
  tbody.innerHTML = "";
  years.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th scope="row">${row.year}</th>
      <td>${row.totalEnrollment.toLocaleString("en-US")}</td>
      <td>${row.graduationRatePct.toFixed(1)}%</td>
      <td>${row.chronicAbsenteeismPct.toFixed(1)}%</td>
      <td>${row.districtsReporting}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderChart(years) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("trends-chart");
  const width = 640;
  const height = 260;
  const padding = { top: 20, right: 10, bottom: 34, left: 10 };
  const barGap = 18;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = (chartWidth - barGap * (years.length - 1)) / years.length;

  const maxVal = Math.max(...years.map((y) => y.graduationRatePct));
  const minVal = Math.min(...years.map((y) => y.graduationRatePct)) - 5;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    "Bar chart of statewide graduation rate by school year, matching the table above."
  );

  years.forEach((row, i) => {
    const scaled = (row.graduationRatePct - minVal) / (maxVal - minVal);
    const barHeight = Math.max(4, scaled * chartHeight);
    const x = padding.left + i * (barWidth + barGap);
    const y = padding.top + (chartHeight - barHeight);

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("class", "chart-bar");
    rect.setAttribute("rx", "2");
    svg.appendChild(rect);

    const valueLabel = document.createElementNS(svgNS, "text");
    valueLabel.setAttribute("x", x + barWidth / 2);
    valueLabel.setAttribute("y", y - 6);
    valueLabel.setAttribute("text-anchor", "middle");
    valueLabel.setAttribute("class", "chart-value-label");
    valueLabel.textContent = row.graduationRatePct.toFixed(1) + "%";
    svg.appendChild(valueLabel);

    const axisLabel = document.createElementNS(svgNS, "text");
    axisLabel.setAttribute("x", x + barWidth / 2);
    axisLabel.setAttribute("y", height - 10);
    axisLabel.setAttribute("text-anchor", "middle");
    axisLabel.setAttribute("class", "chart-axis-label");
    axisLabel.textContent = row.year;
    svg.appendChild(axisLabel);
  });
}

async function init() {
  try {
    const data = await loadDataset();
    renderStats(data.years);
    renderTable(data.years);
    renderChart(data.years);
    document.getElementById("data-status").textContent = "";
  } catch (err) {
    document.getElementById("data-status").textContent =
      "The dataset could not be loaded. Please refresh the page or check your connection.";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);
