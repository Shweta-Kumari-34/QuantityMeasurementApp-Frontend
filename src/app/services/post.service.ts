import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  content: string;
  userEmail: string;
  mediaUrls: string[];
  postType: string;
  visibility: string;
  likeCount: number;
  commentCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostPayload {
  title: string;
  content: string;
  visibility?: string;
  mediaUrls?: string[];
  postType?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {

  private readonly API_URL = '/posts';

  constructor(private http: HttpClient) {}

  createPost(post: PostPayload): Observable<Post> {
    return this.http.post<Post>(`${this.API_URL}/create`, post);
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/all`);
  }

  getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/feed`);
  }

  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/my`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.API_URL}/${id}`);
  }

  getPostsByUser(userEmail: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/user/${userEmail}`);
  }

  updatePost(id: number, post: PostPayload): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/${id}`, post);
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/${id}`, { responseType: 'text' });
  }

  searchPosts(keyword: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/search?q=${keyword}`);
  }

  getPostCount(userEmail: string): Observable<any> {
    return this.http.get(`${this.API_URL}/count/${userEmail}`);
  }
}
