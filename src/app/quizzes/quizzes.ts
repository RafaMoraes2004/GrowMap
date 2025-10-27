import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// =================================================================
// 1. NOVAS INTERFACES
// =================================================================

/**
 * Representa um "Tipo" de quiz que o usuário pode escolher fazer.
 */
export interface IQuizAvailable {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string; // Rota para a tela de FAZER este quiz
}

/**
 * Representa uma tentativa de quiz já concluída (Histórico).
 */
export interface IQuizAttempt {
  id: string;
  quizTitle: string;
  courseIcon: string; // Ícone do curso (ex: '☕' para Java)
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercent: number;
  dateAttempted: Date;
  route: string; // Rota para REVISAR este quiz
}

// =============================================

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.html',
  styleUrls: ['./quizzes.css'],
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
export class QuizzesComponent implements OnInit {

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
  availableQuizzes: IQuizAvailable[] = [];
  quizHistory: IQuizAttempt[] = [];

  // ============= MÉTODOS DE INICIALIZAÇÃO =============
  
  ngOnInit(): void {
    this.availableQuizzes = this.getMockAvailableQuizzes();
    this.quizHistory = this.getMockQuizHistory();
  }

  // ============= MÉTODOS AUXILIARES (Helpers) =============

  /**
   * Retorna uma classe CSS com base na pontuação para colorir o percentual.
   */
  getAccuracyClass(percent: number): string {
    if (percent >= 80) return 'high';
    if (percent >= 50) return 'medium';
    return 'low';
  }

  // ============= FUNÇÕES DE MOCK DATA =============

  private getMockAvailableQuizzes(): IQuizAvailable[] {
    // 5 tipos diferentes de quizzes, como solicitado
    return [
      {
        id: 'q-java-1',
        title: 'Quiz: Fundamentos do Java',
        description: 'Teste seus conhecimentos em variáveis, loops e sintaxe básica.',
        icon: '☕',
        route: '/quiz/java-fundamentos' // Rota de exemplo
      },
      {
        id: 'q-python-1',
        title: 'Quiz: Python para Dados',
        description: 'Desafie-se com perguntas sobre Pandas e Numpy.',
        icon: '🐍',
        route: '/quiz/python-dados'
      },
      {
        id: 'q-excel-1',
        title: 'Quiz: Funções do Excel',
        description: 'Você domina PROCV, SOMASES e Tabelas Dinâmicas?',
        icon: '📊',
        route: '/quiz/excel-funcoes'
      },
      {
        id: 'q-office-1',
        title: 'Quiz: Colaboração no O365',
        description: 'Prove seu conhecimento em Teams, SharePoint e OneDrive.',
        icon: '🔄',
        route: '/quiz/office-colab'
      },
      {
        id: 'q-sql-1',
        title: 'Quiz: SQL JOINs',
        description: 'Teste sua habilidade em combinar tabelas com JOINs.',
        icon: '🗃️',
        route: '/quiz/sql-joins'
      }
    ];
  }

  private getMockQuizHistory(): IQuizAttempt[] {
    return [
      {
        id: 'h-1',
        quizTitle: 'Fundamentos do Java',
        courseIcon: '☕',
        totalQuestions: 10,
        correctAnswers: 8,
        accuracyPercent: 80,
        dateAttempted: new Date('2025-10-26T10:30:00'),
        route: '/quiz/review/h-1' // Rota de exemplo para revisão
      },
      {
        id: 'h-2',
        quizTitle: 'Funções do Excel',
        courseIcon: '📊',
        totalQuestions: 15,
        correctAnswers: 14,
        accuracyPercent: 93,
        dateAttempted: new Date('2025-10-25T14:15:00'),
        route: '/quiz/review/h-2'
      },
      {
        id: 'h-3',
        quizTitle: 'Python para Dados',
        courseIcon: '🐍',
        totalQuestions: 10,
        correctAnswers: 5,
        accuracyPercent: 50,
        dateAttempted: new Date('2025-10-24T08:00:00'),
        route: '/quiz/review/h-3'
      }
    ];
  }
}