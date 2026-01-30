import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCoffeeContext } from '../../context/CoffeeContext'
import styles from './ViewCoffee.module.css'

const ViewCoffee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { coffees, ingredients, calculateCoffeePrice, deleteCoffee } = useCoffeeContext()

  const coffee = coffees.find((c) => c.id === id)

  if (!coffee) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Coffee not found</h2>
          <Link to="/" className={styles.backButton}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = calculateCoffeePrice(coffee.ingredients)
  const coffeeIngredients = coffee.ingredients
    .map((ingId) => ingredients.find((ing) => ing.id === ingId))
    .filter(Boolean)

  const displayId = coffee.displayId || String(coffee.id).slice(0, 8).toUpperCase()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      deleteCoffee(coffee.id)
      navigate('/')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{coffee.title}</h1>
        <Link to="/" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {coffee.image && coffee.image !== 'https://example.com/ethiopian.jpg' &&
          coffee.image !== 'https://example.com/colombian.jpg' ? (
            <img src={coffee.image} alt={coffee.title} className={styles.image} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{coffee.title}</span>
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailGroup}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{coffee.description}</p>
          </div>

          <div className={styles.detailGroup}>
            <h2 className={styles.sectionTitle}>Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Country of Origin:</span>
                <span className={styles.value}>{coffee.country}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Caffeine:</span>
                <span className={styles.value}>{coffee.caffeine}mg</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Total Price:</span>
                <span className={styles.value}>{totalPrice.toFixed(2)} GEL</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Coffee ID:</span>
                <span className={styles.value}>{displayId}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailGroup}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            {coffeeIngredients.length > 0 ? (
              <div className={styles.ingredientsList}>
                {coffeeIngredients.map((ingredient) => (
                  <div key={ingredient.id} className={styles.ingredientCard}>
                    <h3 className={styles.ingredientName}>{ingredient.name}</h3>
                    <div className={styles.ingredientDetails}>
                      <span>
                        <strong>Price:</strong> {ingredient.price.toFixed(2)} GEL
                      </span>
                      <span>
                        <strong>Strength:</strong> {ingredient.strength}
                      </span>
                      <span>
                        <strong>Flavor:</strong> {ingredient.flavor}
                      </span>
                    </div>
                    <p className={styles.ingredientDescription}>{ingredient.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noIngredients}>No ingredients added to this coffee.</p>
            )}
          </div>

          <div className={styles.actions}>
            <Link to={`/coffees/edit/${coffee.id}`} className={styles.editButton}>
              Edit Coffee
            </Link>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete Coffee
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCoffee
