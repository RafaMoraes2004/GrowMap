import { Component, OnInit, HostBinding, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// ============= ENUM E INTERFACES =============
export enum PhaseStatus {
  Completed,
  InProgress,
  Locked
}

export interface ILesson {
  id: string;
  title: string;
  type: 'video' | 'reading';
  url: string;
  isCompleted: boolean;
}

export interface IQuizQuestion {
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuiz {
  id: string;
  questions: IQuizQuestion[];
  userAnswers: (number | null)[];
  isSubmitted: boolean;
}

export interface IRoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: PhaseStatus;
  icon: string;
  lessons: ILesson[];
  quiz: IQuiz;
  isQuizCompleted: boolean;
}

export interface IRoadmapCourse {
  id: string;
  name: string;
  icon: string;
  phases: IRoadmapPhase[];
}

export interface IPlacementTech {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// =============================================

@Component({
  selector: 'app-road-maps-usuario',
  templateUrl: './roadmaps-usuario.html',
  styleUrls: ['./roadmaps-usuario.css'],
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
export class RoadMapsUsuarioComponent implements OnInit, AfterViewInit {

  // ============= REFERÊNCIA PARA O CONTAINER DE SCROLL =============
  @ViewChild('journeyContainer') journeyContainer?: ElementRef<HTMLDivElement>;

  // ============= LÓGICA DA NAVBAR =============
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Kauan Davi';
  userRole = 'Analista de TI';

  toggleTheme(): void { this.isDarkMode = !this.isDarkMode; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }

  // ============= ESTADO CENTRAL =============
  currentView: 'roadmap' | 'new_tech_select' | 'new_placement_quiz' = 'roadmap';

  // Estado da View 'roadmap'
  allCourses: IRoadmapCourse[] = [];
  activeCourseId: string = 'java';
  activeCourse: IRoadmapCourse | undefined = undefined;
  selectedPhase: IRoadmapPhase | null = null;

  // Estado da View 'new_...'
  placementTechs: IPlacementTech[] = [];
  selectedNewTech: IPlacementTech | null = null;
  activePlacementQuiz: IQuiz | null = null;

  // Modelos de roadmap
  private roadmapTemplates: { [key: string]: IRoadmapCourse } = {};
  private placementQuizzes: { [key: string]: IQuiz } = {};

  // Importa o Enum para o Template
  PhaseStatus = PhaseStatus;

  // ============= NOVO: CONTROLE DO SCROLL HINT =============
  scrollHintHidden = false;
  private scrollTimeout: any;

  // ============= INICIALIZAÇÃO =============
  ngOnInit(): void {
    const mockData = this.getMockData();
    this.allCourses = mockData.initialCourses;
    this.placementTechs = mockData.placementTechs;
    this.roadmapTemplates = mockData.roadmapTemplates;
    this.placementQuizzes = mockData.placementQuizzes;

    this.selectCourse(this.activeCourseId);
  }

  ngAfterViewInit(): void {
    // Scroll para o final (início da jornada) quando o componente carregar
    this.scrollToBottom();
  }

  // ============= NOVO: MÉTODOS DE SCROLL =============

  /**
   * Scroll suave para o final do container (início da jornada)
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.journeyContainer?.nativeElement) {
        const container = this.journeyContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  /**
   * Handler de scroll para efeitos e ocultação do hint
   */
  onJourneyScroll(event: Event): void {
    const container = event.target as HTMLDivElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Oculta o hint após o usuário começar a rolar
    if (scrollTop < scrollHeight - clientHeight - 50) {
      this.scrollHintHidden = true;
    }

    // Aplica efeitos de parallax nas fases visíveis
    this.applyScrollEffects(container);

    // Reseta o timeout do hint
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      if (scrollTop >= scrollHeight - clientHeight - 10) {
        this.scrollHintHidden = false;
      }
    }, 2000);
  }

  /**
   * Aplica efeitos visuais baseados na posição do scroll
   */
  private applyScrollEffects(container: HTMLDivElement): void {
    const phases = container.querySelectorAll('.floating-phase');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    phases.forEach((phase, index) => {
      const phaseRect = phase.getBoundingClientRect();
      const phaseCenter = phaseRect.top + phaseRect.height / 2;
      
      // ✨ MELHORIA #2: Parallax - Usando 'distance'
      const distance = Math.abs(containerCenter - phaseCenter);
      const maxDistance = containerRect.height / 2;
      
      // Calcula a opacidade e escala baseado na distância do centro
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const opacity = 1 - (normalizedDistance * 0.4);
      const scale = 1 - (normalizedDistance * 0.05);

      // ✨ MELHORIA #2: Novo cálculo de Parallax Y
      // Quanto mais longe do centro (maior 'distance'), mais é empurrado (positivo 'translateY')
      const parallaxY = distance * 0.1;

      // Aplica os estilos
      const element = phase as HTMLElement;
      element.style.opacity = opacity.toString();
      
      // ✨ MUDANÇA: Aplicando o novo transform com Parallax Y e Scale
      element.style.transform = `translateY(${parallaxY}px) scale(${scale})`;
      
      element.style.setProperty('--phase-index', index.toString());
    });
  }

  /**
   * Retorna as fases em ordem invertida para a jornada ascendente
   */
  getReversedPhases(): IRoadmapPhase[] {
    if (!this.activeCourse) return [];
    return [...this.activeCourse.phases].reverse();
  }

  // ============= NAVEGAÇÃO (VIEW 'roadmap') =============

  selectCourse(courseId: string): void {
    this.activeCourseId = courseId;
    this.activeCourse = this.allCourses.find(c => c.id === courseId);
    this.goBackToRoadmap();
    
    // Scroll para o início da nova jornada
    setTimeout(() => this.scrollToBottom(), 200);
  }

  selectPhase(phase: IRoadmapPhase): void {
    if (phase.status === PhaseStatus.Locked) { return; }
    this.selectedPhase = phase;
  }

  goBackToRoadmap(): void {
    this.selectedPhase = null;
  }

  // ============= CRIAÇÃO (VIEWS 'new_...') =============

  createNewRoadmap(): void {
    this.currentView = 'new_tech_select';
  }

  cancelRoadmapCreation(): void {
    this.currentView = 'roadmap';
    this.selectedNewTech = null;
    this.activePlacementQuiz = null;
  }

  selectTechForPlacement(tech: IPlacementTech): void {
    this.selectedNewTech = tech;
    const quizTemplate = this.placementQuizzes[tech.id];

    this.activePlacementQuiz = {
      ...quizTemplate,
      userAnswers: new Array(quizTemplate.questions.length).fill(null),
      isSubmitted: false
    };
    
    this.currentView = 'new_placement_quiz';
  }

  submitPlacementQuiz(): void {
    if (!this.activePlacementQuiz || !this.selectedNewTech) return;

    // Calcula pontuação
    let score = 0;
    this.activePlacementQuiz.questions.forEach((q, index) => {
      if (this.activePlacementQuiz!.userAnswers[index] === q.correctAnswerIndex) {
        score++;
      }
    });

    // Gera novo roadmap
    const newRoadmap = this.generateRoadmapFromQuiz(this.selectedNewTech, score);

    // Adiciona à lista
    this.allCourses.push(newRoadmap);

    // Seleciona o novo roadmap
    this.selectCourse(newRoadmap.id);

    // Reseta e volta
    this.cancelRoadmapCreation();
  }

  private generateRoadmapFromQuiz(tech: IPlacementTech, score: number): IRoadmapCourse {
    const template = JSON.parse(JSON.stringify(this.roadmapTemplates[tech.id]));
    
    let phasesToSkip = score;
    let nextPhaseSet = false;

    template.phases.forEach((phase: IRoadmapPhase, index: number) => {
      if (phasesToSkip > 0) {
        phase.status = PhaseStatus.Completed;
        phasesToSkip--;
      } else if (!nextPhaseSet) {
        phase.status = PhaseStatus.InProgress;
        nextPhaseSet = true;
      } else {
        phase.status = PhaseStatus.Locked;
      }
    });

    if (!nextPhaseSet && template.phases.length > 0) {
      template.phases[template.phases.length - 1].status = PhaseStatus.InProgress;
    }

    return template;
  }

  // ============= AULAS E QUIZ =============

  toggleLessonComplete(lesson: ILesson): void {
    lesson.isCompleted = !lesson.isCompleted;
    this.checkPhaseCompletion(this.selectedPhase!);
  }

  completeQuiz(phase: IRoadmapPhase): void {
    if (this.allLessonsCompleted(phase)) {
      phase.isQuizCompleted = true;
      phase.quiz.isSubmitted = true;
      this.checkPhaseCompletion(phase);
    } else {
      alert("Você precisa completar todas as aulas antes de fazer o quiz.");
    }
  }

  private checkPhaseCompletion(phase: IRoadmapPhase): void {
    if (!phase) return;
    if (this.allLessonsCompleted(phase) && phase.isQuizCompleted) {
      phase.status = PhaseStatus.Completed;
      this.unlockNextPhase(phase.id);
      setTimeout(() => this.goBackToRoadmap(), 1000);
    }
  }

  private unlockNextPhase(completedPhaseId: string): void {
    if (!this.activeCourse) return;
    const phases = this.activeCourse.phases;
    const currentIndex = phases.findIndex(p => p.id === completedPhaseId);
    if (currentIndex >= 0 && currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      if (nextPhase.status === PhaseStatus.Locked) {
        nextPhase.status = PhaseStatus.InProgress;
      }
    }
  }

  // ============= HELPERS =============

  allLessonsCompleted(phase: IRoadmapPhase): boolean {
    return phase.lessons.length > 0 && phase.lessons.every(l => l.isCompleted);
  }

  getPhaseProgress(phase: IRoadmapPhase): number {
    const completed = phase.lessons.filter(l => l.isCompleted).length;
    return (completed / phase.lessons.length) * 100;
  }

  getIconForStatus(status: PhaseStatus): string {
    switch (status) {
      case PhaseStatus.Completed: return '✔️';
      case PhaseStatus.InProgress: return '⏳';
      case PhaseStatus.Locked: return '🔒';
    }
  }

  // ============= DADOS MOCKADOS =============
  // (O método getMockData() permanece inalterado)
  // ... (código mockado omitido por ser idêntico ao original) ...
  private getMockData() {
    const genericLesson = { 
      id: 'l1', 
      title: 'Aula de Exemplo', 
      type: 'video' as 'video', 
      url: '#', 
      isCompleted: false 
    };
    const genericQuiz = { 
      id: 'q1', 
      isSubmitted: false, 
      userAnswers: [], 
      questions: [] 
    };

    // Fases dos cursos iniciais
    const javaPhases = [
      { id: 'j1', title: 'Lógica e Fundamentos', description: 'Sintaxe básica, variáveis, loops.', status: PhaseStatus.InProgress, icon: '🧠', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j2', title: 'Orientação a Objetos', description: 'Classes, Herança, Polimorfismo.', status: PhaseStatus.Locked, icon: '🗝️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j3', title: 'Coleções e Exceções', description: 'Lists, Maps, Sets e Try/Catch.', status: PhaseStatus.Locked, icon: '🗃️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j4', title: 'JDBC', description: 'Conectando ao banco de dados.', status: PhaseStatus.Locked, icon: '💾', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j5', title: 'Streams e Lambdas', description: 'Programação funcional no Java.', status: PhaseStatus.Locked, icon: '🌊', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j6', title: 'Maven & Gradle', description: 'Gerenciamento de dependências.', status: PhaseStatus.Locked, icon: '📦', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j7', title: 'Testes (JUnit 5)', description: 'Testes unitários e TDD.', status: PhaseStatus.Locked, icon: '🧪', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j8', title: 'Introdução ao Spring Boot', description: 'Configuração e Injeção.', status: PhaseStatus.Locked, icon: '🌱', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j9', title: 'Spring Boot API REST', description: 'Construindo APIs RESTful.', status: PhaseStatus.Locked, icon: '⚙️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j10', title: 'Spring Data JPA', description: 'Persistência de dados simplificada.', status: PhaseStatus.Locked, icon: '🗄️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j11', title: 'Spring Security', description: 'Autenticação e autorização.', status: PhaseStatus.Locked, icon: '🛡️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j12', title: 'Concorrência', description: 'Threads e programação paralela.', status: PhaseStatus.Locked, icon: '👯', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j13', title: 'Design Patterns', description: 'Soluções comuns de design.', status: PhaseStatus.Locked, icon: '🏛️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j14', title: 'Mensageria (Kafka/RabbitMQ)', description: 'Sistemas assíncronos.', status: PhaseStatus.Locked, icon: '📨', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j15', title: 'Microsserviços (Spring Cloud)', description: 'Arquitetura distribuída.', status: PhaseStatus.Locked, icon: '🧩', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];
    
    const pythonPhases = [
      { id: 'p1', title: 'Sintaxe Básica', description: 'Tipos de dados, funções e módulos.', status: PhaseStatus.InProgress, icon: '📚', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p2', title: 'Estruturas de Dados', description: 'Listas, Dicionários e Tuplas.', status: PhaseStatus.Locked, icon: '📊', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p3', title: 'Orientação a Objetos', description: 'Classes, métodos e herança.', status: PhaseStatus.Locked, icon: '🗝️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p4', title: 'Ambientes Virtuais (Venv)', description: 'Isolando dependências.', status: PhaseStatus.Locked, icon: '🌱', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p5', title: 'Manipulação de Arquivos', description: 'Lendo e escrevendo (JSON/CSV).', status: PhaseStatus.Locked, icon: '📄', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p6', title: 'NumPy', description: 'Computação numérica e arrays.', status: PhaseStatus.Locked, icon: '🔢', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p7', title: 'Pandas', description: 'Análise e manipulação de DataFrames.', status: PhaseStatus.Locked, icon: '🐼', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p8', title: 'Matplotlib & Seaborn', description: 'Visualização de dados.', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p9', title: 'APIs (Flask/FastAPI)', description: 'Construindo APIs web.', status: PhaseStatus.Locked, icon: '🌐', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p10', title: 'SQLAlchemy', description: 'Conexão com bancos de dados.', status: PhaseStatus.Locked, icon: '💾', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p11', title: 'Web Scraping', description: 'BeautifulSoup e Scrapy.', status: PhaseStatus.Locked, icon: '🕸️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p12', title: 'Testes (Pytest)', description: 'Garantindo a qualidade do código.', status: PhaseStatus.Locked, icon: '🧪', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p13', title: 'Scikit-learn', description: 'Introdução ao Machine Learning.', status: PhaseStatus.Locked, icon: '🤖', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p14', title: 'Django (Web Completo)', description: 'Framework web robusto.', status: PhaseStatus.Locked, icon: '🏗️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p15', title: 'Automação (Selenium)', description: 'Controlando o navegador.', status: PhaseStatus.Locked, icon: '🚗', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const excelPhases = [
      { id: 'e1', title: 'Fórmulas Essenciais', description: 'PROCV, SOMASES, SE.', status: PhaseStatus.InProgress, icon: '🧮', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e2', title: 'Formatação Condicional', description: 'Destacando dados visualmente.', status: PhaseStatus.Locked, icon: '🎨', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e3', title: 'Tabelas Dinâmicas', description: 'Análise e sumarização de dados.', status: PhaseStatus.Locked, icon: '📊', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e4', title: 'Gráficos Avançados', description: 'Cascata, Funil e Mapas.', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e5', title: 'Funções de Texto e Data', description: 'Manipulação de strings e tempo.', status: PhaseStatus.Locked, icon: '📅', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e6', title: 'Validação de Dados', description: 'Garantindo a entrada correta.', status: PhaseStatus.Locked, icon: '✔️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e7', title: 'Solver e Atingir Meta', description: 'Otimização e cenários.', status: PhaseStatus.Locked, icon: '🎯', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e8', title: 'Segmentação de Dados', description: 'Filtros interativos (Slicers).', status: PhaseStatus.Locked, icon: '🔪', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e9', title: 'Power Query (ETL)', description: 'Extração e tratamento de dados.', status: PhaseStatus.Locked, icon: '✨', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e10', title: 'Power Pivot', description: 'Modelagem de dados e DAX.', status: PhaseStatus.Locked, icon: '💪', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e11', title: 'Introdução ao DAX', description: 'Funções de agregação e tempo.', status: PhaseStatus.Locked, icon: '📟', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e12', title: 'Macros (Gravador)', description: 'Automatizando tarefas simples.', status: PhaseStatus.Locked, icon: '🔴', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e13', title: 'Introdução ao VBA', description: 'Scripts para automação.', status: PhaseStatus.Locked, icon: '🧑‍💻', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e14', title: 'Dashboards (Básico)', description: 'Criando painéis visuais.', status: PhaseStatus.Locked, icon: '🖥️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e15', title: 'Dashboards (Avançado)', description: 'Painéis dinâmicos e interativos.', status: PhaseStatus.Locked, icon: '🚀', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const officePhases = [
      { id: 'o1', title: 'OneDrive & Colaboração', description: 'Nuvem e coautoria (Word/Excel).', status: PhaseStatus.InProgress, icon: '☁️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o2', title: 'Outlook (Avançado)', description: 'Regras, passos rápidos e agenda.', status: PhaseStatus.Locked, icon: '📧', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o3', title: 'Teams (Colaboração)', description: 'Canais, reuniões e arquivos.', status: PhaseStatus.Locked, icon: '👥', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o4', title: 'SharePoint', description: 'Sites de equipe e listas.', status: PhaseStatus.Locked, icon: '🏛️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o5', title: 'Planner', description: 'Gestão de tarefas (Kanban).', status: PhaseStatus.Locked, icon: '📋', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o6', title: 'Forms', description: 'Coleta de dados e pesquisas.', status: PhaseStatus.Locked, icon: '📝', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o7', title: 'OneNote', description: 'Organização e notas digitais.', status: PhaseStatus.Locked, icon: '📓', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o8', title: 'PowerPoint (Design)', description: 'Design e recursos visuais.', status: PhaseStatus.Locked, icon: '🖼️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o9', title: 'Power Automate (Básico)', description: 'Automatizando fluxos simples.', status: PhaseStatus.Locked, icon: '⚡', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o10', title: 'Power Automate (Avançado)', description: 'Fluxos com aprovações e IA.', status: PhaseStatus.Locked, icon: '🤖', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o11', title: 'Power Apps (Canvas)', description: 'Criando apps do zero.', status: PhaseStatus.Locked, icon: '📱', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o12', title: 'Dataverse for Teams', description: 'Banco de dados dentro do Teams.', status: PhaseStatus.Locked, icon: '🗃️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o13', title: 'Power Apps (Model-Driven)', description: 'Apps baseados em dados.', status: PhaseStatus.Locked, icon: '🏗️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o14', title: 'Power BI (Integração)', description: 'Visualizando dados do Office 365.', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o15', title: 'Segurança e Conformidade', description: 'Visão geral de segurança.', status: PhaseStatus.Locked, icon: '🛡️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const sqlPhases = [
      { id: 's1', title: 'SELECT e WHERE', description: 'Consultas básicas de dados.', status: PhaseStatus.InProgress, icon: '🔍', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 's2', title: 'JOINs', description: 'Combinando múltiplas tabelas.', status: PhaseStatus.Locked, icon: '🖇️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 's3', title: 'GROUP BY e Agregação', description: 'Sumarizando dados.', status: PhaseStatus.Locked, icon: '🧮', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const initialCourses: IRoadmapCourse[] = [
      { id: 'java', name: 'Java', icon: '☕', phases: javaPhases },
      { id: 'python', name: 'Python', icon: '🐍', phases: pythonPhases },
      { id: 'excel', name: 'Excel', icon: '📊', phases: excelPhases },
      { id: 'office365', name: 'Office 365', icon: '📄', phases: officePhases }
    ];

    const placementTechs: IPlacementTech[] = [
      { id: 'sql', name: 'SQL', icon: '🗃️', description: 'Teste seus conhecimentos em bancos de dados relacionais.' },
      { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Veja seu nível no framework front-end do Google.' },
      { id: 'rust', name: 'Rust', icon: '🦀', description: 'Descubra seu ponto de partida em Rust.' }
    ];

    const roadmapTemplates: { [key: string]: IRoadmapCourse } = {
      'sql': { id: 'sql-user', name: 'SQL (Meu)', icon: '🗃️', phases: sqlPhases },
      'excel': { id: 'excel-user', name: 'Excel (Meu)', icon: '📊', phases: excelPhases },
      'office365': { id: 'office-user', name: 'Office 365 (Meu)', icon: '📄', phases: officePhases },
      'angular': { id: 'angular-user', name: 'Angular (Meu)', icon: '🅰️', phases: [] },
      'rust': { id: 'rust-user', name: 'Rust (Meu)', icon: '🦀', phases: [] }
    };

    const placementQuizzes: { [key: string]: IQuiz } = {
      'sql': {
        id: 'sql-placement', isSubmitted: false, userAnswers: [],
        questions: [
          { text: 'Qual comando é usado para consultar dados?', options: ['SELECT', 'UPDATE', 'INSERT'], correctAnswerIndex: 0 },
          { text: 'Qual cláusula filtra os resultados?', options: ['FILTER', 'WHERE', 'GROUP BY'], correctAnswerIndex: 1 }
        ]
      },
      'excel': {
        id: 'excel-placement', isSubmitted: false, userAnswers: [],
        questions: [
          { text: 'O que faz a função PROCV?', options: ['Soma valores', 'Procura um valor na vertical', 'Conta células'], correctAnswerIndex: 1 }
        ]
      },
      'office365': {
        id: 'office-placement', isSubmitted: false, userAnswers: [],
        questions: [
          { text: 'Qual app é focado em automação?', options: ['Power Apps', 'Power Automate', 'Teams'], correctAnswerIndex: 1 }
        ]
      },
      'angular': {
        id: 'angular-placement', isSubmitted: false, userAnswers: [],
        questions: [
          { text: 'O que é um Componente?', options: ['Um decorador', 'Um bloco de UI', 'Um serviço'], correctAnswerIndex: 1 }
        ]
      },
      'rust': {
        id: 'rust-placement', isSubmitted: false, userAnswers: [],
        questions: [
          { text: 'Qual conceito é central em Rust?', options: ['Ownership', 'Garbage Collector', 'Prototype'], correctAnswerIndex: 0 }
        ]
      }
    };

    return { initialCourses, placementTechs, roadmapTemplates, placementQuizzes };
  }
}