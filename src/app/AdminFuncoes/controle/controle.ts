import { Component, OnInit, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // isPlatformBrowser ainda pode ser útil
import { RouterModule } from '@angular/router';

// --- Interfaces de Dados ---
// (Estas permanecem as mesmas)
export type UserStatus = 'online' | 'busy' | 'offline';
export interface ICollaborator { id: string; name: string; role: string; progress: number; avatarUrl: string; }
export interface ITeamMember { id: string; name: string; status: UserStatus; }
export interface ITeamGroup { title: string; members: ITeamMember[]; }
export interface IProject { id: string; title: string; statusText: 'Finalizado' | 'Em Andamento'; rating: number; collaboratorName: string; collaboratorRole: string; collaboratorAvatarUrl: string; }
// --- Fim das Interfaces ---


@Component({
  selector: 'app-controle',
  templateUrl: './controle.html',
  styleUrls: ['./controle.css'], // ✨ ADICIONADO: Importa CSS do dashboard
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Mantém RouterModule se houver links
  ]
})
export class ControleComponent implements OnInit {

  // --- Lógica de Tema e Navbar (do dashboard-usuario) ---
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Rafael'; // Placeholder, ajuste se necessário
  userRole = 'Gestor TI'; // Placeholder, ajuste se necessário

  toggleTheme(): void { this.isDarkMode = !this.isDarkMode; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  // --- Fim da Lógica Navbar ---

  // --- Estado do Dashboard ---
  geralProgress = 70; // Renomeado de overallScore para manter consistência
  activeCollaborator: ICollaborator | null = null;
  
  // Dados atuais para o gráfico de frequência SVG
  currentFrequencyData: { date: string, value: number }[] = []; 
  // Mapeamento dos valores numéricos para o path do SVG
  frequencyChartPathData: number[] = []; 

  // --- Dados Mocados ---
  allCollaborators: ICollaborator[] = [];
  teamSidebar: ITeamGroup[] = [];
  projectsFinished: IProject[] = [];
  projectsInProgress: IProject[] = [];

  // --- Dicionário de Dados do Gráfico (Apenas valores numéricos) ---
  private chartDataStore: { [key: string]: number[] } = {};
  private baseChartData: number[] = [12, 19, 15, 25, 22, 30, 28]; // Ajustado para 7 pontos como no SVG original
  // private chartLabels: string[] = ['1', '5', '10', '15', '20', '25', '30']; // Labels para referência, não usados no path

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {} // Mantém caso precise para algo no futuro

  ngOnInit(): void {
    this.initializeData();
    // Define os dados iniciais do gráfico
    this.updateFrequencyChartData(null); 
  }

  /**
   * Popula todos os arrays de dados mocados
   */
  private initializeData(): void {
    this.allCollaborators = [
      { id: 'c1', name: 'Kauan', role: 'Python', progress: 30, avatarUrl: 'assets/avatars/kauan.png' },
      { id: 'c2', name: 'Larissa', role: 'Python', progress: 80, avatarUrl: 'assets/avatars/larissa.png' },
      { id: 'c3', name: 'Rafael', role: 'Excel', progress: 100, avatarUrl: 'assets/avatars/rafael.png' },
      { id: 'c4', name: 'Gabriel', role: 'Office 365', progress: 100, avatarUrl: 'assets/avatars/gabriel.png' }
    ];
    this.teamSidebar = [
      { title: 'Analistas', members: [ { id: 't1', name: 'Kauan', status: 'online' }, { id: 't2', name: 'Rafael', status: 'online' }, { id: 't3', name: 'Gabriel', status: 'busy' } ] },
      { title: 'Desenvolvedores', members: [ { id: 't4', name: 'Larissa', status: 'offline' }, { id: 't5', name: 'Lucas', status: 'offline' }, { id: 't6', name: 'Davi', status: 'busy' } ] }
    ];
    this.projectsFinished = [
      { id: 'p1', title: 'Java', statusText: 'Finalizado', rating: 4, collaboratorName: 'Kauan Davi', collaboratorRole: 'Senior', collaboratorAvatarUrl: 'assets/avatars/kauan.png' },
      { id: 'p2', title: 'CSS', statusText: 'Finalizado', rating: 5, collaboratorName: 'Larissa', collaboratorRole: 'Frontend', collaboratorAvatarUrl: 'assets/avatars/larissa.png' },
      { id: 'p3', title: 'Excel', statusText: 'Finalizado', rating: 5, collaboratorName: 'Rafael', collaboratorRole: 'BI', collaboratorAvatarUrl: 'assets/avatars/rafael.png' }
    ];
    this.projectsInProgress = [
      { id: 'p4', title: 'Office 365', statusText: 'Em Andamento', rating: 3, collaboratorName: 'Lucas', collaboratorRole: 'Suporte', collaboratorAvatarUrl: 'assets/avatars/lucas.png' },
      { id: 'p5', title: 'Figma', statusText: 'Em Andamento', rating: 4, collaboratorName: 'Gabriel', collaboratorRole: 'Design', collaboratorAvatarUrl: 'assets/avatars/gabriel.png' },
      { id: 'p6', title: 'Acess', statusText: 'Em Andamento', rating: 0, collaboratorName: 'Davi', collaboratorRole: 'DBA', collaboratorAvatarUrl: 'assets/avatars/davi.png' }
    ];

    // Dados numéricos para cada colaborador (7 pontos)
    this.chartDataStore = {
      'base': this.baseChartData,
      'c1': [5, 8, 10, 12, 9, 11, 14], // Kauan
      'c2': [20, 22, 25, 23, 26, 28, 30], // Larissa
      'c3': [30, 32, 30, 33, 35, 34, 40], // Rafael
      'c4': [10, 10, 12, 11, 14, 13, 15]  // Gabriel
    };
  }
  
  /**
   * Seleciona um colaborador e atualiza o gráfico SVG
   */
  selectCollaborator(id: string): void {
    const selected = this.allCollaborators.find(c => c.id === id);
    if (selected && this.activeCollaborator?.id !== id) {
      this.activeCollaborator = selected;
      this.updateFrequencyChartData(selected);
    }
  }

  /**
   * Reseta o gráfico SVG para a visão geral
   */
  selectGeneralView(): void {
    this.activeCollaborator = null;
    this.updateFrequencyChartData(null);
  }

  /**
   * ✨ ATUALIZADO: Atualiza os dados numéricos para o gráfico SVG
   */
  private updateFrequencyChartData(collab: ICollaborator | null): void {
    if (collab) {
      this.frequencyChartPathData = this.chartDataStore[collab.id];
    } else {
      this.frequencyChartPathData = this.chartDataStore['base'];
    }
    // O path será recalculado automaticamente pelo getter getAreaChartPath() no template
  }

  /**
   * ✨ ADICIONADO: Calcula o path 'd' para o gráfico de área SVG
   * (Adaptado do dashboard-usuario.ts)
   */
  getAreaChartPath(): string {
    const points = this.frequencyChartPathData; // Usa os dados numéricos atuais
    const width = 100; // Largura do viewBox
    const height = 60; // Altura do viewBox
    
    if (!points || points.length === 0) return 'M 0,60 L 100,60 Z'; // Linha base se não houver dados
    
    // Encontra o valor máximo para normalizar a altura (evita gráfico "colado" no topo)
    // Adiciona um pequeno buffer (ex: 1.1) para não tocar o topo
    const maxValue = Math.max(...points) * 1.1 || height; 
    const xStep = width / (points.length > 1 ? points.length - 1 : 1);
    
    // Normaliza os valores para a altura do viewBox (invertido, 0 é topo)
    const normalizedPoints = points.map((value, index) => ({
      x: index * xStep,
      y: height - (value / maxValue) * height // Inverte Y
    }));

    // Começa no canto inferior esquerdo
    let path = `M 0,${height}`; 
    // Linha para o primeiro ponto de dado
    path += ` L ${normalizedPoints[0].x},${normalizedPoints[0].y}`; 
    
    // Linhas para os pontos seguintes
    for (let i = 1; i < normalizedPoints.length; i++) {
      path += ` L ${normalizedPoints[i].x},${normalizedPoints[i].y}`;
    }
    
    // Linha para o canto inferior direito e fecha o path na base
    path += ` L ${width},${height} Z`; 
    
    return path;
  }

  /**
   * ✨ ADICIONADO: Calcula o path 'd' para a linha do gráfico SVG
   * (Assumindo os mesmos 7 pontos fixos do exemplo)
   */
  getLineChartPath(): string {
    const points = this.frequencyChartPathData;
    const width = 100;
    const height = 60;

    if (!points || points.length === 0) return ''; 

    const maxValue = Math.max(...points) * 1.1 || height;
    const xStep = width / (points.length > 1 ? points.length - 1 : 1);

    const normalizedPoints = points.map((value, index) => ({
      x: index * xStep,
      y: height - (value / maxValue) * height
    }));

    let path = `M ${normalizedPoints[0].x},${normalizedPoints[0].y}`;
    for (let i = 1; i < normalizedPoints.length; i++) {
      path += ` L ${normalizedPoints[i].x},${normalizedPoints[i].y}`;
    }
    return path;
  }
}