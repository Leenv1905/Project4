import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone:true,
  selector:'app-edit-product',
  imports:[CommonModule, FormsModule],
  templateUrl:'./edit-product.component.html',
  styleUrls:['../add-product/add-product.component.scss']
  // Sử dụng css của ADD
})
export class EditProductComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  product = {
    id:'',
    name:'',
    breed:'',
    age:'',
    price:'',
    discountPrice:'',
    sku:'',
    description:'',
    category:'',
    vendor:'',
    inStock:true
  };

  images:string[] = [];

  ngOnInit(){

    const id = this.route.snapshot.queryParamMap.get('id');

    this.loadMockProduct(id);

  }

  loadMockProduct(id:any){

// mock data
    this.product = {
      id:id,
      name:'Golden Retriever',
      breed:'Golden',
      age:'6',
      price:'1200',
      discountPrice:'1000',
      sku:'DOG-123',
      description:'Friendly and healthy puppy',
      category:'Dog',
      vendor:'Happy Puppy Shop',
      inStock:true
    };

    this.images = [
      '/assets/demo/dog1.jpg',
      '/assets/demo/dog2.jpg'
    ];

  }

  uploadImages(event:any){

    const files = event.target.files;

    for(let file of files){

      const reader = new FileReader();

      reader.onload = () => {
        this.images.push(reader.result as string);
      };

      reader.readAsDataURL(file);

    }

  }

  removeImage(index:number){
    this.images.splice(index,1);
  }

  backToProducts(){

    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{ tab:'products' }
    });

  }

  updateProduct(){
    console.log('update',this.product);
  }

}
