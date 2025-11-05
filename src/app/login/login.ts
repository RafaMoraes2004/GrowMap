import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-login',
  // Adicionar FormsModule e CommonModule aos imports
  imports: [RouterLink, FormsModule, CommonModule], 
  standalone: true, 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {

  // --- Nossas propriedades para o login ---
  email: string = ''; // Armazena o valor do campo de e-mail/login
  password: string = ''; // Armazena o valor do campo de senha
  errorMessage: string | null = null; // Armazena a mensagem de erro

  // Injetar o Router no construtor
  constructor(private router: Router) {}
  // ----------------------------------------

  ngAfterViewInit() {
    // Verifica se está no navegador antes de usar o DOM
    if (typeof document !== 'undefined') {
      const video = document.getElementById('bg-video') as HTMLVideoElement;

      if (video) {
        video.play().catch((error) => {
          console.warn('Autoplay bloqueado pelo navegador:', error);

          // Tenta tocar após clique do usuário
          document.body.addEventListener('click', () => {
            video.play().catch((e) => {
              console.error('Falha ao tocar após clique:', e);
            });
          }, { once: true });
        });
      }
    }
  }

  // --- Nosso método de login ---
  handleLogin() {
    this.errorMessage = null; // Limpa erros anteriores

    if (this.email === 'admin' && this.password === '123') {
      // Login de usuário padrão
      this.router.navigate(['/dashboard']);

    } else if (this.email === 'adminEmpresa' && this.password === '1234') {
      // Login de usuário empresa
      // Assumi que a rota seria '/dashboardEmpresa', altere se for outra
      this.router.navigate(['/dashboardEmpresa']); 

    } else {
      // Credenciais erradas
      this.errorMessage = 'E-mail ou senha incorretos.';
    }
  }
  // -----------------------------
}