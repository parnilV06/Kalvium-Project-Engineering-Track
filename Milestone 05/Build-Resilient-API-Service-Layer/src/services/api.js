import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com'

const api = axios.create({ baseURL })

// Request interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
    } catch (e) {
      // localStorage may be unavailable in some environments; fail silently
    }
    return config
  },
  (err) => Promise.reject(err)
)

// Response interceptor: centralize common status handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response) {
      const status = err.response.status
      if (status === 401) {
        console.warn('Unauthorized - redirect or login required')
      } else if (status === 403) {
        console.warn('Forbidden - access denied')
      } else if (status >= 500) {
        console.warn('Server error - try again later')
      }
    } else {
      console.warn('Network error or no response from server', err?.message)
    }
    return Promise.reject(err)
  }
)

export async function getProducts() {
  const res = await api.get('/products')
  return res.data
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`)
  return res.data
}

export async function getProductsByCategory(category) {
  const res = await api.get(`/products/category/${encodeURIComponent(category)}`)
  return res.data
}

export async function getCategories() {
  const res = await api.get('/products/categories')
  return res.data
}

export async function getCart() {
  const res = await api.get('/carts/user/1')
  const carts = res.data
  if (!carts || carts.length === 0) return { products: [] }
  const latest = carts[carts.length - 1]
  const productDetails = await Promise.all(
    latest.products.map(async (item) => {
      const r = await api.get(`/products/${item.productId}`)
      return { ...r.data, quantity: item.quantity }
    })
  )
  return { ...latest, productDetails }
}

export async function addToCart(data) {
  const res = await api.post('/carts', data)
  return res.data
}

export async function deleteFromCart(id) {
  const res = await api.delete(`/carts/${id}`)
  return res.data
}

export async function getUser() {
  const res = await api.get('/users/1')
  return res.data
}

export async function updateUser(data) {
  const res = await api.put('/users/1', data)
  return res.data
}

export async function postReview(data) {
  const res = await api.post('/users', data)
  return res.data
}

export default api
