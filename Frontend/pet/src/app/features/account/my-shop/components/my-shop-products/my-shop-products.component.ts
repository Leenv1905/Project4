import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MOCK_PRODUCTS } from './mock-products';

@Component({
  standalone: true,
  selector: 'app-my-shop-products',
  imports: [CommonModule],
  templateUrl: './my-shop-products.component.html',
  styleUrls: ['./my-shop-products.component.scss']
})
export class MyShopProductsComponent {

  products = MOCK_PRODUCTS;
  router = inject(Router);
  route = inject(ActivatedRoute);
  selectedProduct: any = null;
  deleteProduct: any = null;

  addProduct(){

    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{ tab:'add-product' }
    });

  }

  editProduct(id:number){

    this.router.navigate([],{
      queryParams:{
        tab:'edit-product',
        id:id
      }
    });

  }

  openView(product:any){
    this.selectedProduct = product;
  }

  closeView(){
    this.selectedProduct = null;
  }

  openDelete(product:any){
    this.deleteProduct = product;
  }

  closeDelete(){
    this.deleteProduct = null;
  }

  confirmDelete(){
    console.log("delete", this.deleteProduct);
    this.deleteProduct = null;
  }
  openMenu:number | null = null;

  toggleMenu(id:number){

    if(this.openMenu === id){
      this.openMenu = null;
    }else{
      this.openMenu = id;
    }
  }
// Pagination
  page = 1;
  pageSize = 10;

  get total(){
    return this.products.length;
  }

  get totalPages(){
    return Math.ceil(this.total / this.pageSize);
  }

  get paginatedProducts(){

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.products.slice(start, end);
  }

  nextPage(){
    if(this.page < this.totalPages){
      this.page++;
    }
  }

  prevPage(){
    if(this.page > 1){
      this.page--;
    }
  }

  changePageSize(size:number){
    this.pageSize = size;
    this.page = 1;
  }

  protected readonly Math = Math;
}
