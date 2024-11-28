import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Lista de productos
  editingProduct: any = null; // Producto en edición

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(); // Cargar productos al iniciar
  }

  getFirstImage(images: string[]): string {
    try {
      // Intentar parsear JSON si es una cadena errónea
      const parsedImages = JSON.parse(images[0]);
      const imageUrl = Array.isArray(parsedImages) ? parsedImages[0] : parsedImages;
      return this.fixImgurUrl(imageUrl);
    } catch {
      // Si no es necesario parsear, arreglar directamente la URL
      return this.fixImgurUrl(images[0]);
    }
  }
  
  // Método para arreglar las URLs de Imgur
  fixImgurUrl(url: string): string {
    if (url.includes('imgur.com') && !url.match(/\.(jpg|png|gif)$/)) {
      return url + '.jpg'; // Añadir .jpg si no tiene extensión
    }
    return url;
  }
  
  // Manejo de errores al cargar imágenes
  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/640x480?text=No+Image';
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Producto eliminado con éxito.');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        },
      });
    }
  }

  startEditing(product: any): void {
   // console.log('Producto en edición:', product); // Verifica que el producto sea correcto
    this.editingProduct = { ...product };  // Asegúrate de que se esté copiando correctamente
    //console.log('editingProduct actualizado:', this.editingProduct); // Verifica el valor de editingProduct
  }
  

  saveProduct(): void {
    if (this.editingProduct) {
      // Convertir "images" en un arreglo si no lo es
      if (typeof this.editingProduct.images === 'string') {
        this.editingProduct.images = [this.editingProduct.images];
      }

      // Actualizar producto usando el servicio
      this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
        next: () => {
          alert('Producto actualizado con éxito.');
          this.editingProduct = null; // Cerrar formulario de edición
          this.loadProducts(); // Recargar lista de productos
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
          alert('Hubo un error al actualizar el producto.');
        },
      });
    }
  }

  cancelEditing(): void {
    this.editingProduct = null; // Cancelar la edición
  }
}
