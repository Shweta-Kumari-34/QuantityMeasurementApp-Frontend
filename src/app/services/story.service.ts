import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Story {
  id: number;
  userEmail: string;
  mediaUrl: string;
  caption: string;
  mediaType: string;
  viewsCount: number;
  active: boolean;
  createdAt: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class StoryService {

  private readonly API_URL = '/media';

  constructor(private http: HttpClient) {}

  createStory(mediaUrl: string, caption: string): Observable<Story> {
    return this.http.post<Story>(`${this.API_URL}/stories?mediaUrl=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(caption)}`, {});
  }

  getActiveStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.API_URL}/stories/active`);
  }

  getUserStories(userEmail: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.API_URL}/stories/user/${userEmail}`);
  }

  viewStory(id: number): Observable<string> {
    return this.http.post(`${this.API_URL}/stories/${id}/view`, {}, { responseType: 'text' });
  }

  deleteStory(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/stories/${id}`, { responseType: 'text' });
  }

  commentOnStory(id: number, content: string): Observable<string> {
    return this.http.post(`${this.API_URL}/stories/${id}/comment?content=${encodeURIComponent(content)}`, {}, { responseType: 'text' });
  }
}
