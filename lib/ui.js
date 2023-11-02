import { formatNumber } from './helpers.js';

export function createCartLine(product, quantity, updateCartTotal) {
  // TODO útfæra þannig að búin sé til lína í körfu á forminu:

  /*
  <tr data-cart-product-id="1">
    <td>HTML húfa</td>
    <td>1</td>
    <td><span class="price">5.000 kr.-</span></td>
    <td><span class="price">5.000 kr.-</span></td>
    <td>
      <form class="remove" method="post">
        <button>Eyða</button>
      </form>
    </td>
  </tr>
  */

  const cartLineElement = document.createElement('tr');
  cartLineElement.setAttribute('data-cart-product-id', product.id);

  const titleCell = document.createElement('td');
  titleCell.textContent = product.title;

  const quantityCell = document.createElement('td');
  quantityCell.textContent = quantity;

  const priceCell = document.createElement('td');
  const priceSpan = document.createElement('span');
  priceSpan.classList.add('price');
  priceSpan.textContent = formatNumber(product.price);
  priceCell.appendChild(priceSpan);

  const totalCell = document.createElement('td');
  const totalSpan = document.createElement('span');
  totalSpan.classList.add('price');
  totalSpan.textContent = formatNumber(product.price * quantity);
  totalCell.appendChild(totalSpan);

    // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu
  const removeCell = document.createElement('td');
  const removeForm = document.createElement('form');
  removeForm.classList.add('remove');
  removeForm.method = 'post';
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Eyða';

  removeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    cartLineElement.remove();
    updateCartTotal();
  });

  const totalSumCell = document.createElement('td');
  const totalSumSpan = document.createElement('span');
  totalSumSpan.classList.add('price');
  totalSumSpan.textContent = formatNumber(product.price * quantity); 
  totalSumCell.appendChild(totalSumSpan);

  removeForm.appendChild(removeButton);
  removeCell.appendChild(removeForm);

  cartLineElement.appendChild(titleCell);
  cartLineElement.appendChild(quantityCell);
  cartLineElement.appendChild(priceCell);
  cartLineElement.appendChild(totalCell);
  cartLineElement.appendChild(removeCell);

  return cartLineElement;
}

export function updateCartTotal() {
  const totalSumSpan = document.querySelector('.totalsumprice');
  if (totalSumSpan) {
    let totalSum = 0;
    const cartItems = document.querySelectorAll('.addToCart tr');
    cartItems.forEach((item) => {
      const price = parseInt(item.querySelector('td:nth-child(3) span.price').textContent.replace('.', ''), 10);
      const quantity = parseInt(item.querySelector('td:nth-child(2)').textContent, 10);
      totalSum += price * quantity;
    });
    totalSumSpan.textContent = formatNumber(totalSum);
  }
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
    // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.cart-content');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}
