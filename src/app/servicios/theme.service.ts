import { Injectable, signal, effect, Inject} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  temaActual = signal<'light' | 'dark' | 'auto'>('auto');
  private readonly STORAGE_KEY = 'tema';
  private isBrowser = false;


  constructor( @Inject(PLATFORM_ID) private platformId: Object, 
                private cookieService: CookieService) {


    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return;

    this.cargarTemaGuardado();


    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', this.onSystemThemeChange.bind(this));
    }
    
    effect(() => {
      this.aplicarTema();
    });
  }

 private cargarTemaGuardado() {
    let tema: 'light' | 'dark' | 'auto' | null = null;

    const cookieValue = this.cookieService.get(this.STORAGE_KEY);
    if (cookieValue === 'light' || cookieValue === 'dark' || cookieValue === 'auto') {
      tema = cookieValue as any;
    }

    if (!tema) {
      const lsValue = localStorage.getItem(this.STORAGE_KEY);
      if (lsValue === 'light' || lsValue === 'dark' || lsValue === 'auto') {
        tema = lsValue as any;
      }
    }

    this.temaActual.set(tema ?? 'auto');

    this.aplicarTema();
  }

  setTema(tema: 'light' | 'dark' | 'auto') {
    this.temaActual.set(tema);



    this.cookieService.set(this.STORAGE_KEY, tema);

    localStorage.setItem(this.STORAGE_KEY, tema);
  }

  getTema() {
    return this.temaActual();
  }

  private onSystemThemeChange = (e: MediaQueryListEvent) => {
    if (this.temaActual() === 'auto') {
      this.aplicarTema();
    }
  };


  private aplicarTema() {
    if (!this.isBrowser) return;

    const tema = this.temaActual();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = tema === 'dark' || (tema === 'auto' && prefersDark);

    const root = document.documentElement;

    // Limpieza y aplicación limpia
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(isDark ? 'dark-theme' : 'light-theme');

    // Atributo data-theme (útil para tailwind, css vars, etc.)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  toggle() {
    const actual = this.temaActual();
    const nuevo = this.temaActual() === 'dark' ? 'light' : 'dark';
    this.setTema(nuevo);
  }
}