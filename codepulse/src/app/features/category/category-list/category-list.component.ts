import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories$?: Observable<Category[]>;
  totalCount?: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 7;
  sortBy: string = 'name'; // Varsayılan sıralama kriteri
  shortDirection: string = 'asc'; // Varsayılan sıralama yönü

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoryCount().subscribe({
      next: (value) => {
        this.totalCount = value;
        this.list = new Array(Math.ceil(value / this.pageSize)).fill(0).map((x, i) => i + 1);
        this.getPage(this.pageNumber);
      }
    });
  }

  onSearch(query: string): void {
    this.getPage(1); // Yeni arama yapıldığında ilk sayfaya dön
    this.categories$ = this.categoryService.getAllCategories(query, this.sortBy, this.shortDirection, this.pageNumber, this.pageSize);
  }

  sort(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.shortDirection = this.shortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.shortDirection = 'asc';
    }
    this.getPage(this.pageNumber);
  }

  getPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.categories$ = this.categoryService.getAllCategories(undefined, this.sortBy, this.shortDirection, this.pageNumber, this.pageSize);
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
