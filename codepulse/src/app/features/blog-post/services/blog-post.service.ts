import { Injectable } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(private http: HttpClient) { }

    createBlogPost(data: AddBlogPost ) : Observable<BlogPost> {
      return this.http.post<BlogPost>(`${environment.apiBaseUrl}/api/blogposts?addAuth=true`,data);
    }
    
    getAllBlogPosts(query?: string, sortBy?: string, shortDirection?: string, pageNumber?: number, pageSize?: number  ): Observable<BlogPost[]> {
      let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (shortDirection) {
      params = params.set('shortDirection', shortDirection);
    }
    if (pageNumber) {
      params = params.set('pageNumber', pageNumber.toString());
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }
      return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogposts`, { params: params });
    }

    getBlogPostById(id:string):Observable<BlogPost> {
      return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}`);
    }

    updateBlogPost(id:string, updateBlogPost:UpdateBlogPost) : Observable<BlogPost> {
      return this.http.put<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`, updateBlogPost);
    }

    deleteBlogPost(id: string): Observable<BlogPost> {
      return this.http.delete<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`);
    }

    getBlogPostByUrlHandle(urlHandle:string):Observable<BlogPost> {
      return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${urlHandle}`);
    }

    getBlogPostCount(): Observable<number> {
      return this.http.get<number>(`${environment.apiBaseUrl}/api/blogposts/count`);
    }
    

}
