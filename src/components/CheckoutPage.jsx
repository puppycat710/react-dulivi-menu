import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { CounterCheckout } from './CounterCheckout'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { X } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'

export default function CheckoutPage() {
	const [cart, setCart] = useState(null)
	const [observation, setObservation] = useState('')
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
		<div className='max-w-[474px] mx-auto flex flex-col gap-4 pt-8 lg:px-0 px-4 relative'>
			<h1 className='text-sm font-bold text-center'>Sua sacola</h1>
			<i
				onClick={() => navigate(`/${storeSlug}`)}
				className='absolute top-4 left-4 cursor-pointer shadow-back rounded-full p-1 text-dulivi'
			>
				<ChevronLeft />
			</i>
			<hr className='border-[#0000001F] w-full mb-3' />

			{cartWithDetails.map((item, index) => {
				const itemTotal =
					item.price * item.quantity + (item.complements || []).reduce((a, c) => a + (c.price || 0) * c.quantity, 0)

				return (
					<div key={index} className='flex gap-4 relative'>
						<button onClick={() => removeItem(index)} className='absolute top-0 right-0 cursor-pointer'>
							<X strokeWidth={2} color='#9CA5B8' className='w-4.5 h-4.5' />
						</button>
						<img src={item.image || '/assets/image.png'} alt={item.title} className='w-20 h-20 object-cover rounded' />
						<div className='flex-1 flex justify-between'>
							<div className='flex flex-col'>
								<h2 className='font-semibold text-sm'>{item.title}</h2>
								{item.complements?.length > 0 && (
									<ul className='text-xs text-gray-600'>
										{item.complements.map((c, i) => (
											<li key={i} className='flex gap-2 items-center text-[#20293B]'>
												<span>{c.quantity}</span>
												<span>{c.title}</span>
											</li>
										))}
									</ul>
								)}
								<span className='font-bold text-sm text-[#20293B] mt-1'>R$ {formatPrice(itemTotal)}</span>
							</div>
							<div className='flex items-end justify-center mt-2'>
								<div className='flex items-center gap-2'>
									<CounterCheckout
										quantity={item.quantity}
										onChange={(value) => handleQuantityChange(index, value)}
										onRemove={() => removeItem(index)}
									/>
								</div>
							</div>
						</div>
					</div>
				)
			})}

			<hr className='border-[#0000001F] w-full my-2' />

			<div className='flex justify-between font-bold text-base mt- text-[#20293B]'>
				<span>Total</span>
				<span>R$ {formatPrice(total)}</span>
			</div>

			<hr className='border-[#0000001F] w-full my-2' />

			<div className='flex flex-col gap-1.5 text-[#525866] mb-40'>
				<Label htmlFor='observation' className='text-sm font-bold'>
					Observações?
				</Label>
				<Input
					id='observation'
					name='observation'
					type='text'
					placeholder='Observações sobre o produto'
					value={observation}
					onChange={(e) => setObservation(e.target.value)}
					className='border-[#0000003D]'
				/>
			</div>
			<div className='fixed bottom-0 left-0 p-4 w-full box-shadow-checkout text-sm bg-white'>
				<div className='flex flex-col gap-2'>
					<button
						onClick={() => navigate(-1)}
						className='w-full border border-dulivi text-dulivi py-2 rounded-xl font-bold animation-pulse-border cursor-pointer'
					>
						Adicionar mais itens
					</button>
					<button
						onClick={() => navigate(`/${storeSlug}/checkout/delivery`)}
						className='w-full bg-dulivi text-white py-2 rounded-xl font-bold cursor-pointer'
					>
						Próximo
					</button>
				</div>
			</div>
		</div>
	)
}
