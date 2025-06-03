import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/product.service';
import { BranchService } from '../core/branch.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  branches: any[] = [];

  // 👇 Eliminamos branchId de newProduct
  newProduct = { name: '', description: '', cost: 0, price: 0, stock: 0 };

  editMode = false;
  productToEdit: any = {};

  isAdmin = false;

  constructor(
    private productService: ProductService,
    private branchService: BranchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUserData();
    this.isAdmin = user?.role === 'admin';

    this.loadProducts();
    this.loadBranches();
  }

  loadProducts() {
    console.log('📥 Cargando productos...');
    this.productService.getAll().subscribe({
      next: (res) => {
        console.log('📦 Productos recibidos:', res.data);
        this.products = res.data;
      },
      error: (err) => {
        console.error('❌ Error loading products:', err);
      }
    });
  }

  createProduct() {
    console.log('📤 Enviando producto:', this.newProduct);

    this.productService.create(this.newProduct).subscribe({
      next: () => {
        // 🔁 Reiniciar formulario sin branchId
        this.newProduct = { name: '', description: '', cost: 0, price: 0, stock: 0 };
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Error creating product:', err);
      }
    });
  }

  startEdit(product: any) {
    this.editMode = true;
    this.productToEdit = { ...product };
  }

  updateProduct() {
    if (!this.productToEdit || !this.productToEdit.id) {
      console.error('❌ Producto inválido para actualizar.');
      return;
    }

    const updatedFields: any = {
      name: this.productToEdit.name,
      cost: this.productToEdit.cost,
      price: this.productToEdit.price,
      stock: this.productToEdit.stock // ✅ Solo lo editable
    };

    console.log('📤 Actualizando producto ID:', this.productToEdit.id, 'con campos:', updatedFields);

    this.productService.update(this.productToEdit.id, updatedFields).subscribe({
      next: () => {
        console.log('✅ Producto actualizado correctamente');
        this.editMode = false;
        this.productToEdit = {};
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Error actualizando producto:', err);
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => {
          if (err.status === 403) {
            alert('⚠️ No tienes permisos para eliminar productos.');
          } else {
            console.error('❌ Error deleting product:', err);
            alert('❌ Ocurrió un error eliminando el producto.');
          }
        }
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.productToEdit = {};
  }

  loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (res) => {
        this.branches = res.data;
      },
      error: (err) => console.error('❌ Error cargando sedes:', err)
    });
  }
}
