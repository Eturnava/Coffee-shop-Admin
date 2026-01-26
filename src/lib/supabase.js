const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.warn(
    'API URL not configured. Please set VITE_API_URL in .env.local'
  )
}

export const apiClient = {
  baseURL: API_URL || '',

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        headers: defaultHeaders,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  },

  // Ingredients endpoints
  async getIngredients() {
    return this.get('/api/ingredients')
  },

  async createIngredient(data) {
    return this.post('/api/ingredients', data)
  },

  async updateIngredient(id, data) {
    return this.put(`/api/ingredients/${id}`, data)
  },

  async deleteIngredient(id) {
    return this.delete(`/api/ingredients/${id}`)
  },

  // Coffees endpoints
  async getCoffees() {
    return this.get('/api/coffees')
  },

  async createCoffee(data) {
    return this.post('/api/coffees', data)
  },

  async updateCoffee(id, data) {
    return this.put(`/api/coffees/${id}`, data)
  },

  async deleteCoffee(id) {
    return this.delete(`/api/coffees/${id}`)
  },
}

