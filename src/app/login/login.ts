import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  standalone: true, 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
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
}