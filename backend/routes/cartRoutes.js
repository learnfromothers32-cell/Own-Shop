import express from 'express'
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)     // ✅ FIXED: added slash and correct function
cartRouter.post('/update', authUser, updateCart) // ✅ FIXED: this was actually correct

export default cartRouter