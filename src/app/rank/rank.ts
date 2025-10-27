import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// =================================================================
// 1. NOVAS INTERFACES
// =================================================================

/**
 * Representa um colaborador no ranking.
 */
export interface IRankUser {
  id: number;
  name: string;
  role: string;
  avatarInitial: string;
  accuracyPercent: number; // % de Acertos
  quizzesDone: number;     // Quizzes Feitos
  coursesDone: number;     // Cursos Completados
}

/**
 * Representa a pontuação do usuário logado em um curso específico.
 */
export interface ICurrentUserQuizScore {
  courseName: string;
  courseIcon: string;
  scorePercent: number;
}

/**
 * Chave para os tipos de ordenação.
 */
export type SortKey = 'accuracyPercent' | 'quizzesDone' | 'coursesDone';

// =============================================

@Component({
  selector: 'app-rank',
  templateUrl: './rank.html',
  styleUrls: ['./rank.css'],
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
export class RankComponent implements OnInit {

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

  // --- Dados do Usuário Logado ---
  currentUser: IRankUser = {
    id: 1,
    name: 'Kauan Davi',
    role: 'Analista de TI',
    avatarInitial: 'K',
    accuracyPercent: 82,
    quizzesDone: 6,
    coursesDone: 1
  };

  currentUserScores: ICurrentUserQuizScore[] = [
    { courseName: 'Java', courseIcon: '☕', scorePercent: 90 },
    { courseName: 'Python', courseIcon: '🐍', scorePercent: 75 },
    { courseName: 'Excel', courseIcon: '📊', scorePercent: 88 },
    { courseName: 'Office 365', courseIcon: '🔄', scorePercent: 70 },
  ];
  
  // --- Dados do Ranking ---
  leaderboard: IRankUser[] = [];
  displayLeaderboard: IRankUser[] = [];
  currentUserRank: number = 0;
  activeSortKey: SortKey = 'accuracyPercent';

  // ============= MÉTODOS DE INICIALIZAÇÃO =============

  ngOnInit(): void {
    this.leaderboard = this.getMockLeaderboard();
    // Garante que o usuário logado esteja na lista para ser classificado
    if (!this.leaderboard.find(u => u.id === this.currentUser.id)) {
      this.leaderboard.push(this.currentUser);
    }
    
    // Ordenação inicial
    this.sortLeaderboard('accuracyPercent');
  }

  // ============= MÉTODOS DE ORDENAÇÃO E INTERAÇÃO =============

  /**
   * Ordena a lista de colaboradores com base na chave (key) fornecida.
   * @param key A métrica para ordenar ('accuracyPercent', 'quizzesDone', 'coursesDone')
   */
  sortLeaderboard(key: SortKey): void {
    this.activeSortKey = key;
    
    // Cria uma cópia ordenada do leaderboard
    this.displayLeaderboard = [...this.leaderboard].sort((a, b) => {
      // Ordena em ordem decrescente (maior para o menor)
      return b[key] - a[key];
    });

    // Atualiza a posição do usuário logado
    this.currentUserRank = this.displayLeaderboard.findIndex(u => u.id === this.currentUser.id) + 1;
  }

  /**
   * Helper para o template, para retornar a medalha do Top 3.
   */
  getMedal(index: number): string {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  }

  // ============= FUNÇÃO DE MOCK DATA =============

  private getMockLeaderboard(): IRankUser[] {
    return [
      { id: 2, name: 'Ana Silva', role: 'Desenvolvedora Sênior', avatarInitial: 'A', accuracyPercent: 95, quizzesDone: 15, coursesDone: 3 },
      { id: 3, name: 'Bruno Costa', role: 'UX Designer', avatarInitial: 'B', accuracyPercent: 88, quizzesDone: 10, coursesDone: 2 },
      { id: 4, name: 'Carla Moreira', role: 'Gerente de Projetos', avatarInitial: 'C', accuracyPercent: 92, quizzesDone: 12, coursesDone: 2 },
      { id: 5, name: 'Daniel Alves', role: 'Engenheiro de Dados', avatarInitial: 'D', accuracyPercent: 90, quizzesDone: 20, coursesDone: 4 },
      { id: 6, name: 'Elisa Fernandes', role: 'Analista de QA', avatarInitial: 'E', accuracyPercent: 78, quizzesDone: 5, coursesDone: 1 },
      { id: 7, name: 'Fábio Guedes', role: 'DevOps Pleno', avatarInitial: 'F', accuracyPercent: 85, quizzesDone: 8, coursesDone: 1 },
      { id: 8, name: 'Gabriela Lima', role: 'Desenvolvedora Júnior', avatarInitial: 'G', accuracyPercent: 98, quizzesDone: 18, coursesDone: 3 },
      { id: 9, name: 'Hugo Martins', role: 'Analista de Suporte', avatarInitial: 'H', accuracyPercent: 75, quizzesDone: 14, coursesDone: 2 },
      { id: 10, name: 'Isabela Rocha', role: 'Product Owner', avatarInitial: 'I', accuracyPercent: 89, quizzesDone: 9, coursesDone: 2 },
      { id: 11, name: 'Lucas Pereira', role: 'Estagiário', avatarInitial: 'L', accuracyPercent: 65, quizzesDone: 3, coursesDone: 0 },
    ];
  }
}