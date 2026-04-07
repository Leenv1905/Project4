import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone:true,
  selector:'app-add-product',
  imports:[CommonModule, FormsModule],
  templateUrl:'./add-product.component.html',
  styleUrls:['./add-product.component.scss']
})
export class AddProductComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  product = {
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

  uploadImages(event:any){

    const files = event.target.files;

    if(!files) return;

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

  saveDraft(){
    console.log(this.product);
  }

  publish(){
    console.log(this.product);
  }

  discard(){
    this.backToProducts();
  }

}
