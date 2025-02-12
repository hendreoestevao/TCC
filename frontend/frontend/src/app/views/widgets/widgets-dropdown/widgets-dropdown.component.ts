import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { getStyle } from '@coreui/utils';
@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [ChartjsComponent ]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {


  data: any[] = [];
  options: any[] = [];
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April'
  ];
  datasets = [
    [/* ... datasets ... */]
  ];

  // Adicionando dados da API
  totalAlunos: number = 0;
  totalCursos: number = 0;
  totalDisciplinas: number = 0;
  totalTurmas: number = 0;
  totalProfessores: number = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient  // Adicionando o HttpClient
  ) {}

  ngOnInit(): void {
    this.getSummaryData();  // Chamando a função que irá consumir a API
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  // Função para consumir a API e atualizar os dados
  getSummaryData() {
    const token = localStorage.getItem('authToken');
        this.http.get('http://localhost:8080/api/dashboard/summary', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((response: any) => {
      this.totalAlunos = response.totalAlunos;
      this.totalCursos = response.totalCursos;
      this.totalDisciplinas = response.totalDisciplinas;
      this.totalTurmas = response.totalTurmas;
      this.totalProfessores = response.totalProfessores;

      // Atualizar outros dados conforme necessário
      this.setData();
    }, (error) => {
      console.error('Erro ao consumir a API', error);
    });
  }

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx]
      };
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
  optionsDefault(optionsDefault: any): string {
    throw new Error('Method not implemented.');
  }
}
