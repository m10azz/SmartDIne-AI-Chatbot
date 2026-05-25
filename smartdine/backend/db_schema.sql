-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- (Veg/Non-Veg/Vegan/Dessert/Drinks)
    price DECIMAL(10, 2) NOT NULL, -- Price in rupees
    image_url TEXT,
    description TEXT,
    calories INTEGER,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fats DECIMAL(5, 2),
    rating DECIMAL(3, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    items JSONB,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    UNIQUE(user_id, menu_item_id)
);

-- Coupons Table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Seed Data for Menu Items
INSERT INTO menu_items (name, category, price, description, calories, protein, carbs, fats, rating, image_url) VALUES
-- Veg (1-10)
('Paneer Butter Masala', 'Veg', 280.00, 'Rich and creamy curry made with paneer, spices, onions, tomatoes, cashews and butter.', 450, 15.0, 18.0, 35.0, 4.8, 'https://loremflickr.com/800/600/paneer,butter,masala,food/all?lock=1'),
('Palak Paneer', 'Veg', 260.00, 'Cottage cheese cubes in a mild, spiced smooth spinach sauce.', 320, 14.0, 12.0, 24.0, 4.6, 'https://loremflickr.com/800/600/palak,paneer,food/all?lock=2'),
('Vegetable Biryani', 'Veg', 220.00, 'Aromatic basmati rice cooked with mixed vegetables, herbs, and biryani spices.', 410, 8.0, 65.0, 12.0, 4.5, 'https://loremflickr.com/800/600/vegetable,biryani,food/all?lock=3'),
('Dal Makhani', 'Veg', 210.00, 'Whole black lentils cooked with butter and cream and simmered on low heat for that unique flavor.', 380, 12.0, 40.0, 18.0, 4.7, 'https://loremflickr.com/800/600/dal,makhani,food/all?lock=4'),
('Malai Kofta', 'Veg', 290.00, 'Deep fried potato and paneer balls coated with malai and added into an onion-tomato gravy.', 480, 10.0, 35.0, 32.0, 4.8, 'https://loremflickr.com/800/600/malai,kofta,food/all?lock=5'),
('Kadai Paneer', 'Veg', 270.00, 'Paneer cooked with bell peppers, tomatoes, and spicy kadai masala.', 390, 16.0, 15.0, 28.0, 4.6, 'https://loremflickr.com/800/600/kadai,paneer,food/all?lock=6'),
('Veg Pulao', 'Veg', 180.00, 'Simple and mild rice dish with mixed vegetables.', 320, 6.0, 58.0, 8.0, 4.2, 'https://loremflickr.com/800/600/veg,pulao,food/all?lock=7'),
('Aloo Gobi', 'Veg', 190.00, 'Popular Indian dish made with potatoes, cauliflower, and Indian spices.', 250, 5.0, 30.0, 12.0, 4.3, 'https://loremflickr.com/800/600/aloo,gobi,food/all?lock=8'),
('Chana Masala', 'Veg', 200.00, 'Hearty, flavorful chickpea curry with warming spices.', 310, 12.0, 45.0, 8.0, 4.5, 'https://loremflickr.com/800/600/chana,masala,food/all?lock=9'),
('Mutter Paneer', 'Veg', 250.00, 'Paneer and green peas simmered in a mildly spiced tomato gravy.', 360, 14.0, 20.0, 25.0, 4.4, 'https://loremflickr.com/800/600/mutter,paneer,food/all?lock=10'),

-- Non-Veg (11-20)
('Chicken Tikka Masala', 'Non-Veg', 350.00, 'Roasted marinated chicken chunks in a spiced curry sauce.', 480, 35.0, 12.0, 30.0, 4.8, 'https://loremflickr.com/800/600/chicken,tikka,masala,food/all?lock=11'),
('Butter Chicken', 'Non-Veg', 360.00, 'Chicken simmered in a smooth, creamy tomato and butter gravy.', 520, 32.0, 15.0, 38.0, 4.9, 'https://loremflickr.com/800/600/butter,chicken,food/all?lock=12'),
('Mutton Rogan Josh', 'Non-Veg', 450.00, 'Aromatic lamb dish of Persian origin, which is one of the signature recipes of Kashmiri cuisine.', 550, 40.0, 10.0, 35.0, 4.7, 'https://loremflickr.com/800/600/mutton,rogan,josh,food/all?lock=13'),
('Chicken Biryani', 'Non-Veg', 320.00, 'Savory chicken and rice dish that includes layers of chicken, rice, and aromatics that are steamed together.', 580, 30.0, 65.0, 20.0, 4.8, 'https://loremflickr.com/800/600/chicken,biryani,food/all?lock=14'),
('Fish Curry', 'Non-Veg', 380.00, 'Tangy and spicy fish curry made with coconut milk and Indian spices.', 410, 28.0, 8.0, 25.0, 4.6, 'https://loremflickr.com/800/600/fish,curry,food/all?lock=15'),
('Tandoori Chicken', 'Non-Veg', 300.00, 'Chicken dish prepared by roasting chicken marinated in yogurt and spices in a tandoor.', 380, 45.0, 5.0, 18.0, 4.7, 'https://loremflickr.com/800/600/tandoori,chicken,food/all?lock=16'),
('Prawn Masala', 'Non-Veg', 420.00, 'Delicious, spicy & flavorful dish made with prawns, onions, tomatoes & spices.', 390, 25.0, 12.0, 22.0, 4.5, 'https://loremflickr.com/800/600/prawn,masala,food/all?lock=17'),
('Mutton Biryani', 'Non-Veg', 400.00, 'Classic biryani made with fragrant basmati rice and tender mutton pieces.', 650, 38.0, 70.0, 28.0, 4.8, 'https://loremflickr.com/800/600/mutton,biryani,food/all?lock=18'),
('Chicken Korma', 'Non-Veg', 340.00, 'Mildly spiced, creamy curry with chicken, nuts, and yogurt.', 490, 34.0, 14.0, 32.0, 4.6, 'https://loremflickr.com/800/600/chicken,korma,food/all?lock=19'),
('Egg Curry', 'Non-Veg', 200.00, 'Boiled eggs cooked in a spicy onion tomato gravy.', 320, 16.0, 12.0, 22.0, 4.3, 'https://loremflickr.com/800/600/egg,curry,food/all?lock=20'),

-- Vegan (21-30)
('Vegan Buddha Bowl', 'Vegan', 280.00, 'Healthy bowl packed with quinoa, roasted veggies, tofu, and tahini dressing.', 450, 18.0, 55.0, 20.0, 4.7, 'https://loremflickr.com/800/600/vegan,buddha,bowl,food/all?lock=21'),
('Tofu Stir Fry', 'Vegan', 250.00, 'Crispy tofu and mixed vegetables tossed in a savory soy-ginger sauce.', 320, 16.0, 25.0, 18.0, 4.5, 'https://loremflickr.com/800/600/tofu,stir,fry,food/all?lock=22'),
('Lentil Soup', 'Vegan', 180.00, 'Hearty and nutritious soup made with mixed lentils, carrots, and celery.', 220, 14.0, 35.0, 4.0, 4.4, 'https://loremflickr.com/800/600/lentil,soup,food/all?lock=23'),
('Quinoa Salad', 'Vegan', 220.00, 'Refreshing salad with quinoa, cucumber, tomatoes, lemon, and olive oil.', 280, 8.0, 40.0, 12.0, 4.6, 'https://loremflickr.com/800/600/quinoa,salad,food/all?lock=24'),
('Vegan Pasta', 'Vegan', 260.00, 'Penne pasta tossed in a rich cashew-based tomato cream sauce.', 420, 12.0, 60.0, 15.0, 4.5, 'https://loremflickr.com/800/600/vegan,pasta,food/all?lock=25'),
('Roasted Chickpeas', 'Vegan', 150.00, 'Crunchy chickpeas roasted with paprika, cumin, and garlic powder.', 210, 10.0, 28.0, 6.0, 4.3, 'https://loremflickr.com/800/600/roasted,chickpeas,food/all?lock=26'),
('Vegan Burger', 'Vegan', 240.00, 'Plant-based patty with lettuce, tomato, vegan mayo on a whole wheat bun.', 380, 20.0, 45.0, 15.0, 4.6, 'https://loremflickr.com/800/600/vegan,burger,food/all?lock=27'),
('Sweet Potato Wedges', 'Vegan', 160.00, 'Oven-baked sweet potato wedges sprinkled with sea salt and rosemary.', 240, 3.0, 45.0, 8.0, 4.4, 'https://loremflickr.com/800/600/sweet,potato,wedges,food/all?lock=28'),
('Mushroom Risotto', 'Vegan', 290.00, 'Creamy arborio rice cooked with assorted mushrooms and nutritional yeast.', 380, 8.0, 58.0, 12.0, 4.7, 'https://loremflickr.com/800/600/mushroom,risotto,food/all?lock=29'),
('Vegan Wrap', 'Vegan', 210.00, 'Whole wheat wrap filled with hummus, falafel, spinach, and grated carrots.', 340, 12.0, 48.0, 14.0, 4.5, 'https://loremflickr.com/800/600/vegan,wrap,food/all?lock=30'),

-- Dessert (31-40)
('Gulab Jamun', 'Dessert', 120.00, 'Deep-fried milk dumplings soaked in a sugar syrup spiced with cardamom.', 350, 5.0, 55.0, 15.0, 4.8, 'https://loremflickr.com/800/600/gulab,jamun,food/all?lock=31'),
('Rasgulla', 'Dessert', 110.00, 'Spongy cheese balls cooked in a light sugar syrup.', 220, 4.0, 45.0, 2.0, 4.6, 'https://loremflickr.com/800/600/rasgulla,food/all?lock=32'),
('Chocolate Brownie', 'Dessert', 150.00, 'Fudgy, dense chocolate brownie served warm.', 420, 5.0, 50.0, 22.0, 4.7, 'https://loremflickr.com/800/600/chocolate,brownie,food/all?lock=33'),
('Cheesecake', 'Dessert', 200.00, 'Classic New York style cheesecake with a graham cracker crust.', 480, 6.0, 45.0, 32.0, 4.8, 'https://loremflickr.com/800/600/cheesecake,food/all?lock=34'),
('Tiramisu', 'Dessert', 220.00, 'Italian dessert made of ladyfingers dipped in coffee, layered with a whipped mascarpone mixture.', 450, 7.0, 40.0, 30.0, 4.7, 'https://loremflickr.com/800/600/tiramisu,food/all?lock=35'),
('Ice Cream Sundae', 'Dessert', 180.00, 'Vanilla ice cream topped with chocolate syrup, nuts, and a cherry.', 380, 6.0, 50.0, 18.0, 4.5, 'https://loremflickr.com/800/600/ice,cream,sundae,food/all?lock=36'),
('Fruit Tart', 'Dessert', 160.00, 'Buttery pastry crust filled with custard and topped with fresh seasonal fruits.', 310, 4.0, 42.0, 15.0, 4.6, 'https://loremflickr.com/800/600/fruit,tart,food/all?lock=37'),
('Chocolate Lava Cake', 'Dessert', 190.00, 'Decadent chocolate cake with a molten, gooey center.', 460, 6.0, 52.0, 28.0, 4.9, 'https://loremflickr.com/800/600/chocolate,lava,cake,food/all?lock=38'),
('Panna Cotta', 'Dessert', 170.00, 'Italian dessert of sweetened cream thickened with gelatin and molded.', 340, 3.0, 25.0, 26.0, 4.6, 'https://loremflickr.com/800/600/panna,cotta,food/all?lock=39'),
('Mango Mousse', 'Dessert', 140.00, 'Light and airy dessert made with fresh mango puree and whipped cream.', 280, 3.0, 35.0, 15.0, 4.5, 'https://loremflickr.com/800/600/mango,mousse,food/all?lock=40'),

-- Drinks (41-50)
('Mango Lassi', 'Drinks', 100.00, 'Refreshing yogurt-based drink blended with ripe mangoes.', 210, 6.0, 35.0, 5.0, 4.8, 'https://loremflickr.com/800/600/mango,lassi,drink/all?lock=41'),
('Sweet Lassi', 'Drinks', 80.00, 'Traditional sweet yogurt drink flavored with a hint of cardamom.', 180, 6.0, 25.0, 6.0, 4.5, 'https://loremflickr.com/800/600/sweet,lassi,drink/all?lock=42'),
('Cold Coffee', 'Drinks', 120.00, 'Creamy iced coffee blended to perfection.', 250, 7.0, 30.0, 10.0, 4.6, 'https://loremflickr.com/800/600/cold,coffee,drink/all?lock=43'),
('Masala Chai', 'Drinks', 50.00, 'Indian spiced tea made with milk, tea leaves, and warming spices.', 110, 3.0, 15.0, 4.0, 4.7, 'https://loremflickr.com/800/600/masala,chai,drink/all?lock=44'),
('Fresh Lime Soda', 'Drinks', 60.00, 'Classic Indian thirst quencher, available sweet or salted.', 80, 0.0, 20.0, 0.0, 4.4, 'https://loremflickr.com/800/600/fresh,lime,soda,drink/all?lock=45'),
('Mojito', 'Drinks', 140.00, 'Refreshing mocktail with mint leaves, lime juice, sugar, and soda water.', 120, 0.5, 30.0, 0.0, 4.5, 'https://loremflickr.com/800/600/mojito,drink/all?lock=46'),
('Iced Tea', 'Drinks', 90.00, 'Chilled black tea served with ice and a slice of lemon.', 70, 0.0, 18.0, 0.0, 4.3, 'https://loremflickr.com/800/600/iced,tea,drink/all?lock=47'),
('Orange Juice', 'Drinks', 110.00, 'Freshly squeezed orange juice.', 110, 2.0, 26.0, 0.5, 4.6, 'https://loremflickr.com/800/600/orange,juice,drink/all?lock=48'),
('Watermelon Juice', 'Drinks', 100.00, 'Refreshing fresh watermelon juice, perfect for summer.', 85, 1.5, 21.0, 0.5, 4.7, 'https://loremflickr.com/800/600/watermelon,juice,drink/all?lock=49'),
('Milkshake', 'Drinks', 130.00, 'Thick and creamy milkshake available in various flavors like vanilla or strawberry.', 320, 9.0, 45.0, 12.0, 4.5, 'https://loremflickr.com/800/600/milkshake,drink/all?lock=50');
