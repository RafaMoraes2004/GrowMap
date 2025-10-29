import { Component, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements AfterViewInit {

  menuOpen = false;

  steps = [
    { icon: '📊', title: 'Relatórios Inteligentes', text: 'Tenha acesso a relatórios detalhados com dados sobre desempenho, produtividade e engajamento da equipe.' },
    { icon: '💡', title: 'Aprendizado Contínuo', text: 'Identifique lacunas de habilidades e receba sugestões de trilhas de aprendizado personalizadas.' },
    { icon: '🧠', title: 'Cultura Data-Driven', text: 'Baseie suas decisões em dados reais, fortalecendo a estratégia e o crescimento da empresa.' },
    { icon: '⚡', title: 'Automação de Processos', text: 'Reduza tarefas repetitivas e aumente a eficiência da equipe com fluxos de trabalho inteligentes.' },
    { icon: '🔒', title: 'Segurança de Dados', text: 'Garantimos a confidencialidade das informações da sua empresa com padrões elevados de segurança.' },
    { icon: '📈', title: 'Insights Estratégicos', text: 'Transforme dados em decisões estratégicas com painéis claros e fáceis de interpretar.' },
  ];

  partners = [
    { icon: '📢', title: 'Divulgação de Cursos', text: 'Divulgue seus cursos na nossa plataforma e alcance empresas que buscam capacitação contínua.' },
    { icon: '🎯', title: 'Cursos Personalizados', text: 'Crie cursos sob medida para nossa própria equipe e clientes, atendendo necessidades específicas.' },
    { icon: '🌐', title: 'Canal de Cursos', text: 'Acesse nosso canal exclusivo de cursos corporativos e aumente a visibilidade do seu conteúdo.' },
  ];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.checkFade();
  }

  toggleMenu() {
    if (!this.isBrowser) {
      this.menuOpen = !this.menuOpen;
      return;
    }

    this.menuOpen = !this.menuOpen;
    const nav = document.querySelector('.nav-center');
    const btn = document.querySelector('.hamburger');
    nav?.classList.toggle('open');
    btn?.classList.toggle('active');
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isBrowser) return;
    this.checkFade();
  }

  checkFade() {
    if (!this.isBrowser) return;

    const fadeElements = document.querySelectorAll<HTMLElement>('.fade-in');
    const triggerBottom = window.innerHeight * 0.9;

    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }
}