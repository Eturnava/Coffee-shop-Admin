import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCoffeeContext } from '../../context/CoffeeContext'
import styles from './AddCoffee.module.css'

const AddCoffee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { coffees, ingredients, addCoffee, updateCoffee } = useCoffeeContext()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    title: '',
    country: '',
    description: '',
    image: '',
    caffeine: '',
    ingredients: [],
  })

  useEffect(() => {
    if (isEditing) {
      const coffee = coffees.find((c) => c.id === id)
      if (coffee) {
        setFormData({
          title: coffee.title,
          country: coffee.country,
          description: coffee.description,
          image: coffee.image,
          caffeine: coffee.caffeine.toString(),
          ingredients: coffee.ingredients || [],
        })
      }
    }
  }, [id, isEditing, coffees])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIngredientChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
    setFormData((prev) => ({
      ...prev,
      ingredients: selectedOptions,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const coffeeData = {
      ...formData,
      caffeine: parseInt(formData.caffeine),
    }

    if (isEditing) {
      updateCoffee(id, coffeeData)
    } else {
      addCoffee(coffeeData)
    }
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEditing ? 'Edit Coffee' : 'Add New Coffee'}</h1>
        <Link to="/" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Coffee Name</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">Country of Origin</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="caffeine">Caffeine (mg)</label>
            <input
              type="number"
              id="caffeine"
              name="caffeine"
              value={formData.caffeine}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ingredients">Ingredients</label>
            <select
              id="ingredients"
              name="ingredients"
              multiple
              value={formData.ingredients}
              onChange={handleIngredientChange}
              className={styles.ingredientsSelect}
              required
            >
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} - {ingredient.price.toFixed(2)} GEL
                </option>
              ))}
            </select>
            <p className={styles.instruction}>
              Hold Ctrl (or Cmd) to select multiple ingredients
            </p>
          </div>

          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Update Coffee' : 'Add Coffee'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCoffee
