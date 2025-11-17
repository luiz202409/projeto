const PRODUCTS = [
    {
        id: "p001",
        name: "Tênis Esportivo Pro Runner X",
        images: [ // MUDANÇA AQUI: de 'image' para 'images' (array)
            "img/produtos/tenis-runner-a.jpg", // Imagem Principal
            "img/produtos/tenis-runner-b.jpg", // Vista lateral
            "img/produtos/tenis-runner-c.jpg"  // Detalhe do solado
        ],
        price: 149.90,
        category: "Calçados"
    },
    {
        id: "p002",
        name: "Camiseta Algodão Premium - Branca",
        images: [
            "img/produtos/camiseta-branca-a.jpg",
            "img/produtos/camiseta-branca-b.jpg"
        ],
        price: 49.90,
        category: "Vestuário"
    },
    {
        id: "p003",
        name: "Smartphone Z-Pro Max (256GB)",
        images: [
            "img/produtos/smartphone-a.jpg",
            "img/produtos/smartphone-b.jpg",
            "img/produtos/smartphone-c.jpg"
        ],
        price: 1899.00,
        category: "Eletrônicos"
    },
    {
        id: "p004",
        name: "Máquina de Café Espresso Automática",
        images: [
            "img/produtos/cafe-expresso-a.jpg",
            "img/produtos/cafe-expresso-b.hpg"
        ],
        price: 649.00,
        category: "Eletrodomésticos"
    },
    // Adicione mais produtos conforme necessário...
];

// O estado do carrinho continua o mesmo

let shoppingCart = JSON.parse(localStorage.getItem("data")) || [];
