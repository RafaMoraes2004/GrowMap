import { Component, OnInit, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

// Interface para os dados da empresa
export interface ICompanyProfile {
  companyName: string;
  cnpj: string;
  plan: string;
  employeeCount: number;
  adminCount: number;
}

@Component({
  selector: 'app-empresa', // Alterado
  templateUrl: './configuracoes.html', // Alterado
  styleUrls: ['./configuracoes.css'], // Alterado
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
})
export class EmpresaComponent implements OnInit {
  // --- Lógica de Tema e Navbar (do controle.ts) ---
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true;
  mobileMenuOpen = false;
  userName = 'Rafael'; // Mantido do 'controle'
  userRole = 'Gestor TI'; // Mantido do 'controle'

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  // --- Fim da Lógica Navbar ---

  // --- Novos Dados Mocados para Empresa ---
  companyProfile: ICompanyProfile = {
    companyName: 'GrowMap Solutions',
    cnpj: '12.345.678/0001-99',
    plan: 'Plano Corporativo',
    employeeCount: 52, // A informação que você pediu
    adminCount: 5,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Lógica de inicialização, se necessário
  }
}