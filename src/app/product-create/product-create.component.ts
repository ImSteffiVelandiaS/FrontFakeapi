import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent {
  productForm: FormGroup;
  categories: any[] = []; // Lista de categorías

  constructor(private fb: FormBuilder, private productService: ProductService) {
    // Inicializa el formulario con validaciones
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      categoryId: [1, [Validators.required]],
      images: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]], // Validar que sea una URL
    });
  }
  ngOnInit(): void {
    // Carga las categorías desde la API
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
  
      // Asegúrate de que el campo de imagen sea una URL válida
      const imageUrl = formData.images.trim();
  
      if (!imageUrl.startsWith('http')) {
        alert('Por favor, proporciona una URL de imagen válida.');
        return;
      }
  
      // Verificar si la imagen es una cadena que parece un arreglo y convertirla a un arreglo
      try {
        // Intentamos convertir el valor de "images" si parece una cadena JSON
        formData.images = JSON.parse(imageUrl); // Convertir si es una cadena que representa un arreglo
      } catch (e) {
        // Si no es una cadena JSON válida, lo dejamos como un arreglo con una URL
        formData.images = [imageUrl];
      }
  
      // Llamamos al servicio para crear el producto
      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Producto creado con éxito:', response);
          alert('¡Producto creado con éxito!');
          this.productForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          alert('Hubo un error al intentar crear el producto.');
        },
      });
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
  
  
}