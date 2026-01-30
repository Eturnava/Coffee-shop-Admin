import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCoffeeContext } from '../../context/CoffeeContext'
import styles from './ManageIngredients.module.css'

const ManageIngredients = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useCoffeeContext()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    strength: 'Low',
    flavor: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateIngredient(editingId, formData)
      setEditingId(null)
    } else {
      addIngredient(formData)
    }
    setFormData({
      name: '',
      price: '',
      description: '',
      strength: 'Low',
      flavor: '',
    })
  }

  const handleEdit = (ingredient) => {
    setEditingId(ingredient.id)
    setFormData({
      name: ingredient.name,
      price: ingredient.price,
      description: ingredient.description,
      strength: ingredient.strength,
      flavor: ingredient.flavor,
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      deleteIngredient(id)
    }
  }

  const getDisplayId = (ingredient) => {
    if (ingredient?.displayId) return ingredient.displayId
    const id = String(ingredient?.id || '')
    return id ? id.slice(0, 8).toUpperCase() : ''
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      name: '',
      price: '',
      description: '',
      strength: 'Low',
      flavor: '',
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Ingredients</h1>
        <Link to="/" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>

      <div className={styles.tableSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Strength</th>
              <th>Flavor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{getDisplayId(ingredient)}</td>
                <td>{ingredient.name}</td>
                <td>{ingredient.price.toFixed(2)} GEL</td>
                <td>{ingredient.strength}</td>
                <td>{ingredient.flavor}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleEdit(ingredient)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>
          {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Ingredient Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price (GEL)</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price}
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
            <label htmlFor="strength">Strength</label>
            <select
              id="strength"
              name="strength"
              value={formData.strength}
              onChange={handleInputChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="flavor">Flavor Profile</label>
            <input
              type="text"
              id="flavor"
              name="flavor"
              value={formData.flavor}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {editingId ? 'Update Ingredient' : 'Add Ingredient'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageIngredients
