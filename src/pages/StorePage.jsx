import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { LoadingScreen } from '../components/LoadingScreen'
import { StoreNotFound } from '../components/StoreNotFound'
import { StoreHours } from '../components/StoreHours'
import StoreInfoCard from '../components/StoreInfo'
import { CategoryMenu } from '../components/CategoryMenu'
import ProductList from '../components/ProductList'
import SvgBag from '../components/svg/SvgBag'

export default function StorePage() {
	const { storeSlug } = useParams()
	const navigate = useNavigate()
	const [store, setStore] = useState(null)
	const [loading, setLoading] = useState(true)
	const [cartCount, setCartCount] = useState(0)
	const total_price = sessionStorage.getItem('total_price')
	// Buscar dados da loja
	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password
				sessionStorage.setItem('fk_store_id', store_data.id)
				sessionStorage.setItem('store_slug', store_data.slug)
				setStore(store_data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			} finally {
				setLoading(false)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])

	// Checar carrinho
	useEffect(() => {
		const cart = JSON.parse(sessionStorage.getItem('cart') || '{}')
		if (cart.items && cart.items.length > 0) {
			setCartCount(cart.items.length)
		} else {
			setCartCount(0)
		}

		// Opcional: atualizar em tempo real caso o usuário adicione produtos em outra aba
		const interval = setInterval(() => {
			const c = JSON.parse(sessionStorage.getItem('cart') || '{}')
			setCartCount(c.items?.length || 0)
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	if (loading) return <LoadingScreen />
	if (!store) return <StoreNotFound />

	return (
		<>
			<section className='w-full h-full flex justify-center'>
				<div className='max-w-[730px] w-full h-full flex flex-col gap-5 justify-center px-4'>
					<header className='w-full flex gap-4.5 mt-5'>
						<div className={`bg-[url(${store.image})] bg-cover bg-center w-[58px] h-[58px] rounded-2xl`}></div>
						<aside className='flex flex-col justify-center text-sm leading-[14px] font-bold'>
							<StoreHours store={store} />
						</aside>
					</header>
					<StoreInfoCard store={store} />
				</div>
			</section>

			<CategoryMenu />
			<ProductList store={store} />

			{/* Botão fixo do carrinho */}
			{cartCount > 0 && (
				<div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[96vw] flex justify-center items-center z-50 cart-shadow rounded-2xl text-center bg-dulivi'>
					<button
						onClick={() => navigate(`/${storeSlug}/checkout`)}
						className='text-white text-sm py-2.5 px-4 font-bold flex items-center justify-center gap-3 w-full cursor-pointer'
					>
						<div className='w-full flex items-center justify-between'>
							<i>
								<SvgBag />
							</i>
							<span>Ver sacola</span>
							<span>R$ {total_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
						</div>
					</button>
				</div>
			)}

			<footer className='w-full text-center mt-9 pb-3'>
				<span className='text-[#20293b] text-xs'>© 2025 Dulivi - 37.593.578/0001-09</span>
			</footer>
		</>
	)
}
