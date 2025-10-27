import { Component, AfterViewInit, Inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sobre.html',
  styleUrls: ['./sobre.css']
})
export class Sobre implements AfterViewInit {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private host: ElementRef) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.setupHamburger();
    this.checkFade();
    setTimeout(() => this.checkFade(), 120);
  }

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