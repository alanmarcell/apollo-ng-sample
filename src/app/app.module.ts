import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HttpClient } from './httpClient';
import { HttpClient2 } from './httpClient2';
import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailComponent } from './components/productDetail/product-detail.component';

import { LoggedInGuard } from './guards/loggedIn.guard';


import { ApolloModule } from 'apollo-angular';

import { provideClient } from './apolloClient';
import { ProductService } from './services/product.service';
import { ProductService2 } from './services/product2.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    BrowserModule,
    ApolloModule.forRoot(provideClient),
    HttpModule,
    FormsModule,
    routing,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    ProductDetailComponent,
    ProductsComponent
  ],
  providers: [
    AuthService,
    ProductService,
    ProductService2,
    UserService,
    HttpClient,
    HttpClient2,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }