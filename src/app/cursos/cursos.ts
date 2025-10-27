import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CourseEnrollmentService } from '../Service/course-enrollment'; // Ajuste o caminho se necessário

// =================================================================
// 1. INTERFACES (Catálogo de Cursos)
// =================================================================

export type CourseLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export type LessonType = 'video' | 'reading' | 'quiz';

export interface ICatalogLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
}

export interface ICatalogModule {
  id: string;
  title: string;
  lessons: ICatalogLesson[];
}

export interface ICatalogCourse {
  id: string;
  title: string;
  subtitle: string;
  level: CourseLevel;
  estimatedTime: string;
  icon: string;
  isPopular: boolean;
  isNew: boolean;
  isEnrolled: boolean;
  modules: ICatalogModule[];
}

// =============================================

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CursosComponent implements OnInit {

  // ============= LÓGICA DA NAVBAR (Copiada) =============
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Kauan Davi';
  userRole = 'Analista de TI';

  toggleTheme(): void { this.isDarkMode = !this.isDarkMode; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  // ======================================================

  // ============= ESTADO CENTRAL DO COMPONENTE =============
  
  currentView: 'list' | 'detail' = 'list';
  activeFilter: 'all' | 'new' | 'popular' | 'enrolled' = 'all';

  allCatalogCourses: ICatalogCourse[] = [];
  filteredCourses: ICatalogCourse[] = [];
  selectedCourse: ICatalogCourse | null = null;
  
  constructor(
    private router: Router,
    public enrollmentService: CourseEnrollmentService // Torne público para usar no template
  ) {} 

  ngOnInit(): void {
    this.allCatalogCourses = this.getMockCatalogCourses();
    this.allCatalogCourses.forEach(course => {
      course.isEnrolled = this.enrollmentService.isEnrolled(course.id);
    });
    this.filterCourses('all');
  }

  // ============= MÉTODOS DE NAVEGAÇÃO E FILTRO =============

  selectCourse(course: ICatalogCourse): void {
    this.selectedCourse = course;
    this.currentView = 'detail';
  }

  goBackToList(): void {
    this.selectedCourse = null;
    this.currentView = 'list';
  }

  filterCourses(filter: 'all' | 'new' | 'popular' | 'enrolled'): void {
    this.activeFilter = filter;
    this.allCatalogCourses.forEach(course => { // Atualiza status antes de filtrar
      course.isEnrolled = this.enrollmentService.isEnrolled(course.id);
    });
    switch (filter) {
      case 'new':
        this.filteredCourses = this.allCatalogCourses.filter(c => c.isNew);
        break;
      case 'popular':
        this.filteredCourses = this.allCatalogCourses.filter(c => c.isPopular);
        break;
      case 'enrolled':
        this.filteredCourses = this.allCatalogCourses.filter(c => c.isEnrolled);
        break;
      case 'all':
      default:
        this.filteredCourses = [...this.allCatalogCourses]; // Use spread para criar nova referência
        break;
    }
  }

  // ============= MÉTODOS DE INTERAÇÃO (Inscrição) =============

  enroll(event: MouseEvent, course: ICatalogCourse): void {
    event.stopPropagation(); 
    this.enrollmentService.enroll(course.id);
    course.isEnrolled = true; 
    if(this.activeFilter === 'enrolled') {
        this.filterCourses('enrolled');
    }
    this.router.navigate(['/meus-cursos']);
  }

  onButtonNavigate(event: MouseEvent): void {
    event.stopPropagation();
  }

  // ============= MÉTODOS AUXILIARES (Helpers) =============

  getModuleLessonCount(module: ICatalogModule): number {
    return module.lessons.length;
  }
  
  // ============= FUNÇÃO DE MOCK DATA (AGORA COM 20 CURSOS) =============
  private getMockCatalogCourses(): ICatalogCourse[] {
    
    const createModules = (prefix: string): ICatalogModule[] => [
      { id: `${prefix}-m1`, title: 'Módulo 1: Introdução', lessons: [
        { id: `${prefix}-l1a`, title: 'Visão Geral', type: 'video', duration: '12 min' },
        { id: `${prefix}-l1b`, title: 'Configurando Ambiente', type: 'video', duration: '20 min' },
        { id: `${prefix}-l1c`, title: 'Primeiros Passos', type: 'reading', duration: '5 min' },
      ]},
      { id: `${prefix}-m2`, title: 'Módulo 2: Conceitos Fundamentais', lessons: [
        { id: `${prefix}-l2a`, title: 'Conceito A', type: 'video', duration: '15 min' },
        { id: `${prefix}-l2b`, title: 'Conceito B', type: 'video', duration: '25 min' },
      ]},
      { id: `${prefix}-m3`, title: 'Módulo 3: Tópicos Avançados', lessons: [
        { id: `${prefix}-l3a`, title: 'Tópico Avançado A', type: 'video', duration: '45 min' },
        { id: `${prefix}-l3b`, title: 'Projeto Prático', type: 'reading', duration: '60 min' },
        { id: `${prefix}-l3c`, title: 'Quiz Final', type: 'quiz', duration: '15 min' },
      ]},
    ];
    
    // Lista completa com 20 cursos
    return [
      // 2 Cursos que podem estar inscritos inicialmente (baseado no serviço)
      { id: 'java', title: 'Java Completo 2025', subtitle: 'Do zero ao Spring Boot e APIs.', level: 'Intermediário', estimatedTime: '40h 15m', icon: '☕', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('java') },
      { id: 'python', title: 'Python para Data Science', subtitle: 'Aprenda Pandas, Numpy e Matplotlib.', level: 'Intermediário', estimatedTime: '25h 00m', icon: '🐍', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('py') },
      
      // 18 Cursos adicionais
      { id: 'excel', title: 'Excel Avançado e Dashboards', subtitle: 'Domine Power Query e Tabelas Dinâmicas.', level: 'Avançado', estimatedTime: '18h 45m', icon: '📊', isPopular: false, isNew: true, isEnrolled: false, modules: createModules('ex') },
      { id: 'office365', title: 'Produtividade com Office 365', subtitle: 'Teams, Power Automate e Power Apps.', level: 'Iniciante', estimatedTime: '12h 00m', icon: '🔄', isPopular: false, isNew: false, isEnrolled: false, modules: createModules('o365') },
      { id: 'sql', title: 'SQL e Bancos de Dados', subtitle: 'Domine SELECT, JOINs e GROUP BY.', level: 'Iniciante', estimatedTime: '15h 30m', icon: '🗃️', isPopular: true, isNew: true, isEnrolled: false, modules: createModules('sql') },
      { id: 'angular', title: 'Angular de A a Z', subtitle: 'Crie aplicações web reativas e modernas.', level: 'Avançado', estimatedTime: '38h 00m', icon: '🅰️', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('ng') },
      { id: 'react', title: 'React.js Essencial', subtitle: 'Hooks, Context API e Redux.', level: 'Intermediário', estimatedTime: '22h 15m', icon: '⚛️', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('react') },
      { id: 'rust', title: 'Rust: Performance e Segurança', subtitle: 'Conceitos de Ownership e Concorrência.', level: 'Avançado', estimatedTime: '30h 00m', icon: '🦀', isPopular: false, isNew: true, isEnrolled: false, modules: createModules('rust') },
      { id: 'csharp', title: '.NET Core e C#', subtitle: 'Construa APIs robustas com a plataforma .NET.', level: 'Intermediário', estimatedTime: '35h 30m', icon: 'C#', isPopular: false, isNew: false, isEnrolled: false, modules: createModules('cs') },
      { id: 'docker', title: 'Docker e Kubernetes', subtitle: 'Orquestração de contêineres na prática.', level: 'Avançado', estimatedTime: '20h 00m', icon: '🐳', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('dock') },
      { id: 'git', title: 'Git e GitHub Completo', subtitle: 'Do básico ao workflow profissional.', level: 'Iniciante', estimatedTime: '8h 45m', icon: '🐙', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('git') },
      { id: 'typescript', title: 'TypeScript: O Próximo Nível', subtitle: 'Tipagem estática para JavaScript.', level: 'Intermediário', estimatedTime: '14h 00m', icon: 'TS', isPopular: false, isNew: true, isEnrolled: false, modules: createModules('ts') },
      { id: 'ux-design', title: 'UI/UX Design com Figma', subtitle: 'Crie interfaces intuitivas e bonitas.', level: 'Iniciante', estimatedTime: '24h 30m', icon: '🎨', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('figma') },
      { id: 'ia', title: 'IA e Machine Learning', subtitle: 'Fundamentos de Inteligência Artificial.', level: 'Avançado', estimatedTime: '50h 00m', icon: '🤖', isPopular: true, isNew: true, isEnrolled: false, modules: createModules('ia') },
      { id: 'ingles', title: 'Inglês para Devs', subtitle: 'Comunicação técnica e entrevistas.', level: 'Iniciante', estimatedTime: '16h 00m', icon: '🗣️', isPopular: false, isNew: true, isEnrolled: false, modules: createModules('eng') },
      { id: 'scrum', title: 'Metodologias Ágeis', subtitle: 'Scrum, Kanban e Gestão de Projetos.', level: 'Iniciante', estimatedTime: '10h 00m', icon: '🏃', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('scrum') },
      { id: 'aws', title: 'AWS Cloud Practitioner', subtitle: 'Prepare-se para a certificação oficial.', level: 'Intermediário', estimatedTime: '28h 00m', icon: '☁️', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('aws') },
      { id: 'golang', title: 'Go (Golang) Essencial', subtitle: 'Performance e simplicidade em back-end.', level: 'Intermediário', estimatedTime: '22h 00m', icon: '🐹', isPopular: false, isNew: true, isEnrolled: false, modules: createModules('go') },
      { id: 'marketing', title: 'Marketing Digital 2025', subtitle: 'SEO, SEM e Mídias Sociais.', level: 'Iniciante', estimatedTime: '19h 30m', icon: '📈', isPopular: false, isNew: false, isEnrolled: false, modules: createModules('mkt') },
      { id: 'htmlcss', title: 'HTML5 e CSS3 Moderno', subtitle: 'Grid, Flexbox e Design Responsivo.', level: 'Iniciante', estimatedTime: '14h 00m', icon: '🌐', isPopular: true, isNew: false, isEnrolled: false, modules: createModules('html') },
    ];
  }
}