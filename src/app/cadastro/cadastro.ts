import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-cadastro',
  // Adicionar FormsModule e CommonModule
  imports: [RouterLink, FormsModule, CommonModule], 
  standalone: true,
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  // --- Nossas propriedades para o novo formulário ---
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Injetar o Router para navegação
  constructor(private router: Router) {}

  // --- Nosso método de cadastro ---
  handleRegister() {
    this.errorMessage = null;    // Limpa erros anteriores
    this.successMessage = null; // Limpa sucesso anterior

    // 1. Verificar campos incompletos
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Existem campos incompletos.';
      return;
    }

    // 2. Verificar nomes de usuário ou e-mails proibidos
    const forbiddenNames = ['admin', 'adminempresa'];
    if (forbiddenNames.includes(this.username.toLowerCase()) || 
        forbiddenNames.includes(this.email.toLowerCase())) {
      this.errorMessage = 'Este e-mail ou nome de usuário não pode ser utilizado.';
      return;
    }

    // 3. Verificar formato de e-mail (validação simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Formato de e-mail inválido.';
      return;
    }

    // 4. Verificar se as senhas coincidem
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    // 5. Sucesso
    this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para o login...';

    // Limpa o formulário (opcional)
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';

    // Redireciona para o login após 2 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}