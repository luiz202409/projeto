// script-carrinho.js
// Responsável pela página Carrinho (carrinho.html). Depende de data.js.

// === 1. VARIÁVEIS DE CONFIGURAÇÃO ===
const WHATSAPP_NUMBER = '5513997679355'; 
const HOME_LINK = 'index.html';

// === 2. FUNÇÕES DE MANIPULAÇÃO DO CARRINHO ===

function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== parseInt(productId));
    
    saveCart(cart); 
    renderCart();   
}

function updateQuantity(productId, action) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === parseInt(productId));

    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].qty += 1;
        } else if (action === 'decrease' && cart[itemIndex].qty > 1) {
            cart[itemIndex].qty -= 1;
        } else if (action === 'decrease' && cart[itemIndex].qty === 1) {
            removeItem(productId);
            return;
        }
        
        saveCart(cart); 
        renderCart();   
    }
}

// === 3. FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO ===

function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const statusMessage = document.getElementById('status-message');
    const subtotalElement = document.getElementById('subtotal-value');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
    const cart = getCart();
    
    cartItemsList.innerHTML = '';
    let subtotal = 0;

    // LÓGICA DE MENSAGEM: Carrinho Vazio ou Cheio
    if (cart.length === 0) {
        statusMessage.innerHTML = `<p style="text-align: center; padding: 20px; color: #666;">🛒 Seu carrinho está vazio. Volte para a <a href="${HOME_LINK}" style="color: var(--primary-color);">Home</a> para adicionar produtos.</p>`;
        subtotalElement.textContent = 'R$ 0,00';
        totalElement.textContent = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return; 
    } else {
        statusMessage.innerHTML = `<p style="text-align: center; padding: 10px 0; color: #388e3c; font-weight: bold;">🎉 Seus ${cart.length} itens estão no carrinho! Finalize sua compra!</p>`;
        checkoutBtn.disabled = false;
    }

    
    // RENDERIZAÇÃO DOS ITENS
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const formattedPrice = item.price.toFixed(2).replace('.', ',');
        const formattedItemTotal = itemTotal.toFixed(2).replace('.', ',');

        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${PRODUCTS.find(p => p.id === item.id)?.images[0] || 'img/produto-exemplo.jpg'}" alt="${item.name}">
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    <p>Preço Unit.: R$ ${formattedPrice}</p>
                    <p style="font-weight: bold;">Subtotal: R$ ${formattedItemTotal}</p>
                </div>
                
                <div class="item-quantity">
                    <button class="update-qty" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.qty}</span>
                    <button class="update-qty" data-id="${item.id}" data-action="increase">+</button>
                </div>
                
                <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsList.innerHTML += cartItemHTML;
    });

    const totalGeral = subtotal; 
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    totalElement.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

    addCartEventListeners();
}

function addCartEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => removeItem(e.currentTarget.dataset.id));
    });
    
    document.querySelectorAll('.update-qty').forEach(button => {
        button.addEventListener('click', (e) => updateQuantity(
            e.currentTarget.dataset.id,
            e.currentTarget.dataset.action
        ));
    });
}

// === 4. FUNÇÃO DE CHECKOUT VIA WHATSAPP ===
function generateWhatsappLink() {
    const cart = getCart();
    if (cart.length === 0) return;

    let message = "🛍️ *NOVO PEDIDO DE COMPRA - SHOPERUIBE* 🛍️\n\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        message += `${index + 1}. *${item.name}*\n`;
        message += `   - Qtd: ${item.qty}\n`;
        message += `   - Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        message += "\n";
    });

    const totalFormatted = total.toFixed(2).replace('.', ',');
    message += `---`;
    message += `\n\n💰 *TOTAL DO PEDIDO:* R$ ${totalFormatted}\n`;
    message += "\nPor favor, informe seu nome e endereço para finalizarmos a compra.";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}


// === 5. INICIALIZAÇÃO ===

document.addEventListener('DOMContentLoaded', () => {
    renderCart(); 
    const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', generateWhatsappLink);
    }
});