// script-detalhes.js
// Responsável pela página de detalhes do produto (produto.html). Depende de data.js.

// Esta função addToCart é replicada aqui para que o botão da página de detalhes funcione,
// mesmo que o script.js não esteja incluído na página produto.html.
function addToCart(productId) {
    const productToAdd = PRODUCTS.find(p => p.id === productId); 
    if (!productToAdd) return; 

    const cart = getCart(); 
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            qty: 1
        });
    }

    saveCart(cart); 
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtém o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. Localiza o produto no array PRODUCTS
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        document.querySelector('.main-content').innerHTML = '<h1 style="text-align: center; padding: 50px;">Produto não encontrado.</h1>';
        return;
    }

    // 3. Renderiza os detalhes e a galeria
    renderProductDetails(product);
    renderGallery(product);
});


function renderProductDetails(product) {
    // Assume que você tem áreas específicas no seu produto.html para estes dados
    const formattedPrice = product.price.toFixed(2).replace('.', ',');

    // Renderiza o título
    const titleElement = document.getElementById('product-title');
    if(titleElement) titleElement.textContent = product.name;

    // Renderiza o preço
    const priceElement = document.getElementById('product-price-detail');
    if(priceElement) priceElement.textContent = `R$ ${formattedPrice}`;

    // Renderiza a descrição
    const descriptionElement = document.getElementById('product-description-area');
    if(descriptionElement) {
        descriptionElement.innerHTML = `<p>${product.description}</p><p style="margin-top: 15px;">${product.longDescription}</p>`;
    }
    
    // Configura o evento do botão de adicionar ao carrinho
    const addButton = document.getElementById('add-to-cart-btn');
    if (addButton) {
        addButton.dataset.id = product.id;
        addButton.addEventListener('click', () => {
            addToCart(product.id);
            alert(`${product.name} adicionado ao carrinho!`);
        });
    }
}


function renderGallery(product) {
    const mainImageElement = document.getElementById('main-product-image');
    const thumbnailContainer = document.getElementById('thumbnail-gallery');
    
    // Se não houver imagens, usa uma imagem padrão e termina
    if (!product.images || product.images.length === 0) {
        mainImageElement.src = 'img/placeholder.jpg';
        return;
    }

    // Define a primeira imagem como a principal ao carregar a página
    mainImageElement.src = product.images[0];
    mainImageElement.alt = product.name;

    thumbnailContainer.innerHTML = '';

    // Cria as miniaturas para cada imagem no array
    product.images.forEach((imagePath, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imagePath;
        thumbnail.alt = `Vista ${index + 1} de ${product.name}`;
        thumbnail.classList.add('thumbnail');
        
        if (index === 0) {
            thumbnail.classList.add('active-thumbnail');
        }

        // Adiciona o evento de clique para trocar a imagem principal
        thumbnail.addEventListener('click', () => {
            mainImageElement.src = imagePath;
            
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active-thumbnail'));
            thumbnail.classList.add('active-thumbnail');
        });

        thumbnailContainer.appendChild(thumbnail);
    });
}