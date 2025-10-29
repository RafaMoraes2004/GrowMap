import { Component, OnInit, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
// Import DatePipe para usar como tipo e como provider
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

// --- Interfaces de Dados ---
export interface ICourseHistory {
  id: string;
  courseName: string;
  status: 'completed' | 'in_progress';
  progress: number; // 0-100
  completionDate?: Date | null; 
}

export interface IRoadmapSuggestion {
  roadmapId: string;
  roadmapName: string;
  status: 'pending' | 'accepted' | 'rejected'; 
  suggestedDate: Date;
}

export interface IUser {
  id: string;
  name: string;
  role: string; 
  email: string;
  score: number; 
  entryDate: Date; 
  avatarUrl?: string; 
  courseHistory?: ICourseHistory[];
  suggestedRoadmaps?: IRoadmapSuggestion[]; 
}

export interface IAvailableRoadmap {
  id: string;
  name: string;
}
// --- Fim das Interfaces ---

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css'],
  standalone: true,
  imports: [
    CommonModule,     
    RouterModule,
    FormsModule, 
  ],
  // 👇👇👇 CORREÇÃO APLICADA AQUI 👇👇👇
  providers: [ DatePipe ] 
})
export class UsuariosComponent implements OnInit {

  // --- Lógica da Navbar e Tema ---
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
  isDarkMode = true; 
  mobileMenuOpen = false; 
  userName = 'Admin'; 
  userRole = 'Gerente TI'; 

  toggleTheme(): void { this.isDarkMode = !this.isDarkMode; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; } 
  // --- Fim da Lógica da Navbar ---

  // --- Estado do Componente ---
  users: IUser[] = []; 
  filteredUsers: IUser[] = []; 
  selectedUser: IUser | null = null; 

  // Filtros e Busca
  searchTerm: string = '';
  sectors: string[] = ['Todos', 'TI', 'RH', 'Suporte', 'Design']; 
  selectedSector: string = 'Todos';

  // Controle de Modals/Painéis
  showAddUserModal: boolean = false;
  showRemoveUserModal: boolean = false;
  showSuggestRoadmapPanel: boolean = false;
  
  // Dados para Modals/Painéis
  newUser: Partial<IUser> & { password?: string } = { name: '', role: '', email: '', entryDate: new Date() }; 
  userToRemove: IUser | null = null;
  availableRoadmaps: IAvailableRoadmap[] = []; 
  isBrowser: boolean; 

  constructor(
    private datePipe: DatePipe, // Injeção continua aqui
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
     this.isBrowser = isPlatformBrowser(this.platformId); 
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.filterUsers(); 
  }

  loadInitialData(): void {
    const today = new Date();
    this.users = [
      { id: 'u1', name: 'Kauan Davi', role: 'Analista de TI', email: 'kauan.davi@email.com', score: 75, entryDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()), courseHistory: [ { id:'h1', courseName: 'Java Avançado', status: 'completed', progress: 100, completionDate: new Date(2024, 9, 10) }, { id:'h2', courseName: 'Excel Profissional', status: 'in_progress', progress: 85, completionDate: null } ], suggestedRoadmaps: [] },
      { id: 'u2', name: 'Larissa Lima', role: 'Desenvolvedora Frontend', email: 'larissa.lima@email.com', score: 92, entryDate: new Date(today.getFullYear() - 1, today.getMonth() - 3, today.getDate()), courseHistory: [], suggestedRoadmaps: [] },
      { id: 'u3', name: 'Rafael Souza', role: 'Analista de BI', email: 'rafael.souza@email.com', score: 88, entryDate: new Date(today.getFullYear() - 0, today.getMonth() - 6, today.getDate()), courseHistory: [], suggestedRoadmaps: [{ roadmapId: 'rm-jf', roadmapName: 'Java Fullstack', status: 'pending', suggestedDate: new Date() }] },
      { id: 'u4', name: 'Gabriel Alves', role: 'Designer UI/UX', email: 'gabriel.alves@email.com', score: 65, entryDate: new Date(today.getFullYear() - 3, today.getMonth() + 2, today.getDate()), courseHistory: [], suggestedRoadmaps: [] },
      { id: 'u5', name: 'Lucas Martins', role: 'Suporte Técnico', email: 'lucas.martins@email.com', score: 80, entryDate: new Date(today.getFullYear() - 1, today.getMonth() - 1, today.getDate()), courseHistory: [], suggestedRoadmaps: [] }
    ];
    this.availableRoadmaps = [ { id: 'rm-jf', name: 'Java Fullstack' }, { id: 'rm-py-ds', name: 'Python Data Science' }, { id: 'rm-fe', name: 'Frontend Essencial' }, { id: 'rm-ux', name: 'UX Design Pro' } ];
  }

  filterUsers(): void {
    let tempUsers = [...this.users];
    if (this.selectedSector !== 'Todos') {
      tempUsers = tempUsers.filter(user => 
        (this.selectedSector === 'TI' && (user.role.includes('Analista') || user.role.includes('Desenvolvedor'))) ||
        (this.selectedSector === 'RH' && user.role.includes('RH')) ||
        (this.selectedSector === 'Suporte' && user.role.includes('Suporte')) ||
        (this.selectedSector === 'Design' && user.role.includes('Design'))
      );
    }
    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      tempUsers = tempUsers.filter(user =>
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        user.role.toLowerCase().includes(lowerTerm)
      );
    }
    this.filteredUsers = tempUsers;
  }

  calculateTenure(entryDate: Date): string {
    const now = new Date(); const entry = new Date(entryDate); let years = now.getFullYear() - entry.getFullYear(); let months = now.getMonth() - entry.getMonth(); if (months < 0) { years--; months += 12; } let result = ''; if (years > 0) { result += `${years} ano${years > 1 ? 's' : ''}`; } if (months > 0) { if (result) result += ' e '; result += `${months} mes${months > 1 ? 'es' : ''}`; } return result || 'Menos de um mês';
  }

  viewProfile(user: IUser): void { this.selectedUser = user; }
  goBackToList(): void { this.selectedUser = null; }

  openAddUserModal(): void { this.newUser = { name: '', role: '', email: '', entryDate: new Date() }; this.showAddUserModal = true; }
  closeAddUserModal(): void { this.showAddUserModal = false; }
  addUser(): void { if (this.newUser.name && this.newUser.role && this.newUser.email && this.newUser.entryDate) { const newUserToAdd: IUser = { id: `u${this.users.length + 1}`, name: this.newUser.name, role: this.newUser.role, email: this.newUser.email, entryDate: new Date(this.newUser.entryDate), score: 0, courseHistory: [], suggestedRoadmaps: [] }; this.users.push(newUserToAdd); this.filterUsers(); this.closeAddUserModal(); console.log('Usuário adicionado:', newUserToAdd); } else { alert('Por favor, preencha todos os campos obrigatórios.'); } }

  openRemoveUserModal(user: IUser): void { this.userToRemove = user; this.showRemoveUserModal = true; }
  closeRemoveUserModal(): void { this.userToRemove = null; this.showRemoveUserModal = false; }
  removeUser(): void { if (this.userToRemove) { this.users = this.users.filter(u => u.id !== this.userToRemove!.id); if (this.selectedUser?.id === this.userToRemove.id) { this.goBackToList(); } this.filterUsers(); console.log('Usuário removido:', this.userToRemove.name); this.closeRemoveUserModal(); } }

  openSuggestRoadmapPanel(): void { this.showSuggestRoadmapPanel = true; }
  closeSuggestRoadmapPanel(): void { this.showSuggestRoadmapPanel = false; }
  suggestRoadmap(roadmap: IAvailableRoadmap): void { if (this.selectedUser) { const alreadySuggested = this.selectedUser.suggestedRoadmaps?.some(s => s.roadmapId === roadmap.id); if (!alreadySuggested) { const newSuggestion: IRoadmapSuggestion = { roadmapId: roadmap.id, roadmapName: roadmap.name, status: 'pending', suggestedDate: new Date() }; if (!this.selectedUser.suggestedRoadmaps) { this.selectedUser.suggestedRoadmaps = []; } this.selectedUser.suggestedRoadmaps.push(newSuggestion); console.log(`Roadmap "${roadmap.name}" sugerido para ${this.selectedUser.name}`); } else { console.log(`Roadmap "${roadmap.name}" já foi sugerido.`); } this.closeSuggestRoadmapPanel(); } }
}