import { Hono } from 'hono'
import menuApi from './menu'
import ordersApi from './orders'
import adminApi from './admin'

const apiRouter = new Hono()

// Mount API sub-routers
apiRouter.route('/', menuApi)
apiRouter.route('/orders', ordersApi)
apiRouter.route('/admin', adminApi)

export default apiRouter
