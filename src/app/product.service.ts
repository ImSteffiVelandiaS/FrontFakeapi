import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';
  private categoriesUrl = 'https://api.escuelajs.co/api/v1/categories';

  constructor(private http: HttpClient) {}
  //crear producto
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }
   
  //obtener productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //eliminar producto
  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
  //modificar producto
  updateProduct(productId: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, productData);
  }

  // Obtener categorías
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriesUrl);
  }
}