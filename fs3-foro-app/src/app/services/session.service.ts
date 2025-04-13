import { Injectable } from '@angular/core';
import { UserDTO } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private user: UserDTO | null = null;

  setUser(user: UserDTO): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UserDTO | null {
    if (!this.user) {
      const data = localStorage.getItem('user');
      this.user = data ? JSON.parse(data) : null;
    }
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
  }

  findUserByCredentials(username: string, password: string): UserDTO | null {
    const users = this.getAllUsers();
    const found = users.find(u => u.username === username && u.password === password);
    return found || null;
  }
  

  getAllUsers(): UserDTO[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  saveUserToList(user: UserDTO): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  usernameExists(username: string): boolean {
    return this.getAllUsers().some(u => u.username === username);
  }

  getUsersList(): UserDTO[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  
  saveUsersList(users: UserDTO[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }
  

}

