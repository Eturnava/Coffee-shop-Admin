import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CoffeeProvider } from './context/CoffeeContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import ManageIngredients from './pages/ManageIngredients/ManageIngredients'
import AddCoffee from './pages/AddCoffee/AddCoffee'
import ManageCoffees from './pages/ManageCoffees/ManageCoffees'
import ViewCoffee from './pages/ViewCoffee/ViewCoffee'

function App() {
  return (
    <CoffeeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ingredients" element={<ManageIngredients />} />
            <Route path="/coffees" element={<ManageCoffees />} />
            <Route path="/coffees/add" element={<AddCoffee />} />
            <Route path="/coffees/edit/:id" element={<AddCoffee />} />
            <Route path="/coffees/view/:id" element={<ViewCoffee />} />
          </Routes>
        </Layout>
      </Router>
    </CoffeeProvider>
  )
}

export default App
