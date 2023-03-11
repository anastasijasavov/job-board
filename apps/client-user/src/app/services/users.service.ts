import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  User,
  UserCreateDto,
  UserSearchQueryDto,
  UserUpdateDto,
} from '@nbp-it-job-board/models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public loggedInUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    const user = window.localStorage.getItem('user');

    if (user != null) {
      this.loggedInUser$.next(JSON.parse(user));
    }

    this.loggedInUser$.subscribe((user) => {
      if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
      }
    });
  }

  getUser(id: string): Observable<User> {
    console.log(id);
    return this.http.get<User>(`${environment.API_URL}/users/${id}`);
  }

  search(dto: UserSearchQueryDto) {
    return this.http.post<User[]>(
      environment.API_URL + '/users/search',
      dto,
      environment.HTTP_OPTIONS
    );
  }

  login(email: string): Observable<User> {
    return this.http
      .post<User>(
        environment.API_URL + '/users/login',
        { email: email },
        environment.HTTP_OPTIONS
      )
      .pipe(
        tap((user) => {
          console.log(user);
          this.loggedInUser$.next(user);
        })
      );
  }

  register(dto: UserCreateDto): Observable<User> {
    console.log(dto);
    return this.http
      .post<User>(
        environment.API_URL + '/users/register',
        dto,
        environment.HTTP_OPTIONS
      )
      .pipe(tap((user) => this.loggedInUser$.next(user)));
  }

  logout() {
    window.localStorage.removeItem('user');
  }

  update(id: string, dto: UserUpdateDto): Observable<User> {
    return this.http
      .patch<User>(
        environment.API_URL + '/users/' + id,
        dto,
        environment.HTTP_OPTIONS
      )
      .pipe(tap((user) => this.loggedInUser$.next(user)));
  }

  delete(id: string) {
    return this.http.delete<User>(environment.API_URL + '/users/' + id);
  }
}
