// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// // Outras importações...

// @Injectable({
//   providedIn: 'any'
// })
// export class DashboardChartsData {
//   constructor(private http: HttpClient) {
//     this.initMainChart();
//   }

//   public mainChart: IChartProps = { type: 'line' };

//   public random(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   }

//   initMainChart(period: string = 'Month') {
//     this.fetchChartData(period).subscribe((data: any) => {
//       this.updateMainChart(data, period);
//     });
//   }

//   private updateMainChart(apiData: any, period: string) {
//     const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
//     const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
//     const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
//     const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

//     // Atualize os dados usando os valores retornados pela API
//     const labels: string[] = apiData.labels || [];
//     const datasets: ChartDataset[] = [
//       {
//         data: apiData.data1 || [],
//         label: 'Current',
//         backgroundColor: brandInfoBg,
//         borderColor: brandInfo,
//         pointHoverBackgroundColor: brandInfo,
//         borderWidth: 2,
//         fill: true
//       },
//       {
//         data: apiData.data2 || [],
//         label: 'Previous',
//         backgroundColor: 'transparent',
//         borderColor: brandSuccess,
//         pointHoverBackgroundColor: '#fff'
//       },
//       {
//         data: apiData.data3 || [],
//         label: 'BEP',
//         backgroundColor: 'transparent',
//         borderColor: brandDanger,
//         pointHoverBackgroundColor: brandDanger,
//         borderWidth: 1,
//         borderDash: [8, 5]
//       }
//     ];

//     const options: ChartOptions = {
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           callbacks: {
//             labelColor: (context) => ({
//               backgroundColor: context.dataset.borderColor
//             } as TooltipLabelStyle)
//           }
//         }
//       },
//       scales: this.getScales(),
//       elements: {
//         line: { tension: 0.4 },
//         point: {
//           radius: 0,
//           hitRadius: 10,
//           hoverRadius: 4,
//           hoverBorderWidth: 3
//         }
//       }
//     };

//     this.mainChart.type = 'line';
//     this.mainChart.options = options;
//     this.mainChart.data = { datasets, labels };
//   }

//   private getScales() {
//     const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
//     const colorBody = getStyle('--cui-body-color');

//     return {
//       x: {
//         grid: { color: colorBorderTranslucent, drawOnChartArea: false },
//         ticks: { color: colorBody }
//       },
//       y: {
//         border: { color: colorBorderTranslucent },
//         grid: { color: colorBorderTranslucent },
//         max: 250,
//         beginAtZero: true,
//         ticks: {
//           color: colorBody,
//           maxTicksLimit: 5,
//           stepSize: Math.ceil(250 / 5)
//         }
//       }
//     };
//   }

//   private fetchChartData(period: string) {
//     const endpoint = `https://meu-backend.com/api/chart-data?period=${period}`;
//     return this.http.get(endpoint);
//   }
// }
