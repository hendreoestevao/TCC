import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule,WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);



  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });
  userType: any;
  isAdmin: boolean = false;
  professorData: any;
  private apiUrl: string= 'http://localhost:8080/api/professores/p/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();

    // Corrigir a maneira como você obtém userType do localStorage
    this.userType = localStorage.getItem('userType');
    this.isAdmin = this.userType === 'admin';  // Atualiza isAdmin para true se userType for 'admin'

    if (this.isAdmin) {
      // Se for admin, não consome a API
      return;
    }

    // Se não for admin, consome a API para obter os dados do professor
    const professorId: string | null = localStorage.getItem('professorId'); // exemplo de professorId
    if (professorId) {
      this.getProfessor(Number(professorId));
    }
  }

  getProfessor(professorId: number): void {
    this.http.get(`${this.apiUrl}${professorId}`).subscribe({
      next: (data: any) => {
        this.professorData = data; // Atribuindo os dados da resposta à variável

        // Verifica se há turmas e salva o ID da primeira no localStorage
        if (this.professorData.turmas && this.professorData.turmas.length > 0) {
          const turmaId = this.professorData.turmas[0]; // Pega o primeiro ID de turma
          localStorage.setItem('turmaId', turmaId.toString());
        } else {
        }

        // Verifica se há disciplinas e salva os IDs e nomes no localStorage
        if (this.professorData.disciplinas && this.professorData.disciplinaNomes) {
          const disciplinas = this.professorData.disciplinas.map((id: number, index: number) => ({
            id,
            nome: this.professorData.disciplinaNomes[index],
          }));
          localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
        } else {
        }
      },
      error: (error) => {
        // Adicionar tratamento de erro, se necessário
      }
    });
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

}
