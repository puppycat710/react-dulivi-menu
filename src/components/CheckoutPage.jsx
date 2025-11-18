import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CounterProduct } from '../components/CounterProduct'
import { api } from '../services/api'

export default function CheckoutPage() {
	const [cart, setCart] = useState(null)
	const [cartWithDetails, setCartWithDetails] = useState([])
	const navigate = useNavigate()
	const { storeSlug } = useParams()

	// Carregar carrinho do sessionStorage
	useEffect(() => {
		const storedCart = JSON.parse(sessionStorage.getItem('cart') || '{}')
		setCart({
			items: storedCart.items || [],
			fk_store_id: storedCart.fk_store_id || null,
		})
	}, [])
	// Redirecionar se o carrinho estiver vazio
	useEffect(() => {
		if (cart && cart.items.length === 0) {
			navigate(`/${storeSlug}`)
		}
	}, [cart, navigate, storeSlug])
	// Buscar detalhes dos produtos e complementos
	useEffect(() => {
		if (!cart || !cart.items.length) return

		const fetchCartDetails = async () => {
			try {
				const detailedItems = await Promise.all(
					cart.items.map(async (item) => {
						const productRes = await api.get(`/product/${item.fk_product_id}`)
						const productData = productRes.data.data

						const complementsWithDetails = await Promise.all(
							(item.complements || []).map(async (c) => {
								const compRes = await api.get(`/complement?id=${c.fk_complement_id}`)
								return {
									...compRes.data,
									quantity: c.quantity,
								}
							})
						)

						return {
							...productData,
							quantity: item.quantity,
							complements: complementsWithDetails,
						}
					})
				)
				setCartWithDetails(detailedItems)
			} catch (err) {
				console.error('Erro ao carregar carrinho:', err)
			}
		}

		fetchCartDetails()
	}, [cart])

	const handleQuantityChange = (index, value) => {
		const newItems = [...cart.items]
		newItems[index].quantity = value
		setCart((prev) => ({ ...prev, items: newItems }))
		sessionStorage.setItem('cart', JSON.stringify({ ...cart, items: newItems }))
	}

	const removeItem = (index) => {
		const newItems = cart.items.filter((_, i) => i !== index)
		setCart((prev) => ({ ...prev, items: newItems }))
		sessionStorage.setItem('cart', JSON.stringify({ ...cart, items: newItems }))
	}

	// Função para formatar valores com vírgula
	const formatPrice = (value) => value.toFixed(2).replace('.', ',')

	// Total do carrinho (produto * quantidade + soma dos complementos)
	const total = cartWithDetails.reduce((acc, item) => {
		const productTotal = item.price * item.quantity
		const complementsTotal = (item.complements || []).reduce((a, c) => a + (c.price || 0) * c.quantity, 0)
		return acc + productTotal + complementsTotal
	}, 0)

	if (!cart || !cartWithDetails.length) return null

	return (
		<div className='max-w-[700px] mx-auto p-4 flex flex-col gap-4'>
			<h1 className='text-xl font-bold text-center'>Sua Sacola</h1>

			{cartWithDetails.map((item, index) => {
				const itemTotal =
					item.price * item.quantity + (item.complements || []).reduce((a, c) => a + (c.price || 0) * c.quantity, 0)

				return (
					<div key={index} className='flex gap-4 border-b pb-3'>
						<img src={item.image || '/assets/image.png'} alt={item.title} className='w-20 h-20 object-cover rounded' />
						<div className='flex-1 flex flex-col justify-between'>
							<div>
								<h2 className='font-medium'>{item.title}</h2>
								{item.complements?.length > 0 && (
									<ul className='text-sm text-gray-600'>
										{item.complements.map((c, i) => (
											<li key={i}>
												{c.quantity} {c.title} {c.price > 0 && `+ R$ ${formatPrice(c.price)}`}
											</li>
										))}
									</ul>
								)}
							</div>
							<div className='flex items-center justify-between mt-2'>
								<span className='font-bold'>R$ {formatPrice(itemTotal)}</span>
								<div className='flex items-center gap-2'>
									<CounterProduct quantity={item.quantity} onChange={(value) => handleQuantityChange(index, value)} />
									<button onClick={() => removeItem(index)} className='text-red-500 font-bold px-2'>
										×
									</button>
								</div>
							</div>
						</div>
					</div>
				)
			})}

			<div className='flex justify-between font-bold text-lg mt-4'>
				<span>Total</span>
				<span>R$ {formatPrice(total)}</span>
			</div>

			<div className='flex flex-col gap-2 mt-4'>
				<button
					onClick={() => navigate(-1)}
					className='w-full border border-green-500 text-green-500 py-3 rounded font-bold'
				>
					Adicionar mais itens
				</button>
				<button
					onClick={() => alert('Seguir para pagamento')}
					className='w-full bg-green-500 text-white py-3 rounded font-bold'
				>
					Próximo
				</button>
			</div>
		</div>
	)
}
