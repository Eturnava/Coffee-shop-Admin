# API Integration Guide

## Overview

Your Coffee Shop Admin panel is configured to sync with a backend API. Data is automatically saved to both localStorage and your API backend.

## Configuration

### Environment Variable

Set your API endpoint in `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Replace `http://localhost:3000` with your actual API URL.

## Required API Endpoints

Your backend must implement these endpoints:

### Ingredients

```
GET    /api/ingredients           - Get all ingredients
POST   /api/ingredients           - Create new ingredient
PUT    /api/ingredients/:id       - Update ingredient
DELETE /api/ingredients/:id       - Delete ingredient
```

**Ingredient Object:**
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "description": "string",
  "strength": "string",
  "flavor": "string"
}
```

### Coffees

```
GET    /api/coffees               - Get all coffees
POST   /api/coffees               - Create new coffee
PUT    /api/coffees/:id           - Update coffee
DELETE /api/coffees/:id           - Delete coffee
```

**Coffee Object:**
```json
{
  "id": "string",
  "title": "string",
  "ingredients": ["string"],
  "description": "string",
  "image": "string",
  "country": "string",
  "caffeine": "number"
}
```

## How It Works

1. User makes a change in the UI
2. CoffeeContext updates state
3. Data saved to localStorage (always)
4. If API connected → syncs to your backend
5. If API unavailable → continues with localStorage

## Testing the Connection

Open browser console (F12):
- Look for "Connected to API" message ✓
- Or error message if connection fails

## Example API Response

```json
{
  "id": "ing_sample1",
  "name": "Arabica Beans",
  "price": 15.99,
  "description": "High-quality Arabica coffee beans",
  "strength": "Medium",
  "flavor": "Fruity"
}
```

## Offline Support

If your API is unavailable:
- App continues working with localStorage
- Changes sync when API becomes available again
- No data loss

## Example Backend Setup (Node.js + Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage (replace with database)
let ingredients = [];
let coffees = [];

// Ingredients
app.get('/api/ingredients', (req, res) => {
  res.json(ingredients);
});

app.post('/api/ingredients', (req, res) => {
  const newIng = { id: Date.now().toString(), ...req.body };
  ingredients.push(newIng);
  res.status(201).json(newIng);
});

app.put('/api/ingredients/:id', (req, res) => {
  const index = ingredients.findIndex(i => i.id === req.params.id);
  if (index >= 0) {
    ingredients[index] = { id: req.params.id, ...req.body };
    res.json(ingredients[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/ingredients/:id', (req, res) => {
  ingredients = ingredients.filter(i => i.id !== req.params.id);
  res.json({ success: true });
});

// Coffees (same pattern)
app.get('/api/coffees', (req, res) => {
  res.json(coffees);
});

// ... implement POST, PUT, DELETE for coffees

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
```

## Using the API Client

The apiClient is available in `src/lib/api.js`. You can use it in your components:

```javascript
import { apiClient } from '../lib/api'

// Get all ingredients
const ingredients = await apiClient.getIngredients()

// Create new ingredient
await apiClient.createIngredient({
  name: 'New Ingredient',
  price: 9.99,
  description: 'Description',
  strength: 'Medium',
  flavor: 'Balanced'
})

// Update ingredient
await apiClient.updateIngredient('id', { name: 'Updated' })

// Delete ingredient
await apiClient.deleteIngredient('id')

// Same for coffees
await apiClient.getCoffees()
await apiClient.createCoffee(data)
await apiClient.updateCoffee('id', data)
await apiClient.deleteCoffee('id')
```

## Troubleshooting

**"API not configured" warning:**
- Check `.env.local` has `VITE_API_URL` set
- Ensure API URL is correct

**"Connection failed" error:**
- Verify API is running
- Check API URL matches where your backend is hosted
- Check CORS headers (if on different domain)

**Data not syncing:**
- Check browser console for errors
- Verify API endpoints are implemented correctly
- Check network tab in DevTools (F12)

**Getting "Not found" errors:**
- Verify endpoint paths match exactly
- Check request method (GET, POST, PUT, DELETE)
- Ensure JSON format is correct
