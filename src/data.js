export const sample_foods = [
    {
        id: '1',
        name: 'Pizza Pepperoni',
        description: 'Pepperoni italiano, queso mozarella y salsa de tomate',
        price: 10,
        imageUrl: 'food-1.jpg',
        tags: ['FastFood', 'Pizza', 'Lunch'],
    },
    {
        id: '2',
        name: 'Albondigas',
        price: 20,
        description: 'Consiste en una bola de pequeño tamaño de carne picada mezclada con diferentes condimentos',
        imageUrl: 'food-2.jpg',
        tags: ['SlowFood', 'Lunch'],
    },
    {
        id: '3',
        name: 'Hamburguesa',
        price: 5,
        description: 'Una hamburguesa es un emparedado que contiene, generalmente, carne picada o de origen vegetal, aglutinada en forma de filete cocinado a la parrilla',
        imageUrl: 'food-3.jpg',
        tags: ['FastFood', 'Hamburger'],
    },
    {
        id: '4',
        name: 'Papas fritas',
        price: 2,
        description: 'Las papas fritas o patatas fritas, también conocidas como papas a la francesa, son un plato de patatas que se cocinan mediante fritura hasta que queden doradas y crujientes',
        imageUrl: 'food-4.jpg',
        tags: ['FastFood', 'Fry'],
    },
    {
        id: '5',
        name: 'Sopa de verduras',
        price: 11,
        description: 'La sopa de verduras es una de las mejores sopas que conozco, además es perfecta si queremos bajar de peso o seguir una dieta sana ya que en muchas de ellas se incluye la sopa de verduras porque es muy sana y baja en grasas',
        imageUrl: 'food-5.jpg',
        tags: ['SlowFood', 'Soup'],
    },
    {
        id: '6',
        name: 'Pizza Vegetariana',
        price: 9,
        description: 'Pizza hecha en Horno a la piedra a 450 grados de temperatura en Masa de Harina Artesanal, Salsa de Tomate Artesanal, Mozzarella de Cajamarca, Brócoli Marinado, Champignones, Berenjena y Orégano',
        imageUrl: 'food-6.jpg',
        tags: ['FastFood', 'Pizza', 'Lunch'],
    },
];

export const sample_tags = [
    { name: 'All', count: 6 },
    { name: 'FastFood', count: 4 },
    { name: 'Pizza', count: 2 },
    { name: 'Lunch', count: 3 },
    { name: 'SlowFood', count: 2 },
    { name: 'Hamburger', count: 1 },
    { name: 'Fry', count: 1 },
    { name: 'Soup', count: 1 },
];

export const sample_users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '12345',
        address: 'Toronto On',
        isAdmin: false,
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        password: '12345',
        address: 'Shanghai',
        isAdmin: true,
    },
];