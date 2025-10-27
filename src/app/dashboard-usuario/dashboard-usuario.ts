import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 1. IMPORTE O ROUTER MODULE

// ============= INTERFACES =============
export interface ICourse {
  id: string;
  title: string;
  level: string;
  description: string;
  icon: string;
}

export interface IRoadMapItem {
  name: string;
  progress: number;
  color: string;
}

export interface IChartDataPoint {
  date: string;
  value: number;
}

export interface INavigationCard {
  title: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-usuario',
  templateUrl: './dashboard-usuario.html',
  styleUrls: ['./dashboard-usuario.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // 2. ADICIONE O ROUTER MODULE AOS IMPORTS
  ]
})
export class DashboardUsuarioComponent implements OnInit {
activePlacementQuiz: any;

  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  // ============= USER DATA =============
  userName = 'Kauan Davi';
  userRole = 'Analista de TI';
  
  // ============= OVERALL SCORE =============
  overallScore = 65;
  
  // ============= ROAD MAPS DATA =============
  roadMaps: IRoadMapItem[] = [
    { name: 'JAVA', progress: 25, color: '#2DF8E0' },
    { name: 'PYTHON', progress: 45, color: '#4E3DE0' },
    { name: 'EXCEL', progress: 100, color: '#2DF8E0' },
    { name: 'OFFICE 365', progress: 80, color: '#4E3DE0' }
  ];
  
  // ============= TASK FREQUENCY DATA =============
  taskFrequencyData: IChartDataPoint[] = [
    { date: '1', value: 12 },
    { date: '5', value: 19 },
    { date: '10', value: 15 },
    { date: '15', value: 25 },
    { date: '20', value: 22 },
    { date: '25', value: 30 },
    { date: '30', value: 28 }
  ];
  
  // ============= NAVIGATION CARDS =============
  navigationCards: INavigationCard[] = [
    { 
      title: 'Road Maps', 
      icon: '🗺️', 
      route: '/roadmaps', // Esta é a rota que você quer
      color: '#2DF8E0'
    },
    { 
      title: 'Meus Cursos', 
      icon: '📚', 
      route: '/meus',
      color: '#4E3DE0'
    },
    { 
      title: 'Quizzes', 
      icon: '📗', 
      route: '/quizzes',
      color: '#2DF8E0'
    },
    { 
      title: 'Rank', 
      icon: '⭐', 
      route: '/rank',
      color: '#7ad5ff'
    }
  ];
  
  // ============= COURSES DATA =============
  courses: ICourse[] = [
    {
      id: '1',
      title: 'Python - Intermediário',
      level: 'Intermediário',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    },
    {
      id: '2',
      title: 'Excel - Básico',
      level: 'Básico',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    },
    {
      id: '3',
      title: 'Office 365 - Avançado',
      level: 'Avançado',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    },
    {
      id: '4',
      title: 'Css - Avançado',
      level: 'Avançado',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    },
    {
      id: '5',
      title: 'Inglês - Básico',
      level: 'Básico',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    },
    {
      id: '6',
      title: 'Java - Básico',
      level: 'Básico',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.',
      icon: 'ℹ️'
    }
  ];

  // ============= UI STATE =============
  isDarkMode = true;
  mobileMenuOpen = false;

  ngOnInit(): void {
    // Inicialização de animações ou fetch de dados
    this.animateProgressBars();
  }

  // ============= METHODS =============
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // A função navigateTo não é mais necessária para os links,
  // mas pode ser mantida para outras ações se precisar.
  navigateTo(route: string): void {
    console.log('Navigating to:', route);
    // O Router agora cuida disso
  }

  onCourseClick(course: ICourse): void {
    console.log('Course clicked:', course);
    // Implementar navegação para detalhes do curso
  }

  private animateProgressBars(): void {
    // Animação será feita via CSS e Angular animations
  }

  // Helper para gerar path do gráfico de área
  getAreaChartPath(): string {
    const width = 100;
    const height = 100;
    const points = this.taskFrequencyData;
    
    if (points.length === 0) return '';
    
    const maxValue = Math.max(...points.map(p => p.value));
    const xStep = width / (points.length - 1);
    
    let path = `M 0,${height - (points[0].value / maxValue) * height}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = i * xStep;
      const y = height - (points[i].value / maxValue) * height;
      path += ` L ${x},${y}`;
    }
    
    path += ` L ${width},${height} L 0,${height} Z`;
    
    return path;
  }
}