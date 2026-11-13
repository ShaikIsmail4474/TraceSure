
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getDashboardData = async () => {
  const [products, suppliers, batches, shipments, recalls, auditLogs] =
    await Promise.all([
      api.get('/products/'),
      api.get('/suppliers/'),
      api.get('/batches/'),
      api.get('/shipments/'),
      api.get('/recalls/'),
      api.get('/audit-logs/'),
    ])

  return {
    products: products.data,
    suppliers: suppliers.data,
    batches: batches.data,
    shipments: shipments.data,
    recalls: recalls.data,
    auditLogs: auditLogs.data,
  }
}

export default api
