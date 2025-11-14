import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule é necessário para *ngIf
import { RouterModule, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms'; // IMPORTADO PARA [(ngModel)]

// Interface para o perfil
export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  joinDate: string; // Formato YYYY-MM-DD
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
  standalone: true,
  imports: [
    CommonModule, // Adicionado
    RouterModule,
    RouterLinkActive,
    FormsModule, // Adicionado
  ],
})
export class PerfilComponent implements OnInit {
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  // ============= MOCKED USER DATA =============
  userProfile: IUserProfile = {
    firstName: 'Kauan',
    lastName: 'Davi',
    email: 'kauan.davi@growmap.com',
    company: 'GrowMap Solutions',
    role: 'Analista de TI',
    joinDate: '2023-05-10',
  };

  // ============= USER DATA (Para a Navbar) =============
  userName = '';
  userRole = '';
  formattedJoinDate = ''; // Para exibir a data formatada

  // ============= CAMPOS DO FORMULÁRIO =============
  passwordField: string = ''; // Campo para a nova senha
  showPassword: boolean = false; // "VER SENHA"

  // ============= UI STATE =============
  isDarkMode = true;
  mobileMenuOpen = false;

  ngOnInit(): void {
    // Popula os dados da navbar
    this.userName = `${this.userProfile.firstName} ${this.userProfile.lastName}`;
    this.userRole = this.userProfile.role;

    // Formata a data para DD/MM/YYYY para exibir no input readonly
    try {
      const [year, month, day] = this.userProfile.joinDate.split('-');
      this.formattedJoinDate = `${day}/${month}/${year}`;
    } catch (e) {
      this.formattedJoinDate = this.userProfile.joinDate; // Fallback
    }
  }

  // ============= MÉTODOS DE AÇÃO =============

  // "VER SENHA"
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // "SALVAR ALTERAÇÕES"
  saveProfile(event: Event): void {
    event.preventDefault();
    // Lógica para salvar o perfil (Nome, Sobrenome, Email)
    console.log('Salvando Perfil:', this.userProfile);
    // Atualiza o nome na navbar caso tenha mudado
    this.userName = `${this.userProfile.firstName} ${this.userProfile.lastName}`;
  }

  // "SALVAR SENHA"
  savePassword(): void {
    if (this.passwordField) {
      // Lógica para salvar a nova senha
      console.log('Salvando Nova Senha:', this.passwordField);
      this.passwordField = ''; // Limpa o campo
    } else {
      console.log('Nenhuma nova senha digitada.');
    }
  }

  // ============= MÉTODOS DA NAVBAR (Mantidos) =============
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}