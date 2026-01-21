import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.title}>Coffee Admin</h1>
          <p className={styles.subtitle}>Management Panel</p>
        </div>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/coffees/add"
            className={`${styles.navLink} ${location.pathname === '/coffees/add' || location.pathname.startsWith('/coffees/edit') ? styles.active : ''}`}
          >
            Add Coffee
          </Link>
          <Link
            to="/coffees"
            className={`${styles.navLink} ${location.pathname === '/coffees' && !location.pathname.includes('/add') && !location.pathname.includes('/edit') ? styles.active : ''}`}
          >
            Manage Coffees
          </Link>
          <Link
            to="/ingredients"
            className={`${styles.navLink} ${location.pathname === '/ingredients' ? styles.active : ''}`}
          >
            Manage Ingredients
          </Link>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Layout
