# Coffee Shop Admin Panel

A React + Vite admin panel for managing coffee shop ingredients and coffees.

## Features

- **Dashboard**: View all coffees in table and card format
- **Manage Ingredients**: CRUD operations for coffee ingredients
- **Manage Coffees**: CRUD operations for coffee products
- **Add Coffee**: Form to create new coffee products with multiple ingredients
- **Price Calculation**: Automatic price calculation (2 GEL + sum of ingredient prices)

## Tech Stack

- React 18
- Vite
- React Router DOM
- CSS Modules
- Context API for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Format code with Prettier:
```bash
npm run format
```

## Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Layout.jsx
│       └── Layout.module.css
├── context/
│   └── CoffeeContext.jsx
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.module.css
│   ├── ManageIngredients/
│   │   ├── ManageIngredients.jsx
│   │   └── ManageIngredients.module.css
│   ├── ManageCoffees/
│   │   ├── ManageCoffees.jsx
│   │   └── ManageCoffees.module.css
│   └── AddCoffee/
│       ├── AddCoffee.jsx
│       └── AddCoffee.module.css
├── App.jsx
├── main.jsx
└── index.css
```

## Features Details

### Ingredients Management
- Fields: id, name, price, description, strength, flavor
- Create, edit, and delete ingredients
- Price in GEL (Georgian Lari)

### Coffee Management
- Fields: id, title, ingredients, description, image, country, caffeine
- Create, edit, and delete coffees
- Multiple ingredients per coffee
- Automatic price calculation: 2 GEL + sum of ingredient prices
- Price displayed as `totalPrice` in tables

## Git Workflow

- Work on feature branches
- Create a `develop` branch
- Merge changes into `develop` first
- Only merge `develop` into `main` after testing
