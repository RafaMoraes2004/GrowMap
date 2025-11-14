import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule

// [IMPORTANTE] Importe seu cliente Supabase aqui.
// O caminho 'src/supabase-client' é um exemplo,
// ajuste para o local correto onde você inicializou o cliente no seu projeto.
import { supabase } from '../../supabase';

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
    // (Este seu código original está mantido)
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

  // --- Nosso método de login ATUALIZADO para Supabase ---
  async handleLogin() {
    this.errorMessage = null; // Limpa erros anteriores

    try {
      // Tenta fazer o login com Supabase usando os dados do formulário
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        // Se o Supabase retornar um erro (ex: senha errada)
        console.error('Erro no login:', error.message);
        // Usamos a sua div de erro para mostrar a falha
        this.errorMessage = 'E-mail ou senha incorretos.';
      
      } else {
        // Login bem-sucedido
        console.log('Usuário logado com sucesso:', data.user);
        
        // [NOTA] A imagem redirecionava para '/catalog'.
        // Mantive o redirecionamento do seu código original para '/dashboard'.
        // Altere se o destino for outro.
        this.router.navigate(['/dashboard']);
      }

    } catch (error: any) {
      // Captura outros erros (ex: rede ou falha inesperada)
      console.error('Erro inesperado no login:', error);
      this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }
  // ---------------------------------------------------
}