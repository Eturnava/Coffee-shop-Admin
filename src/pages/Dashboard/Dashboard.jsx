import { Link } from 'react-router-dom'
import { useCoffeeContext } from '../../context/CoffeeContext'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const { coffees, calculateCoffeePrice, deleteCoffee } = useCoffeeContext()

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      deleteCoffee(id)
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Coffee Dashboard</h1>
        <Link to="/coffees/add" className={styles.addButton}>
          Add New Coffee
        </Link>
      </div>

      <div className={styles.tableSection}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Origin</th>
              <th>Caffeine</th>
              <th>Price</th>
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

      <div className={styles.cardsSection}>
        <h2 className={styles.sectionTitle}>Coffee Cards</h2>
        <div className={styles.cardsGrid}>
          {coffees.map((coffee) => {
            const totalPrice = calculateCoffeePrice(coffee.ingredients)
            return (
              <div key={coffee.id} className={styles.card}>
                <div className={styles.cardImage}>
                  {coffee.image ? (
                    <img src={coffee.image} alt={coffee.title} />
                  ) : (
                    <div className={styles.placeholderImage}>{coffee.title}</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{coffee.title}</h3>
                  <p className={styles.cardDescription}>{coffee.description}</p>
                  <div className={styles.cardDetails}>
                    <p>
                      <strong>Origin:</strong> {coffee.country}
                    </p>
                    <p>
                      <strong>Caffeine:</strong> {coffee.caffeine}mg
                    </p>
                    <p>
                      <strong>Price:</strong> {totalPrice.toFixed(2)} GEL
                    </p>
                  </div>
                  <div className={styles.cardActions}>
                    <Link to={`/coffees/view/${coffee.id}`} className={styles.viewButton}>
                      View More
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
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
