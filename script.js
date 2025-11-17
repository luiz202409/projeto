// Constantes e Variáveis
const shop = document.getElementById('shop');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const subtotalElement = document.getElementById('subtotal');
const totalAmountElement = document.getElementById('total-amount');
const checkoutButton = document.querySelector('.btn-checkout');

// Objeto para rastrear a imagem atual de cada carrossel (necessário para o filtro)
const currentImageIndexes = {}; 

/* =========================================================================
   1. GERAÇÃO DA PÁGINA INICIAL (INDEX.HTML) E FILTRO
   ========================================================================= */

/**
 * Função responsável por filtrar e renderizar os produtos na tela.
 * Chamada ao carregar a página e sempre que o usuário digita na busca.
 */
let filterProducts = () => {
    // Pega o termo de busca do input (ou string vazia se o input não existir)
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    // Filtra o array PRODUCTS
    const filteredProducts = PRODUCTS.filter(product => {
        // Retorna o produto se o nome incluir o termo de busca (case-insensitive)
        return product.name.toLowerCase().includes(searchTerm);
    });

    // Se não estiver na página inicial, para
    if (!shop) return; 
    
    // Se não houver produtos filtrados, exibe mensagem
    if (filteredProducts.length === 0) {
        shop.innerHTML = `<h2 style="text-align: center; grid-column: 1 / -1; margin-top: 50px;">Nenhum produto encontrado para "${searchTerm}".</h2>`;
        return;
    }

    // RENDERIZAÇÃO NA TELA
    shop.innerHTML = filteredProducts.map((product) => {
        const fallbackImageUrl = 'img/placeholder.jpg'; 
        
        // Inicializa o índice, se necessário
        if (currentImageIndexes[product.id] === undefined) {
             currentImageIndexes[product.id] = 0;
        }

        // Cria todas as tags <img> necessárias para o carrossel
        const imagesHtml = product.images.map((imgUrl, index) => {
            const displayStyle = index === 0 ? 'block' : 'none'; 
            return `<img src="${imgUrl}" alt="${product.name} - Vista ${index + 1}" style="display: ${displayStyle};" onerror="this.onerror=null; this.src='${fallbackImageUrl}';">`;
        }).join('');

        return `
        <div class="product-item" id="product-id-${product.id}">
            <div class="product-image-carousel" data-product-id="${product.id}">
                ${imagesHtml}
                
                ${product.images.length > 1 ? `
                    <button class="carousel-btn prev-btn" onclick="changeImage('${product.id}', -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next-btn" onclick="changeImage('${product.id}', 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
            </div>
            
            <div class="product-info">
                <div>
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button onclick="increment('${product.id}')" class="btn-add-cart">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
        `;
    }).join("");
};

/**
 * Função de inicialização original, agora apenas chama o filtro para exibir todos.
 */
let generateShop = () => {
    filterProducts();
};


/* =========================================================================
   2. FUNÇÕES DE INCREMENTAR E DECREMENTAR (Controle de Quantidade)
   ========================================================================= */

// Função Increment: Adiciona +1 item
let increment = (id) => {
    let selectedItem = id;
    let search = shoppingCart.find((x) => x.id === selectedItem);

    if (search === undefined) {
        shoppingCart.push({ id: selectedItem, item: 1 });
    } else {
        search.item += 1;
    }

    localStorage.setItem("data", JSON.stringify(shoppingCart));
    calculation();
    if (cartItemsContainer) generateCartItems(); 
};

// Função Decrement: Remove 1 item, ou remove o produto se a quantidade for 1
let decrement = (id) => {
    let selectedItem = id;
    let search = shoppingCart.find((x) => x.id === selectedItem);

    if (search === undefined) return; 

    if (search.item > 1) {
        search.item -= 1;
    } else {
        shoppingCart = shoppingCart.filter((x) => x.id !== selectedItem);
    }

    localStorage.setItem("data", JSON.stringify(shoppingCart));
    calculation();
    generateCartItems();
};


/* =========================================================================
   3. OUTRAS FUNÇÕES DO CARRINHO E UTILITÁRIOS
   ========================================================================= */

// Função de Remoção Completa (mantida para o ícone de lixeira)
let removeItem = (id) => {
    shoppingCart = shoppingCart.filter((x) => x.id !== id);
    localStorage.setItem("data", JSON.stringify(shoppingCart));
    calculation();
    generateCartItems();
};

let calculation = () => {
    let cartIcon = document.querySelector(".cart-icon");
    if (!cartIcon) return; 

    let totalItems = shoppingCart.map((x) => x.item).reduce((x, y) => x + y, 0);
    
    let badge = cartIcon.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.classList.add('cart-badge');
        cartIcon.appendChild(badge);
    }
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
};

/* =========================================================================
   4. GERAÇÃO DA PÁGINA DO CARRINHO (CARRINHO.HTML)
   ========================================================================= */

let generateCartItems = () => {
    if (!cartItemsContainer) return;

    const cartItemsData = shoppingCart.filter((x) => x.item > 0);

    if (cartItemsData.length !== 0) {
        emptyCartMessage.style.display = 'none';
        
        cartItemsContainer.innerHTML = cartItemsData.map((cartItem) => {
            let { id, item } = cartItem;
            let product = PRODUCTS.find((p) => p.id === id) || { price: 0, name: "Produto Desconhecido", images: [""] };
            
            let imageUrl = product.images.length > 0 ? product.images[0] : ""; 

            return `
            <div class="cart-item">
                <img src="${imageUrl}" alt="${product.name}" class="item-thumbnail">
                <div class="item-details">
                    <p class="item-title">${product.name}</p>
                    
                    <div class="quantity-control">
                        <button onclick="decrement('${id}')" class="btn-quantity">-</button> 
                        <span id="quantity-${id}" class="item-quantity-value">${item}</span>
                        <button onclick="increment('${id}')" class="btn-quantity">+</button> 
                    </div>
                    
                    <p class="item-price">R$ ${(product.price * item).toFixed(2).replace('.', ',')}</p>
                </div>
                <button onclick="removeItem('${id}')" class="btn-remove">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            `;
        }).join("");

    } else {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        if (checkoutButton) checkoutButton.disabled = true;
    }
    updateTotal();
};

let updateTotal = () => {
    if (!subtotalElement || !totalAmountElement) return;

    let subtotal = shoppingCart.map((x) => {
        let product = PRODUCTS.find((p) => p.id === x.id) || { price: 0 };
        return x.item * product.price;
    }).reduce((x, y) => x + y, 0);

    const FRETE = 10.00;
    let total = subtotal + FRETE;
    
    subtotalElement.innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    totalAmountElement.innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    if (checkoutButton) {
        checkoutButton.disabled = subtotal === 0;
        if (!checkoutButton.disabled) {
            checkoutButton.onclick = () => generateWhatsappLink(total);
        }
    }
};

let generateWhatsappLink = (total) => {
    const phoneNumber = "5513997679355"; // Coloque o número do seu WhatsApp aqui
    let message = "Olá! Gostaria de fazer o seguinte pedido na Shoperuibe:\n\n";

    shoppingCart.forEach(cartItem => {
        let product = PRODUCTS.find(p => p.id === cartItem.id);
        if (product) {
            message += `- ${cartItem.item}x ${product.name} (R$ ${(product.price * cartItem.item).toFixed(2).replace('.', ',')})\n`;
        }
    });

    message += `\nSubtotal: R$ ${(total - 25.00).toFixed(2).replace('.', ',')}`;
    message += `\nFrete: R$ 10,00`;
    message += `\nTotal do Pedido: R$ ${total.toFixed(2).replace('.', ',')}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

let changeImage = (id, direction) => {
    const carouselElement = document.querySelector(`.product-image-carousel[data-product-id="${id}"]`);
    const images = Array.from(carouselElement.querySelectorAll('img'));
    const totalImages = images.length;

    if (totalImages <= 1) return;

    let currentIndex = currentImageIndexes[id];
    images[currentIndex].style.display = 'none';

    let newIndex = (currentIndex + direction + totalImages) % totalImages;
    currentImageIndexes[id] = newIndex;

    images[newIndex].style.display = 'block';
};

/* =========================================================================
   5. INICIALIZAÇÃO
   ========================================================================= */

generateShop(); 
generateCartItems();
calculation();