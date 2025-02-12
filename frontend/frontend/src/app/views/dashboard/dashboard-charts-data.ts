import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor(private http: HttpClient) {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };
  public data: any = {};

  initMainChart(period: string = 'Month') {
    this.fetchDashboardData().subscribe((data: any) => {
      this.data = data; // Armazene os dados da resposta
      this.updateMainChart(data, period);
    });
  }

  public updateMainChart(apiData: any, period: string) {
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);

    const labels: string[] = [
      'Total Alunos', 'Total Cursos', 'Total Disciplinas', 'Total Turmas', 'Total Professores'
    ];

    const datasets: ChartDataset[] = [
      {
        data: [
          apiData.totalAlunos,
          apiData.totalCursos,
          apiData.totalDisciplinas,
          apiData.totalTurmas,
          apiData.totalProfessores
        ],
        label: 'Quantidades',
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      }
    ];

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            labelColor: (context) => ({
              backgroundColor: context.dataset.borderColor
            } as TooltipLabelStyle)
          }
        }
      },
      scales: this.getScales(),
      elements: {
        line: { tension: 0.4 },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'bar';
    this.mainChart.options = options;
    this.mainChart.data = { datasets, labels };
  }


  public fetchDashboardData() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('http://localhost:8080/api/dashboard/summary', { headers });
  }

  public getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    return {
      x: {
        grid: { color: colorBorderTranslucent, drawOnChartArea: false },
        ticks: { color: colorBody }
      },
      y: {
        border: { color: colorBorderTranslucent },
        grid: { color: colorBorderTranslucent },
        max: 10,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: 1
        }
      }
    };
  }
}
