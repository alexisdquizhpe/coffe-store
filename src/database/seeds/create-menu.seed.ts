import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { Category } from "src/modules/catalog/domain/entities/category.entity";
import { Product } from "src/modules/catalog/domain/entities/product.entity";
import { CATEGORY_REPOSITORY, ICategoryRepository } from "src/modules/catalog/domain/repositories/category.repository.interface";
import { PRODUCT_REPOSITORY, IProductRepository } from "src/modules/catalog/domain/repositories/product.repository.interface";

interface ProductSeed {
    name: string;
    description: string;
    price: number;
}

interface CategorySeed {
    name: string;
    displayOrder: number;
    products: ProductSeed[];
}

const MENU: CategorySeed[] = [
    {
        name: "Café de Especialidad",
        displayOrder: 1,
        products: [
            { name: "Espresso", description: "Shot corto, denso, equilibrado y rico en aromas.", price: 2.50 },
            { name: "Americano", description: "Sencillo o doble espresso + agua.", price: 2.50 },
            { name: "Cappuccino", description: "Espresso con leche, cremoso y equilibrado.", price: 3.00 },
            { name: "Caramel Cappuccino", description: "Espresso + leche texturizada + syrup + caramelo.", price: 3.50 },
            { name: "Flat White", description: "Doble espresso con leche texturizada, sabor intenso.", price: 3.50 },
            { name: "Cortadito", description: "Shot de espresso manchado con espuma de leche.", price: 3.00 },
            { name: "Mochaccino", description: "Espresso, chocolate de la casa y leche cremosa.", price: 3.50 },
            { name: "Mochaccino Menta", description: "Doble espresso con chocolate, licor de menta y leche espumada.", price: 3.75 },
            { name: "Matildalatte", description: "Espresso con Nutella y leche cremosa.", price: 3.75 },
            { name: "Latte Matcha", description: "Matcha + leche + syrup de vainilla.", price: 4.00 },
            { name: "Café de Temporada", description: "Pregunta por las variedades disponibles.", price: 4.00 },
            { name: "Café Exótico", description: "Pregunta por las variedades disponibles.", price: 4.75 },
        ],
    },
    {
        name: "Café Frío",
        displayOrder: 2,
        products: [
            { name: "Iced Latte", description: "Espresso + leche + hielo + leche espumada.", price: 3.00 },
            { name: "Blueberry Iced Latte", description: "Mermelada de arándanos + syrup + hielo + leche + espresso + crema.", price: 4.25 },
            { name: "Mocha Iced Latte", description: "Espresso + chocolate + syrup + leche + hielo.", price: 3.75 },
            { name: "Matilda Iced Latte", description: "Nutella + espresso + hielo + leche + syrup de avellanas.", price: 4.00 },
            { name: "Matcha Iced Latte", description: "Matcha + syrup de vainilla + leche + hielo.", price: 4.00 },
            { name: "Pink Iced Latte", description: "Mermelada de fresas + syrup + hielo + leche + espresso + crema.", price: 4.25 },
            { name: "Iced Rose Latte", description: "Espresso + leche + syrup de rosas + hielo + leche espumada.", price: 3.75 },
            { name: "Iced Caramel Latte", description: "Espresso + leche + syrup de vainilla + caramelo + hielo + leche espumada.", price: 3.75 },
        ],
    },
    {
        name: "Frappés",
        displayOrder: 3,
        products: [
            { name: "Matilda Frappé", description: "Espresso doble + hielo + leche + Nutella + syrup + crema.", price: 4.50 },
            { name: "Mocha Frappé", description: "Espresso doble + hielo + leche + chocolate + crema + syrup.", price: 4.00 },
            { name: "Oreo Frappé", description: "Espresso doble + hielo + leche + Oreo + syrup + crema.", price: 4.50 },
            { name: "Café Frappé", description: "Espresso doble + hielo + leche + syrup + crema + caramelo.", price: 3.75 },
        ],
    },
    {
        name: "Ice Coffee",
        displayOrder: 4,
        products: [
            { name: "Orange Espresso Tonic", description: "Espresso con toque cítrico de naranja y tónica.", price: 3.75 },
            { name: "Passionfruit Espresso Tonic", description: "Espresso con toque de maracuyá y tónica.", price: 3.75 },
            { name: "Cold Brew", description: "Café de extracción en frío. Consulta opciones.", price: 4.00 },
            { name: "Aerocano", description: "Espresso preparado con técnica aerocano.", price: 3.00 },
            { name: "Ice Filter Coffee", description: "Café filtrado servido frío.", price: 3.75 },
            { name: "Ice Coffee Black", description: "Café negro frío, sin leche.", price: 2.75 },
            { name: "Affogato", description: "Doble espresso sobre helado.", price: 3.80 },
        ],
    },
    {
        name: "Croissants",
        displayOrder: 5,
        products: [
            { name: "Croissant", description: "Croissant clásico horneado.", price: 1.50 },
            { name: "Croissant de Nutella y Fresas", description: "Croissant relleno de Nutella y fresas frescas.", price: 3.75 },
            { name: "Croissant de Queso y Arequipe", description: "Croissant relleno de queso y arequipe.", price: 3.75 },
            { name: "Croissant de Queso y Frutos Rojos", description: "Croissant relleno de queso y frutos rojos.", price: 3.75 },
            { name: "Croissant de Pistacho", description: "Croissant relleno de crema de pistacho.", price: 4.50 },
        ],
    },
    {
        name: "Sanduches",
        displayOrder: 6,
        products: [
            { name: "Serrat", description: "Croissant, jamón serrano, queso holandés, queso amarillo, tomates confitados, hojas verdes, aderezos de la casa, chips de papa.", price: 7.50 },
            { name: "Poe", description: "Croissant, pollo, salsa de champiñones, queso holandés, queso amarillo, hojas verdes, aderezos de la casa, chips de papa.", price: 6.50 },
            { name: "Clásico", description: "Croissant, jamón, quesos, aderezos de la casa, chips de papa.", price: 4.75 },
        ],
    },
    {
        name: "Empanadas y Tartas",
        displayOrder: 7,
        products: [
            { name: "Empanada de Pollo o Carne", description: "Empanada de hojaldre al horno rellena de maíz dulce y proteína a elección, acompañada de ensalada.", price: 3.00 },
        ],
    },
    {
        name: "Tortas y Cuchareables",
        displayOrder: 8,
        products: [
            { name: "Matilda", description: "Torta de chocolate + Nutella.", price: 3.50 },
            { name: "Chocomanjar", description: "Torta de chocolate + manjar + nuez.", price: 3.50 },
            { name: "Tres Leches", description: "Bizcocho genovés + salsa de tres leches + chantillí.", price: 3.50 },
            { name: "Tres Oreo y Nutella", description: "Bizcocho genovés + salsa de tres leches + Oreo + Nutella + chantillí.", price: 3.50 },
            { name: "Tiramisú", description: "Capas de bizcocho suave remojado en café espresso + crema de queso mascarpone + cacao espolvoreado.", price: 3.50 },
            { name: "Red Velvet", description: "Bizcocho rojo aterciopelado con toque de cacao + frosting de queso + mermelada de frutos rojos.", price: 3.50 },
            { name: "Carrot Cake", description: "Bizcocho húmedo de zanahoria + nueces + frosting de queso.", price: 3.50 },
            { name: "Limón & Arándanos", description: "Cake esponjoso de limón y arándanos + crema de limón + frosting de queso.", price: 4.00 },
        ],
    },
    {
        name: "Postres",
        displayOrder: 9,
        products: [
            { name: "Brownie", description: "Chocolate intenso + nueces crocantes, textura densa y centro suave.", price: 3.00 },
            { name: "Mojada de Chocolate", description: "Torta húmeda de chocolate + salsa de chocolate para mojarla.", price: 3.00 },
            { name: "Brookie", description: "Combinación de brownie y cookie + trozos de Oreo, textura irresistible.", price: 3.75 },
            { name: "Galletón de Nutella", description: "Crujiente por fuera, relleno de Nutella.", price: 3.75 },
            { name: "Banoffee", description: "Base de galleta crujiente + dulce de leche + banana laminada + crema de la casa + cacao.", price: 3.75 },
            { name: "NY Cheesecake", description: "Base crocante + relleno cremoso de queso crema + toque de vainilla. Frutos rojos o consulta sabores del día.", price: 4.75 },
            { name: "Tarta Vasca", description: "Postre tradicional vasco, cremoso y suave, a base de queso. Consulta sabores disponibles.", price: 4.75 },
        ],
    },
    {
        name: "Limonadas",
        displayOrder: 10,
        products: [
            { name: "Limonada", description: "Limonada natural.", price: 2.50 },
            { name: "Limonada de Café", description: "Limonada con toque de café.", price: 3.50 },
            { name: "Limonada de Frutos Rojos", description: "Limonada con frutos rojos.", price: 3.75 },
            { name: "Limonada de Maracuyá", description: "Limonada con maracuyá.", price: 3.75 },
        ],
    },
    {
        name: "Té y Bubble Tea",
        displayOrder: 11,
        products: [
            { name: "Té Frío", description: "Sabores: té negro o té de Jamaica.", price: 2.25 },
            { name: "Bubble Tea", description: "Con perlas de tapioca. Sabores: frutos rojos o manzana verde.", price: 3.00 },
        ],
    },
    {
        name: "Bebidas Calientes de Casa",
        displayOrder: 12,
        products: [
            { name: "Chocolate Caliente", description: "Chocolate caliente clásico.", price: 3.00 },
            { name: "Infusión Frutal o Herbal", description: "Frutos rojos, jengibre, piña y naranja, jamaica, manzana y canela, o hierba luisa y naranja.", price: 3.25 },
            { name: "Aromática", description: "Manzanilla, manzana y canela, o frutos rojos.", price: 2.25 },
            { name: "Leche Caliente y Espumada", description: "Leche caliente con espuma.", price: 1.50 },
            { name: "Leche Fría", description: "Leche fría.", price: 1.25 },
        ],
    },
    {
        name: "Milk Shakes",
        displayOrder: 13,
        products: [
            { name: "Milk Shake", description: "Sabores: vainilla, Oreo o fresa.", price: 4.00 },
        ],
    },
    {
        name: "Agua",
        displayOrder: 14,
        products: [
            { name: "Agua sin Gas", description: "Botella de agua sin gas.", price: 1.00 },
            { name: "Güitig", description: "Agua con gas Güitig.", price: 2.00 },
        ],
    },
    {
        name: "Extras",
        displayOrder: 15,
        products: [
            { name: "Leche de Almendras", description: "Adicional para tu bebida.", price: 1.00 },
            { name: "Crema Adicional", description: "Adicional para tu bebida o postre.", price: 0.75 },
            { name: "Chispas de Chocolate", description: "Adicional para tu bebida o postre.", price: 0.50 },
            { name: "Helado Extra", description: "Adicional para tu postre.", price: 1.25 },
        ],
    },
];

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const categoryRepository = app.get<ICategoryRepository>(CATEGORY_REPOSITORY);
    const productRepository = app.get<IProductRepository>(PRODUCT_REPOSITORY);

    for (const categorySeed of MENU) {
        const category = Category.create(categorySeed.name, categorySeed.displayOrder);
        await categoryRepository.save(category);
        console.log(`Categoría creada: ${category.name}`);

        for (const productSeed of categorySeed.products) {
            const product = Product.create({
                categoryId: category.id,
                name: productSeed.name,
                description: productSeed.description,
                price: productSeed.price,
            });
            await productRepository.save(product);
        }
        console.log(`  -> ${categorySeed.products.length} productos insertados`);
    }

    console.log("Seed complete: Menú de Montse creado");
    await app.close();
}

seed().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});