import { Link } from 'react-router-dom'
import { useCoffeeContext } from '../../context/CoffeeContext'
import styles from './ManageCoffees.module.css'

const ManageCoffees = () => {
  const { coffees, ingredients, deleteCoffee, calculateCoffeePrice } = useCoffeeContext()

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      deleteCoffee(id)
    }
  }

  const getIngredientNames = (ingredientIds) => {
    return ingredientIds
      .map((id) => {
        const ingredient = ingredients.find((ing) => ing.id === id)
        return ingredient ? ingredient.name : null
      })
      .filter(Boolean)
      .join(', ')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Coffees</h1>
        <div className={styles.headerActions}>
          <Link to="/coffees/add" className={styles.addButton}>
            Add New Coffee
          </Link>
          <Link to="/" className={styles.backButton}>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.tableSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Ingredients</th>
              <th>Description</th>
              <th>Image</th>
              <th>Country</th>
              <th>Caffeine</th>
              <th>totalPrice</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coffees.map((coffee) => {
              const totalPrice = calculateCoffeePrice(coffee.ingredients)
              return (
                <tr key={coffee.id}>
                  <td>{coffee.id}</td>
                  <td>{coffee.title}</td>
                  <td>{getIngredientNames(coffee.ingredients)}</td>
                  <td className={styles.descriptionCell}>
                    {coffee.description.length > 50
                      ? `${coffee.description.substring(0, 50)}...`
                      : coffee.description}
                  </td>
                  <td>
                    {coffee.image ? (
                      <a href={coffee.image} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{coffee.country}</td>
                  <td>{coffee.caffeine}mg</td>
                  <td>{totalPrice.toFixed(2)} GEL</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/coffees/view/${coffee.id}`} className={styles.viewButton}>
                        View
                      </Link>
                      <Link to={`/coffees/edit/${coffee.id}`} className={styles.editButton}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(coffee.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCoffees
