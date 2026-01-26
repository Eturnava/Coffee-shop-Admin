import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { apiClient } from '../lib/api'

const CoffeeContext = createContext()

export const useCoffeeContext = () => {
  const context = useContext(CoffeeContext)
  if (!context) {
    throw new Error('useCoffeeContext must be used within CoffeeProvider')
  }
  return context
}

const STORAGE_KEYS = {
  INGREDIENTS: 'coffee_shop_ingredients',
  COFFEES: 'coffee_shop_coffees',
}

const defaultIngredients = [
  {
    id: 'ing_sample1',
    name: 'Arabica Beans',
    price: 15.99,
    description: 'High-quality Arabica coffee beans',
    strength: 'Medium',
    flavor: 'Fruity',
  },
  {
    id: 'ing_sample2',
    name: 'Robusta Beans',
    price: 12.99,
    description: 'Strong Robusta coffee beans',
    strength: 'High',
    flavor: 'Earthy',
  },
  {
    id: 'ing_sample3',
    name: 'Vanilla Syrup',
    price: 8.99,
    description: 'Sweet vanilla flavoring syrup',
    strength: 'Low',
    flavor: 'Sweet',
  },
]

const defaultCoffees = [
  {
    id: '1',
    title: 'Ethiopian Yirgacheffe',
    ingredients: ['ing_sample1'],
    description:
      'A light roasted coffee with bright acidity, and complex fruit and floral notes.',
    image: 'https://example.com/ethiopian.jpg',
    country: 'Ethiopia',
    caffeine: 120,
  },
  {
    id: '2',
    title: 'Colombian Supremo',
    ingredients: ['ing_sample1', 'ing_sample3'],
    description:
      'Medium roast with a sweet and rich caramel flavor, balanced acidity and a clean finish.',
    image: 'https://example.com/colombian.jpg',
    country: 'Colombia',
    caffeine: 140,
  },
]

const toPositiveIntOrNull = value => {
  const n = Number.parseInt(String(value), 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

const extractTrailingNumber = value => {
  const match = String(value).match(/(\d+)\s*$/)
  return match ? toPositiveIntOrNull(match[1]) : null
}

const getNextNumericId = items => {
  const maxId = items.reduce((max, item) => {
    const n = toPositiveIntOrNull(item?.id)
    return n ? Math.max(max, n) : max
  }, 0)
  return String(maxId + 1)
}

const getNextSequentialIngredientId = ingredients => {
  const maxId = ingredients.reduce((max, ingredient) => {
    const n = extractTrailingNumber(ingredient?.id)
    return n ? Math.max(max, n) : max
  }, 0)
  return `ing_sample${maxId + 1}`
}

const normalizeCoffeeIds = coffees => {
  const allNumeric = coffees.every(c => toPositiveIntOrNull(c?.id) !== null)
  if (allNumeric) return coffees

  return coffees.map((coffee, idx) => ({
    ...coffee,
    id: String(idx + 1),
  }))
}

const normalizeIngredientIds = ingredients => {
  const allIngSample = ingredients.every(
    ing => ing?.id && String(ing.id).startsWith('ing_sample')
  )
  if (allIngSample) return ingredients

  return ingredients.map((ingredient, idx) => ({
    ...ingredient,
    id: `ing_sample${idx + 1}`,
  }))
}

const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    if (item) {
      const parsed = JSON.parse(item)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    return defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    try {
      const item = localStorage.getItem(key)
      if (item) {
        console.warn(`Failed to parse ${key}, but data exists. Keeping defaults.`)
      }
    } catch (e) {
    }
    return defaultValue
  }
}

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export const CoffeeProvider = ({ children }) => {
  const loadedIngredients = loadFromStorage(STORAGE_KEYS.INGREDIENTS, defaultIngredients)
  const loadedCoffees = loadFromStorage(STORAGE_KEYS.COFFEES, defaultCoffees)
  
  const [ingredients, setIngredients] = useState(() =>
    normalizeIngredientIds(loadedIngredients)
  )
  const [coffees, setCoffees] = useState(() =>
    normalizeCoffeeIds(loadedCoffees)
  )
  const [isApiConnected, setIsApiConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  const normalizeCoffeeFromApi = useCallback((coffee) => {
    const title = coffee.title || coffee.name || ''
    const image = coffee.image || coffee.image_url || ''
    return {
      id: String(coffee.id),
      title,
      ingredients: Array.isArray(coffee.ingredients) ? coffee.ingredients : [],
      description: coffee.description || '',
      image,
      country: coffee.country || '',
      caffeine: typeof coffee.caffeine === 'number' ? coffee.caffeine : 0,
      price_usd: typeof coffee.price_usd === 'number' ? coffee.price_usd : 0,
      price_gel: typeof coffee.price_gel === 'number' ? coffee.price_gel : 0,
      long_description: coffee.long_description ?? null,
    }
  }, [])

  const normalizeIngredientFromApi = useCallback((ing) => {
    return {
      id: String(ing.id),
      name: ing.name || '',
      price: typeof ing.price === 'number' ? ing.price : 0,
      description: ing.description || '',
      strength: ing.strength || '',
      flavor: ing.flavor || '',
    }
  }, [])


  useEffect(() => {
    const initApi = async () => {
      setLoading(true)
      try {
        const apiIngredients = await apiClient.getIngredients()
        const apiCoffees = await apiClient.getCoffees()

        setIsApiConnected(true)
        setIngredients(normalizeIngredientIds((apiIngredients || []).map(normalizeIngredientFromApi)))
        setCoffees(normalizeCoffeeIds((apiCoffees || []).map(normalizeCoffeeFromApi)))
        console.log('Connected to API')
      } catch (error) {
        console.warn('API not configured or connection failed:', error.message)
        setIsApiConnected(false)
      } finally {
        setLoading(false)
      }
    }

    initApi()
  }, [normalizeCoffeeFromApi, normalizeIngredientFromApi])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INGREDIENTS, ingredients)
  }, [ingredients])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COFFEES, coffees)
  }, [coffees])

  const calculateCoffeePrice = useCallback(
    (ingredientIds) => {
      const basePrice = 2
      const ingredientPrices = ingredientIds.reduce((sum, ingId) => {
        const ingredient = ingredients.find((ing) => ing.id === ingId)
        return sum + (ingredient ? ingredient.price : 0)
      }, 0)
      return basePrice + ingredientPrices
    },
    [ingredients]
  )

  const toApiCoffeePayload = useCallback(
    (coffee) => {
      const price_gel = calculateCoffeePrice(coffee.ingredients || [])
      const usdRate = 2.7
      const price_usd = Number((price_gel / usdRate).toFixed(2))

      return {
        name: coffee.title,
        title: coffee.title,
        description: coffee.description,
        long_description: coffee.long_description ?? null,
        image_url: coffee.image || null,
        image: coffee.image || null,
        price_usd,
        price_gel,
        country: coffee.country,
        caffeine: coffee.caffeine,
        ingredients: coffee.ingredients || [],
      }
    },
    [calculateCoffeePrice]
  )

  const addIngredient = (ingredient) => {
    if (isApiConnected) {
      apiClient
        .createIngredient(ingredient)
        .then((created) => {
          setIngredients((prev) => {
            const updated = normalizeIngredientIds([...prev, normalizeIngredientFromApi(created)])
            saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to create ingredient:', err))
      return null
    }

    setIngredients((prev) => {
      const nextId = getNextSequentialIngredientId(prev)
      const newIngredient = {
        ...ingredient,
        id: nextId,
      }
      const updated = [...prev, newIngredient]
      saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
      return updated
    })
    return null
  }

  const updateIngredient = (id, updatedIngredient) => {
    if (isApiConnected) {
      apiClient
        .updateIngredient(id, { ...updatedIngredient, id })
        .then((saved) => {
          setIngredients((prev) => {
            const updated = prev.map((ing) => (ing.id === id ? normalizeIngredientFromApi(saved) : ing))
            saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to update ingredient:', err))
      return
    }

    setIngredients((prev) => {
      const updated = prev.map((ing) => (ing.id === id ? { ...updatedIngredient, id } : ing))
      saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
      return updated
    })
  }

  const deleteIngredient = (id) => {
    if (isApiConnected) {
      apiClient
        .deleteIngredient(id)
        .then(() => {
          setIngredients((prev) => {
            const updated = prev.filter((ing) => ing.id !== id)
            saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
            return updated
          })

          setCoffees((prev) => {
            const updated = prev.map((coffee) => ({
              ...coffee,
              ingredients: coffee.ingredients.filter((ingId) => ingId !== id),
            }))
            saveToStorage(STORAGE_KEYS.COFFEES, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to delete ingredient:', err))
      return
    }

    setIngredients((prev) => {
      const updated = prev.filter((ing) => ing.id !== id)
      saveToStorage(STORAGE_KEYS.INGREDIENTS, updated)
      return updated
    })
    
    setCoffees((prev) => {
      const updated = prev.map((coffee) => ({
        ...coffee,
        ingredients: coffee.ingredients.filter((ingId) => ingId !== id),
      }))
      saveToStorage(STORAGE_KEYS.COFFEES, updated)
      return updated
    })
  }

  const addCoffee = (coffee) => {
    if (isApiConnected) {
      const payload = toApiCoffeePayload(coffee)
      apiClient
        .createCoffee(payload)
        .then((created) => {
          setCoffees((prev) => {
            const updated = normalizeCoffeeIds([...prev, normalizeCoffeeFromApi(created)])
            saveToStorage(STORAGE_KEYS.COFFEES, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to create coffee:', err))
      return null
    }

    const newCoffee = { ...coffee }
    setCoffees((prev) => {
      const updated = [...prev, { ...newCoffee, id: getNextNumericId(prev) }]
      saveToStorage(STORAGE_KEYS.COFFEES, updated)
      return updated
    })
    return getNextNumericId(coffees)
  }

  const updateCoffee = (id, updatedCoffee) => {
    if (isApiConnected) {
      const payload = toApiCoffeePayload({ ...updatedCoffee, id })
      apiClient
        .updateCoffee(id, payload)
        .then((saved) => {
          setCoffees((prev) => {
            const updated = prev.map((coffee) => (coffee.id === id ? normalizeCoffeeFromApi(saved) : coffee))
            saveToStorage(STORAGE_KEYS.COFFEES, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to update coffee:', err))
      return
    }

    setCoffees((prev) => {
      const updated = prev.map((coffee) =>
        coffee.id === id ? { ...updatedCoffee, id } : coffee
      )
      saveToStorage(STORAGE_KEYS.COFFEES, updated)
      return updated
    })
  }

  const deleteCoffee = (id) => {
    if (isApiConnected) {
      apiClient
        .deleteCoffee(id)
        .then(() => {
          setCoffees((prev) => {
            const updated = prev.filter((coffee) => coffee.id !== id)
            saveToStorage(STORAGE_KEYS.COFFEES, updated)
            return updated
          })
        })
        .catch((err) => console.error('Failed to delete coffee:', err))
      return
    }

    setCoffees((prev) => {
      const updated = prev.filter((coffee) => coffee.id !== id)
      saveToStorage(STORAGE_KEYS.COFFEES, updated)
      return updated
    })
  }

  const value = {
    ingredients,
    coffees,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addCoffee,
    updateCoffee,
    deleteCoffee,
    calculateCoffeePrice,
    isApiConnected,
    loading,
  }

  return <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>
}
