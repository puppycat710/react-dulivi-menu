import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LoadingScreen } from '../components/LoadingScreen'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import ComplementList from '../components/ComplementList'
import { CounterProduct } from '../components/CounterProduct'
import { api } from '../services/api'

export function ProductPage() {
	const { productSlug, storeSlug } = useParams()
	const [product, setProduct] = useState(null)
	const [quantity, setQuantity] = useState(1)
	const [selectedComplements, setSelectedComplements] = useState({})
	const [observation, setObservation] = useState('')
	const [totalPrice, setTotalPrice] = useState(0)
	const [complementGroups, setComplementGroups] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await api.get(`/product/slug/${productSlug}`)
				const data = res.data.data
				setProduct(data)
			} catch (err) {
				console.error(err)
			}
		}
		fetchData()
	}, [storeSlug])
	// total price
	useEffect(() => {
		if (!product) return

		let base = Number(product.price) * quantity
		let compTotal = 0

		Object.keys(selectedComplements).forEach((groupId) => {
			const group = selectedComplements[groupId]

			if (Array.isArray(group)) {
				// RADIO / CHECKBOX
				group.forEach((compId) => {
					const comp = complementGroups.flatMap((g) => g.complements).find((c) => c.id === Number(compId))

					if (comp) compTotal += Number(comp.price)
				})
			} else {
				// COUNTER
				Object.keys(group).forEach((compId) => {
					const comp = complementGroups.flatMap((g) => g.complements).find((c) => c.id === Number(compId))

					if (comp) compTotal += Number(comp.price) * group[compId]
				})
			}
		})

		sessionStorage.setItem('total_price', base + compTotal)
		setTotalPrice(base + compTotal)
	}, [product, quantity, JSON.stringify(selectedComplements)])
	// counter change
	function handleCounterChange(value) {
		setQuantity(value)
	}
	// add to cart
	function addToCart() {
		const cart = JSON.parse(sessionStorage.getItem('cart') || '{}')

		if (!cart.fk_store_id) {
			cart.fk_store_id = product.fk_store_id
			cart.items = []
		}

		const complementsArray = []

		Object.keys(selectedComplements).forEach((groupId) => {
			const group = selectedComplements[groupId]

			if (Array.isArray(group)) {
				// RADIO ou CHECKBOX
				group.forEach((compId) => {
					complementsArray.push({
						fk_complement_id: compId,
						quantity: 1,
					})
				})
			} else {
				// COUNTER
				Object.keys(group).forEach((compId) => {
					complementsArray.push({
						fk_complement_id: parseInt(compId),
						quantity: group[compId],
					})
				})
			}
		})

		cart.items.push({
			quantity,
			fk_product_id: product.id,
			complements: complementsArray,
		})

		sessionStorage.setItem('cart', JSON.stringify(cart))
		console.log(cart)

		if (storeSlug) {
			navigate(`/${storeSlug}`)
		} else {
			navigate('/') // fallback
		}
	}

	if (!product) return <LoadingScreen />

	return (
		<div className='relative'>
			{/* Botão voltar */}
			<button
				className='fixed top-2 left-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-lg text-sm'
				onClick={() => (storeSlug ? navigate(`/${storeSlug}`) : navigate('/'))}
			>
				← Voltar
			</button>

			{/* Produto */}
			<div className='max-w-[475px] mx-auto pb-24'>
				<img src={product.image} width='100%' height={360} className='w-full h-[360px] object-cover object-center' />
				<main className='flex flex-col p-4 text-[#20293b] leading-[1.5]'>
					<span className='text-2xl font-bold'>{product.title}</span>
					<span className='text-[#525866] text-sm mt-2'>{product.description}</span>
					<span className='text-sm mt-6'>
						A partir de <span className='font-bold'>R$ {product.price}</span>
					</span>
					<hr className='border-[#0000001F] my-4 w-full' />
				</main>
				<ComplementList
					product_id={product.id}
					onSelectChange={(selected, groups) => {
						setSelectedComplements(selected)
						setComplementGroups(groups)
					}}
				/>
				<div className='flex flex-col gap-2 p-4'>
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
			</div>

			<footer className='w-full flex items-center justify-between px-5 py-3.5 fixed bottom-0 box-shadow-dulivi bg-white'>
				<CounterProduct quantity={quantity} onChange={handleCounterChange} />
				<button className='w-fit px-4 bg-dulivi text-white py-3 rounded-2xl text-sm font-bold' onClick={addToCart}>
					Adicionar R$ {totalPrice.toFixed(2)}
				</button>
			</footer>
		</div>
	)
}
