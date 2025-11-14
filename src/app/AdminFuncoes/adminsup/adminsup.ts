import { Component, OnInit, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-suporte-empresa', // Alterado
  templateUrl: './adminsup.html', // Alterado
  styleUrls: ['./adminsup.css'], // Alterado
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive], // Adicionado RouterLinkActive
})
export class SuporteEmpresaComponent implements OnInit {
  // --- Lógica de Tema e Navbar (do controle.ts) ---
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Rafael'; // Placeholder (Gestor)
  userRole = 'Gestor TI'; // Placeholder (Gestor)

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  // --- Fim da Lógica Navbar ---

  // Dados do 'controle.ts' (gráficos, projetos, etc.) foram removidos.

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Lógica de inicialização, se necessário
  }
}