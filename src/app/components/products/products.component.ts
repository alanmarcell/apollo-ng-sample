import { Component, OnInit, OnChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductService2 } from '../../services/product2.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import R from 'ramda';

// We use the gql tag to parse our query string into a query document
const Products = gql`
  query Products {
    viewer{
      prods{
        edges{
          node{
            name
            price
            category
          }
        }
      }
    }
  }
`;

interface Node {
  node: {
    _id: string,
    name: string,
    price: number,
    category: string
  }
}


interface QueryResponse {
  viewer: {
    prods: {
      edges: Node[]
    }
  }
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})

export class ProductsComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product;
  message = '';
  error: any;

  constructor(
    private router: Router,
    private productService: ProductService,
    private productService2: ProductService2,
    private apollo: Apollo) { }


  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: Products
    }).subscribe(({ data }) => {
      data.viewer.prods.edges.map(edge => {
        this.products.push(edge.node)
      })
    });
  }

  onSelect(product: Product) { this.selectedProduct = product; }

  gotoDetail(selectedProduct: Product) {
    this.router.navigate(['/productDetail', selectedProduct._id]);
  }

  addProduct() {
    this.selectedProduct = null;
    this.router.navigate(['/productDetail', 'new']);
  }

  deleteProduct(product: Product, event: any) {
    event.stopPropagation();
    this.productService
      .delete(product)
      .then(res => {
        this.products = this.products.filter(h => h !== product);
        if (this.selectedProduct === product) { this.selectedProduct = null; }
        this.message = 'Product deleted';
      })
      .catch(error => this.error = error);
  }
}
