import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../core/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  productId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.product = res.data.find((p: any) => p.id === this.productId);
        if (!this.product) {
          alert('Producto no encontrado.');
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        console.error('❌ Error loading product:', err);
      }
    });
  }
}
