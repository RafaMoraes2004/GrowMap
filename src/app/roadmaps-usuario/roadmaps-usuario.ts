import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// ============= ENUM E INTERFACES (EXPANDIDAS) =============
// ... (Interfaces ILesson, IQuiz, etc. permanecem as mesmas)
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

/**
 * NOVO: Interface para a tela de seleção de tecnologia
 */
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
export class RoadMapsUsuarioComponent implements OnInit {

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
  // =================================================================

  // ============= ESTADO CENTRAL DO COMPONENTE =============
  
  /**
   * NOVO: Controla qual view o usuário está vendo.
   * 'roadmap': A trilha principal e os detalhes da fase.
   * 'new_tech_select': A grade de seleção de novas tecnologias.
   * 'new_placement_quiz': O quiz de nivelamento.
   */
  currentView: 'roadmap' | 'new_tech_select' | 'new_placement_quiz' = 'roadmap';

  // --- Estado da View 'roadmap' ---
  allCourses: IRoadmapCourse[] = [];
  activeCourseId: string = 'java';
  activeCourse: IRoadmapCourse | undefined = undefined;
  selectedPhase: IRoadmapPhase | null = null;

  // --- Estado da View 'new_...' ---
  placementTechs: IPlacementTech[] = [];
  selectedNewTech: IPlacementTech | null = null;
  activePlacementQuiz: IQuiz | null = null;
  
  // Modelos de roadmap para geração
  private roadmapTemplates: { [key: string]: IRoadmapCourse } = {};
  private placementQuizzes: { [key: string]: IQuiz } = {};

  // Importa o Enum para o Template HTML
  PhaseStatus = PhaseStatus;

  // ============= MÉTODOS DE INICIALIZAÇÃO =============

  ngOnInit(): void {
    // Carrega todos os dados mockados
    const mockData = this.getMockData();
    this.allCourses = mockData.initialCourses;
    this.placementTechs = mockData.placementTechs;
    this.roadmapTemplates = mockData.roadmapTemplates;
    this.placementQuizzes = mockData.placementQuizzes;

    // Carrega o curso ativo inicial
    this.selectCourse(this.activeCourseId);
  }

  // ============= MÉTODOS DE NAVEGAÇÃO (VIEW 'roadmap') =============

  selectCourse(courseId: string): void {
    this.activeCourseId = courseId;
    this.activeCourse = this.allCourses.find(c => c.id === courseId);
    this.goBackToRoadmap();
  }

  selectPhase(phase: IRoadmapPhase): void {
    if (phase.status === PhaseStatus.Locked) { return; }
    this.selectedPhase = phase;
  }

  goBackToRoadmap(): void {
    this.selectedPhase = null;
  }

  // ============= MÉTODOS DE CRIAÇÃO (VIEWS 'new_...') =============

  /**
   * ATUALIZADO: Inicia o fluxo de criação.
   */
  createNewRoadmap(): void {
    this.currentView = 'new_tech_select';
  }

  /**
   * NOVO: Cancela o fluxo de criação e volta para o mapa.
   */
  cancelRoadmapCreation(): void {
    this.currentView = 'roadmap';
    this.selectedNewTech = null;
    this.activePlacementQuiz = null;
  }

  /**
   * NOVO: Chamado ao clicar em uma tecnologia (SQL, Angular, etc.).
   */
  selectTechForPlacement(tech: IPlacementTech): void {
    this.selectedNewTech = tech;
    const quizTemplate = this.placementQuizzes[tech.id];

    // Clona o quiz e reseta as respostas
    this.activePlacementQuiz = {
      ...quizTemplate,
      userAnswers: new Array(quizTemplate.questions.length).fill(null),
      isSubmitted: false
    };
    
    this.currentView = 'new_placement_quiz';
  }

  /**
   * NOVO: Chamado ao finalizar o quiz de nivelamento.
   * Esta é a lógica "Duolingo".
   */
  submitPlacementQuiz(): void {
    if (!this.activePlacementQuiz || !this.selectedNewTech) return;

    // 1. Calcula a pontuação
    let score = 0;
    this.activePlacementQuiz.questions.forEach((q, index) => {
      if (this.activePlacementQuiz!.userAnswers[index] === q.correctAnswerIndex) {
        score++;
      }
    });

    // 2. Gera o novo roadmap
    const newRoadmap = this.generateRoadmapFromQuiz(this.selectedNewTech, score);

    // 3. Adiciona o roadmap à lista
    this.allCourses.push(newRoadmap);

    // 4. Seleciona o novo roadmap
    this.selectCourse(newRoadmap.id);

    // 5. Reseta e volta para a view principal
    this.cancelRoadmapCreation();
  }

  /**
   * NOVO: Função que gera o curso com base na pontuação.
   */
  private generateRoadmapFromQuiz(tech: IPlacementTech, score: number): IRoadmapCourse {
    // Clona o template do roadmap (para não modificar o original)
    const template = JSON.parse(JSON.stringify(this.roadmapTemplates[tech.id]));
    
    // Lógica de "pular" fases
    // Exemplo: 0 acertos = começa do 0.
    // 1 acerto = pula a fase 1.
    // 2+ acertos = pula a fase 1 e 2.

    let phasesToSkip = score;
    let nextPhaseSet = false;

    template.phases.forEach((phase: IRoadmapPhase, index: number) => {
      if (phasesToSkip > 0) {
        phase.status = PhaseStatus.Completed;
        phasesToSkip--;
      } else if (!nextPhaseSet) {
        // Esta é a primeira fase não pulada
        phase.status = PhaseStatus.InProgress;
        nextPhaseSet = true;
      } else {
        // Fases futuras
        phase.status = PhaseStatus.Locked;
      }
    });

    // Caso o usuário tenha gabaritado e pulado tudo
    if (!nextPhaseSet && template.phases.length > 0) {
      template.phases[template.phases.length - 1].status = PhaseStatus.InProgress;
    }

    return template;
  }

  // ============= MÉTODOS DE AULAS E QUIZ (VIEW 'roadmap' -> detalhes) =============

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

  // ====================================================================
  // ATUALIZAÇÃO PRINCIPAL AQUI: getMockData()
  // ====================================================================
  private getMockData() {
    
    // --- Placeholders ---
    const genericLesson = { id: 'l1', title: 'Aula de Exemplo', type: 'video' as 'video', url: '#', isCompleted: false };
    const genericQuiz = { id: 'q1', isSubmitted: false, userAnswers: [], questions: [] };

    // --- 1. Fases para os Cursos Iniciais (TODOS COM 4 ETAPAS) ---

    const javaPhases = [
      { id: 'j1', title: 'Lógica e Fundamentos', description: 'Sintaxe básica, variáveis, loops.', status: PhaseStatus.InProgress, icon: '🧠', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j2', title: 'Orientação a Objetos', description: 'Classes, Herança, Polimorfismo.', status: PhaseStatus.Locked, icon: '🏗️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j3', title: 'Coleções e Exceções', description: 'Lists, Maps, Sets e Try/Catch.', status: PhaseStatus.Locked, icon: '🗃️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'j4', title: 'Spring Boot API', description: 'Construindo APIs RESTful.', status: PhaseStatus.Locked, icon: '⚙️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];
    
    const pythonPhases = [
      { id: 'p1', title: 'Sintaxe Básica', description: 'Tipos de dados, funções e módulos.', status: PhaseStatus.InProgress, icon: '📚', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p2', title: 'Estruturas de Dados', description: 'Listas, Dicionários e Tuplas.', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p3', title: 'Pandas e Análise', description: 'Manipulação de DataFrames.', status: PhaseStatus.Locked, icon: '📊', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'p4', title: 'Django Web', description: 'Criando aplicações web.', status: PhaseStatus.Locked, icon: '🌐', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const excelPhases = [
      { id: 'e1', title: 'Fórmulas Essenciais', description: 'PROCV, SOMASES, SE.', status: PhaseStatus.InProgress, icon: '🧮', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e2', title: 'Tabelas Dinâmicas', description: 'Análise e sumarização de dados.', status: PhaseStatus.Locked, icon: 'Pivot', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e3', title: 'Power Query', description: 'ETL e tratamento de dados.', status: PhaseStatus.Locked, icon: '✨', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'e4', title: 'Dashboards', description: 'Criando painéis visuais.', status: PhaseStatus.Locked, icon: '📊', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    const officePhases = [
      { id: 'o1', title: 'Colaboração (Teams/SharePoint)', description: 'Trabalho em equipe e arquivos.', status: PhaseStatus.InProgress, icon: '👥', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o2', title: 'Power Automate', description: 'Automatizando fluxos de trabalho.', status: PhaseStatus.Locked, icon: '⚡', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o3', title: 'Power Apps', description: 'Criando apps customizados.', status: PhaseStatus.Locked, icon: '📱', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 'o4', title: 'Power BI (Integração)', description: 'Visualizando dados do Office 365.', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    // --- 2. Fases para os Cursos de Nivelamento (Sem alteração) ---
    const sqlPhases = [
      { id: 's1', title: 'SELECT e WHERE', description: 'Consultas básicas de dados.', status: PhaseStatus.InProgress, icon: '🔍', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 's2', title: 'JOINs', description: 'Combinando múltiplas tabelas.', status: PhaseStatus.Locked, icon: '🖇️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
      { id: 's3', title: 'GROUP BY e Agregação', description: 'Sumarizando dados.', status: PhaseStatus.Locked, icon: '🧮', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
    ];

    // --- 3. Lista de Cursos Iniciais (ATUALIZADA) ---
    const initialCourses: IRoadmapCourse[] = [
      { id: 'java', name: 'Java', icon: '☕', phases: javaPhases },
      { id: 'python', name: 'Python', icon: '🐍', phases: pythonPhases },
      { id: 'excel', name: 'Excel', icon: '📊', phases: excelPhases },
      { id: 'office365', name: 'Office 365', icon: '🔄', phases: officePhases }
    ];

    // --- 4. Tecnologias para o Quiz de Nivelamento (Sem alteração) ---
    const placementTechs: IPlacementTech[] = [
      { id: 'sql', name: 'SQL', icon: '🗃️', description: 'Teste seus conhecimentos em bancos de dados relacionais.' },
      { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Veja seu nível no framework front-end do Google.' },
      { id: 'rust', name: 'Rust', icon: '🦀', description: 'Descubra seu ponto de partida em Rust.' }
    ];

    // --- 5. Modelos de Roadmap (ATUALIZADOS) ---
    // (Adicionei Excel e Office aqui também, caso o usuário queira "criar" um roadmap deles)
    const roadmapTemplates: { [key: string]: IRoadmapCourse } = {
      'sql': { id: 'sql-user', name: 'SQL (Meu)', icon: '🗃️', phases: sqlPhases },
      'excel': { id: 'excel-user', name: 'Excel (Meu)', icon: '📊', phases: excelPhases },
      'office365': { id: 'office-user', name: 'Office 365 (Meu)', icon: '🔄', phases: officePhases },
      'angular': { id: 'angular-user', name: 'Angular (Meu)', icon: '🅰️', phases: [/* ...fases do angular... */] },
      'rust': { id: 'rust-user', name: 'Rust (Meu)', icon: '🦀', phases: [/* ...fases do rust... */] }
    };

    // --- 6. Quizzes de Nivelamento (ATUALIZADOS) ---
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