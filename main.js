import { createCartLine, showCartContent, updateCartTotal } from './lib/ui.js';
import { formatNumber } from './lib/helpers.js';

const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

let cartItems = {};
/** Bæta vöru í körfu */
function addProductToCart(product, quantity) {
  const productId = product.id;
  const cartItemElement = document.querySelector(`.addToCart tr[data-cart-product-id="${productId}"]`);

  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  if (cartItemElement) {
    const quantityCell = cartItemElement.querySelector('td:nth-child(2)');
    const totalCell = cartItemElement.querySelector('td:nth-child(4) span.price');

    if (quantityCell && totalCell) {
      quantityCell.textContent = parseInt(quantityCell.textContent) + quantity;
      const newTotalPrice = product.price * parseInt(quantityCell.textContent);
      totalCell.textContent = formatNumber(newTotalPrice);
    }
  } else {
    cartItems[productId] = quantity;
    const cart = document.querySelector('.addToCart');
    const cartLine = createCartLine(product, quantity, updateCartTotal);
    cart.appendChild(cartLine);
  }

  // Sýna efni körfu
  showCartContent(true);
  // TODO sýna/uppfæra samtölu körfu
  updateCartTotal();
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();

  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr');

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantity = parseInt(parent.querySelector('.quantityInput').value);
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add');

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// TODO bæta við event handler á form sem submittar pöntun
const completePurchaseBtn = document.getElementById('completePurchaseBtn');

completePurchaseBtn.addEventListener('click', function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;

  const cartItems = document.querySelectorAll('.addToCart tr');

  let receiptContent = `<h2>Kvittun</h2>`;
  receiptContent += `<p>Nafn: ${name}</p>`;
  receiptContent += `<p>Heimilisfang: ${address}</p>`;
  receiptContent += `<table><thead><tr><th>Heiti</th><th>Fjöldi</th><th>Verð</th></tr></thead><tbody>`;

  let totalSum = 0;
  cartItems.forEach((item) => {
    const productName = item.querySelector('td:nth-child(1)').textContent;
    const quantity = parseInt(item.querySelector('td:nth-child(2)').textContent);
    const price = parseInt(item.querySelector('td:nth-child(3) span.price').textContent.replace('.', ''), 10);
    const totalPrice = price * quantity;
    totalSum += totalPrice;

    receiptContent += `<tr><td>${productName}</td><td>${quantity}</td><td>${formatNumber(totalPrice)}</td></tr>`;
  });

  receiptContent += `</tbody></table>`;
  receiptContent += `<p><strong>Samtals: ${formatNumber(totalSum)}</strong></p>`;
  receiptContent += `<p><a href=".">Kaupa meira</a>.</p>`;

  const receiptSection = document.querySelector('.receipt');
  receiptSection.innerHTML = receiptContent;

  showCartContent(false);
  receiptSection.querySelector('p').textContent = `Takk fyrir að versla hjá okkur, ${name}!`;

  document.querySelector('.addToCart').innerHTML = '';

  updateCartTotal();
});
