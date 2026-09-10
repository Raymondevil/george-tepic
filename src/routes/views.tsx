import { Hono } from 'hono'
import { Home } from '../views/Home'
import { Caja } from '../views/Caja'
import { AdminLogin } from '../views/AdminLogin'
import { AdminCalculator } from '../views/AdminCalculator'
import { AdminInventory } from '../views/AdminInventory'

const viewsRouter = new Hono()

// Public views
viewsRouter.get('/', (c) => c.render(<Home />))
viewsRouter.get('/caja', (c) => c.render(<Caja />))

// Admin views
viewsRouter.get('/admin/login', (c) => c.render(<AdminLogin />))
viewsRouter.get('/admin/calculadora', (c) => c.render(<AdminCalculator />))
viewsRouter.get('/admin/inventario', (c) => c.render(<AdminInventory />))

export default viewsRouter
