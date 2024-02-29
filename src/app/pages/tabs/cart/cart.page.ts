import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  model: any = {};
  deliveryCharge = 20;

  constructor(private router: Router) {}

  ngOnInit() {
    this.getCartData();
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getCartData() {
    // carrega os dados la
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value); //parse => quebra o JSON
      console.log(this.model);
      this.calculate();
    }
  }

  async calculate() {
    // ASYNC => só termina quando o await for concluido/ evita q o carrinho quebre. (Para info cruciais)
    let item = this.model.items.filter((x) => x.quantity > 0);
    this.model.items = item;
    this.model.totalPrice = 0; //preco total dos pedidos
    this.model.totalItem = 0;
    this.model.deliverycharge = 0;
    this.model.grandTotal = 0; //preco total com a entrega
    item.forEach((element) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice +=
        parseFloat(element.price) * parseFloat(element.quantity);
    });
    this.model.deliverycharge = this.deliveryCharge;
    this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2); // pra ficar duas casas depois da virgula
    this.model.grandTotal = (
      parseFloat(this.model.totalPrice) + parseFloat(this.model.deliverycharge)
    ).toFixed(2); //preco total dos pedidos mais a entrega

    if (this.model.totalItem == 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart(); //limpa o carrinho
      this.model = 0; //zera o carrinho
    }
  }

  clearCart() {
    return Preferences.remove({ key: 'cart' });
  }

  quantityPlus(index) {}

  quantityMinus(index) {}

  addAddress() {}

  changeAddress() {}
}
