import { Component, AfterViewInit, Inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';

type CommentItem = {
  author: string;
  date: string;
  text: string;
};

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class Feedback implements AfterViewInit {
  isBrowser = false;

  // rating + form state
  rating = 0;
  comment = '';
  feedbackMsg = '';

  // initial comments (from the static HTML)
  comments: CommentItem[] = [
    {
      author: 'Ohata - UI/UX Design',
      date: '05/09/2025',
      text: 'Achou a ideia ótima e sugeriu adiantar o back-end do projeto para evitar atrasos no próximo semestre, considerando a implementação futura da IA.'
    },
    {
      author: 'Face - SEBRAE',
      date: '20/09/2025',
      text: 'Apresentamos nossa ideia ao Face e recebemos feedbacks importantes sobre o que priorizar. A Nathalia sugeriu focar no tamanho das empresas e em um setor específico, começando pelo público corporativo. Também foi recomendado validar o problema diretamente com empresas e gerentes de RH para ter mais embasamento inicial.'
    },
    {
      author: 'Fabrício - Desenvolvimento Front-end',
      date: '18/10/2025',
      text: 'O projeto é grande, então é bom usar Angular no frontend. A ideia é consumir as APIs existentes, gerar um componente para cada tela e aproveitar bibliotecas prontas do Angular. O backend vai enviar os dados em JSON.'
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object, private host: ElementRef) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupHamburger();
    this.checkFade();
    // reforça após repaints / recursos lentos
    setTimeout(() => this.checkFade(), 120);
  }

  // Hamburger menu setup (scoped to component)
  private setupHamburger(): void {
    const hamburger: HTMLElement | null = this.host.nativeElement.querySelector('.hamburger');
    const navCenter: HTMLElement | null = this.host.nativeElement.querySelector('.nav-center');
    if (!hamburger || !navCenter) return;

    if (!(hamburger as any).__gx_hamb_setup) {
      hamburger.addEventListener('click', () => {
        navCenter.classList.toggle('open');
        hamburger.classList.toggle('active');
      });
      (hamburger as any).__gx_hamb_setup = true;
    }
  }

  setRating(n: number): void {
    this.rating = n;
  }

  onSubmit(): void {
    if (!this.isBrowser) return;

    if (this.rating === 0 && !this.comment.trim()) {
      this.feedbackMsg = 'Por favor, selecione uma nota ou escreva um comentário.';
      return;
    }

    const newComment: CommentItem = {
      author: 'Você',
      date: new Date().toLocaleDateString('pt-BR'),
      text: (this.comment || `Avaliação: ${this.rating}★`).trim()
    };

    // adiciona no topo da lista
    this.comments = [newComment, ...this.comments];

    // opcional: persistir no localStorage para testes locais
    try {
      const stored = JSON.parse(localStorage.getItem('growmap_feedback') || '[]');
      stored.unshift(newComment);
      localStorage.setItem('growmap_feedback', JSON.stringify(stored.slice(0, 50)));
    } catch {
      // ignore
    }

    // feedback ao usuário e reset do formulário
    this.feedbackMsg = 'Obrigado pelo seu feedback!';
    this.rating = 0;
    this.comment = '';
    // limpa mensagem depois de alguns segundos
    setTimeout(() => (this.feedbackMsg = ''), 4000);

    // garante que animações de fade sejam aplicadas
    setTimeout(() => this.checkFade(), 120);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.checkFade();
  }

  private checkFade(): void {
    if (!this.isBrowser) return;
    const fadeElements: NodeListOf<HTMLElement> = this.host.nativeElement.querySelectorAll('.fade-in');
    const triggerBottom = window.innerHeight * 0.9;

    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) el.classList.add('visible');
      else el.classList.remove('visible');
    });
  }
}