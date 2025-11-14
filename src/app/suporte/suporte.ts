import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importado como no dashboard

// Interfaces de Dashboard (Cursos, Roadmaps, etc) foram removidas pois não são usadas aqui.

@Component({
  selector: 'app-suporte', // Alterado
  templateUrl: './suporte.html', // Alterado
  styleUrls: ['./suporte.css'], // Alterado
  standalone: true,
  imports: [CommonModule, RouterModule], // Mantido igual ao dashboard
})
export class SuporteComponent implements OnInit {
  // Alterado
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  // ============= USER DATA (Mantido do Dashboard) =============
  userName = 'Kauan Davi';
  userRole = 'Analista de TI';

  // Propriedades de dados do Dashboard (overallScore, roadMaps, etc) foram removidas.

  // ============= UI STATE (Mantido do Dashboard) =============
  isDarkMode = true;
  mobileMenuOpen = false;

  ngOnInit(): void {
    // Lógica de inicialização (se houver)
  }

  // ============= METHODS (Mantidos do Dashboard) =============
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}