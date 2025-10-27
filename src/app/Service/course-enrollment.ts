import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Torna o serviço um singleton disponível em toda a aplicação
})
export class CourseEnrollmentService {

  private readonly localStorageKey = 'enrolledCourseIds';

  // Usamos um BehaviorSubject para que os componentes possam "ouvir" as mudanças
  private enrolledIdsSubject = new BehaviorSubject<Set<string>>(this.loadFromLocalStorage());
  
  // Exponha o Set como um Observable para os componentes
  enrolledIds$: Observable<Set<string>> = this.enrolledIdsSubject.asObservable();

  constructor() { }

  /**
   * Inscreve o usuário em um curso (adiciona o ID).
   */
  enroll(courseId: string): void {
    const currentIds = this.enrolledIdsSubject.getValue();
    if (!currentIds.has(courseId)) {
      const newIds = new Set(currentIds); // Cria uma nova cópia
      newIds.add(courseId);
      this.enrolledIdsSubject.next(newIds); // Emite o novo Set
      this.saveToLocalStorage(newIds);
      console.log(`Enrolled in course: ${courseId}`);
    }
  }

  /**
   * Verifica se o usuário está inscrito em um curso específico.
   * Retorna true/false diretamente, pois o BehaviorSubject tem o valor atual.
   */
  isEnrolled(courseId: string): boolean {
    return this.enrolledIdsSubject.getValue().has(courseId);
  }

  /**
   * Retorna o Set atual de IDs inscritos (para uso inicial).
   */
  getEnrolledCourseIds(): Set<string> {
    return this.enrolledIdsSubject.getValue();
  }

  /**
   * Salva os IDs no localStorage.
   */
  private saveToLocalStorage(ids: Set<string>): void {
    try {
      const idsArray = Array.from(ids);
      localStorage.setItem(this.localStorageKey, JSON.stringify(idsArray));
    } catch (error) {
      console.error("Error saving enrollment to localStorage:", error);
    }
  }

  /**
   * Carrega os IDs do localStorage na inicialização.
   */
  private loadFromLocalStorage(): Set<string> {
    try {
      const storedIds = localStorage.getItem(this.localStorageKey);
      if (storedIds) {
        const idsArray = JSON.parse(storedIds);
        // Garante que é um array antes de criar o Set
        if (Array.isArray(idsArray)) {
          return new Set<string>(idsArray);
        }
      }
    } catch (error) {
      console.error("Error loading enrollment from localStorage:", error);
      // Em caso de erro (ex: JSON inválido), retorna um Set vazio
    }
    return new Set<string>(); // Retorna um Set vazio se não houver nada ou der erro
  }
}