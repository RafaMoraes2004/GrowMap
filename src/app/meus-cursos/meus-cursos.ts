import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CourseEnrollmentService } from '../Service/course-enrollment';

// =================================================================
// 1. VERIFIQUE SE ESTAS DEFINIÇÕES ESTÃO CORRETAS E PRESENTES
// =================================================================
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
  isCompleted: boolean; // Precisa ser boolean
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
  isSubmitted: boolean; // Precisa ser boolean
}
export interface IRoadmapPhase { // Módulo
  id: string;
  title: string;
  description: string;
  status: PhaseStatus; // Precisa usar o enum PhaseStatus
  icon: string;
  lessons: ILesson[]; // Precisa ser um array de ILesson
  quiz: IQuiz;
  isQuizCompleted: boolean; // Precisa ser boolean
}
export interface IRoadmapCourse { // Curso
  id: string;
  name: string;
  icon: string;
  phases: IRoadmapPhase[]; // Precisa ser um array de IRoadmapPhase
}
// =============================================

@Component({
  selector: 'app-meus-cursos',
  templateUrl: './meus-cursos.html',
  styleUrls: ['./meus-cursos.css'],
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
export class MeusCursosComponent implements OnInit {

  // ... (Propriedades da Navbar: isDarkMode, userName, etc.) ...
  @HostBinding('attr.data-theme') get theme() { /*...*/ return this.isDarkMode ? 'dark' : 'light'; }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Kauan Davi';
  userRole = 'Analista de TI';

  toggleTheme(): void { this.isDarkMode = !this.isDarkMode; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }

  // ... (Propriedades de estado do componente: currentView, etc.) ...
  currentView: 'list' | 'detail' = 'list';
  allCourses: IRoadmapCourse[] = [];
  selectedCourse: IRoadmapCourse | null = null;
  PhaseStatus = PhaseStatus; // Expondo o Enum para o template

  constructor(private enrollmentService: CourseEnrollmentService) {} 
  
  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    const enrolledIds = this.enrollmentService.getEnrolledCourseIds();
    const allMockCourses = this.getMockCourses(); 
    this.allCourses = allMockCourses.filter(course => enrolledIds.has(course.id));
    
    if (this.currentView === 'detail' && this.selectedCourse && !enrolledIds.has(this.selectedCourse.id)) {
        this.goBackToList();
    }
  }

  // ... (Métodos selectCourse, goBackToList, onModuleClick) ...
  selectCourse(course: IRoadmapCourse): void { this.selectedCourse = course; this.currentView = 'detail'; }
  goBackToList(): void { this.selectedCourse = null; this.currentView = 'list'; }
  onModuleClick(event: Event, module: IRoadmapPhase): void { if (module.status === PhaseStatus.Locked) { event.preventDefault(); } }
  
  // ... (Métodos toggleLessonComplete, completeQuiz, checkModuleCompletion, unlockNextModule) ...
  toggleLessonComplete(lesson: ILesson, module: IRoadmapPhase): void { /*...*/ }
  completeQuiz(module: IRoadmapPhase): void { /*...*/ }
  private checkModuleCompletion(module: IRoadmapPhase): void { /*...*/ }
  private unlockNextModule(completedModuleId: string): void { /*...*/ }

  // ============= HELPERS (Verifique os tipos aqui) =============

  /**
   * Calcula o progresso GERAL de um curso. Retorna number.
   */
  getCourseProgress(course: IRoadmapCourse): number { // <- Retorna number
    // CORREÇÃO: Adiciona verificação para evitar divisão por zero
    if (!course || !course.phases || course.phases.length === 0) {
      return 0; 
    }
    const completedModules = course.phases.filter(p => p.status === PhaseStatus.Completed).length;
    return (completedModules / course.phases.length) * 100;
  }

  /**
   * Calcula o progresso de um MÓDULO. Retorna number.
   */
  getModuleProgress(module: IRoadmapPhase): number { // <- Retorna number
    if (!module || !module.lessons || module.lessons.length === 0) {
      return 0; // Já tratava a divisão por zero
    }
    const completedLessons = module.lessons.filter(l => l.isCompleted).length;
    return (completedLessons / module.lessons.length) * 100;
  }

  /**
   * Verifica se todas as aulas de um módulo estão completas. Retorna boolean.
   */
  allLessonsCompleted(module: IRoadmapPhase): boolean { // <- Retorna boolean
    // Verifica se module e module.lessons existem antes de acessar
    if (!module || !module.lessons) {
        return false;
    }
    // A lógica original já estava correta
    return module.lessons.length > 0 && module.lessons.every(l => l.isCompleted);
  }
  
  /**
   * Helper para ícone de status do módulo. Retorna string.
   */
  getIconForStatus(status: PhaseStatus): string { // <- Retorna string
    // Verifica se status é um valor válido do enum
     if (status === undefined || status === null) {
        return '?'; // Ou algum ícone padrão para estado desconhecido
     }
    // A lógica original já estava correta
    switch (status) {
      case PhaseStatus.Completed: return '✔️';
      case PhaseStatus.InProgress: return '⏳';
      case PhaseStatus.Locked: return '🔒';
      default: return '?'; // Caso receba um valor inesperado
    }
  }

  // ============= FUNÇÃO DE MOCK DATA (Verifique se os mocks usam os tipos corretos) =============
  private getMockCourses(): IRoadmapCourse[] { 
      const genericLesson: ILesson = { id: 'l1', title: 'Aula de Exemplo', type: 'video', url: '#', isCompleted: false };
      const completedLesson: ILesson = { id: 'l2', title: 'Aula Concluída', type: 'video', url: '#', isCompleted: true };
      const genericQuiz: IQuiz = { id: 'q1', isSubmitted: false, userAnswers: [], questions: [] };
      const completedQuiz: IQuiz = { id: 'q2', isSubmitted: true, userAnswers: [], questions: [] };
  
      // Verifique se os status aqui usam PhaseStatus.Completed, etc.
      return [
        {
          id: 'java', name: 'Java Completo 2025', icon: '☕',
          phases: [
            { id: 'j1', title: 'Módulo 1: Fundamentos', description: '...', status: PhaseStatus.Completed, icon: '🧠', isQuizCompleted: true, lessons: [completedLesson, completedLesson], quiz: completedQuiz },
            { id: 'j2', title: 'Módulo 2: Orientação a Objetos', description: '...', status: PhaseStatus.InProgress, icon: '🏗️', isQuizCompleted: false, lessons: [completedLesson, genericLesson], quiz: genericQuiz },
            { id: 'j3', title: 'Módulo 3: Coleções e Exceções', description: '...', status: PhaseStatus.Locked, icon: '🗃️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
            { id: 'j4', title: 'Módulo 4: Spring Boot', description: '...', status: PhaseStatus.Locked, icon: '⚙️', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz }
          ]
        },
        // ... (outros cursos mockados, garanta que usam os tipos corretos)
         {
        id: 'python', name: 'Python para Data Science', icon: '🐍',
        phases: [
          { id: 'p1', title: 'Módulo 1: Sintaxe Básica', description: '...', status: PhaseStatus.InProgress, icon: '📚', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
          { id: 'p2', title: 'Módulo 2: Estruturas de Dados', description: '...', status: PhaseStatus.Locked, icon: '📈', isQuizCompleted: false, lessons: [genericLesson], quiz: genericQuiz },
          // ...
        ]
      },
      // ...
      ];
  }
}