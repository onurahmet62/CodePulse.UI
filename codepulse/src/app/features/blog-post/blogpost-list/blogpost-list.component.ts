import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit {
 
  blogPosts$?: Observable<BlogPost[]>; 
  totalCount?: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 5;
  sortBy: string = 'title'; // Varsayılan sıralama kriteri
  shortDirection: string = 'asc'; // Varsayılan sıralama yönü

  constructor(private blogPostService: BlogPostService) {

    

  }

  ngOnInit(): void {
    
    this.loadBlogPost();

  }

  loadBlogPost(): void {
    this.blogPostService.getBlogPostCount().subscribe({
      next: (value) => {
        this.totalCount = value;
        this.list = new Array(Math.ceil(value / this.pageSize)).fill(0).map((x, i) => i + 1);
        this.getPage(this.pageNumber);
      }
    });
  }

  onSearch(query: string): void {
    this.pageNumber = 1;
    this.blogPostService.getAllBlogPosts(query, this.sortBy, this.shortDirection, this.pageNumber, this.pageSize)
        .subscribe(blogPosts => this.blogPosts$ = of(blogPosts));
}

  sort(sortBy: string): void {
    if (this.sortBy === sortBy) {
        this.shortDirection = this.shortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        this.sortBy = sortBy;
        this.shortDirection = 'asc';
    }
    this.pageNumber = 1;
    this.getPage(this.pageNumber);
}


  getPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.blogPosts$ = this.blogPostService.getAllBlogPosts(undefined, this.sortBy, this.shortDirection, this.pageNumber, this.pageSize);
  }
  getNextPage(): void {
    if (this.pageNumber + 1 > this.list.length) {
        return;
    }
    this.pageNumber += 1;
    this.getPage(this.pageNumber);
}

getPrevPage(): void {
    if (this.pageNumber - 1 < 1) {
        return;
    }
    this.pageNumber -= 1;
    this.getPage(this.pageNumber);
}


 
}
