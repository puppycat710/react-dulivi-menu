import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api' // sua instância do axios
import { LoadingScreen } from '../components/LoadingScreen'
import { StoreNotFound } from '../components/StoreNotFound'
import { StoreHours } from '../components/StoreHours'
import StoreInfoCard from '../components/StoreInfo'
import { CategoryMenu } from '../components/CategoryMenu'

export default function StorePage() {
	const { slug } = useParams()
	const [store, setStore] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${slug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password
				setStore(store_data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			} finally {
				setLoading(false)
			}
		}
		if (slug) fetchStore()
	}, [slug])

	if (loading) return <LoadingScreen />
	if (!store) return <StoreNotFound />

	return (
		<>
			<section className='w-full h-full flex justify-center'>
				<div className='max-w-[730px] w-full h-full flex flex-col gap-5 justify-center px-4'>
					<header className='w-full flex gap-4.5 mt-5'>
						<div
							className={`bg-[url(${store.image})] bg-cover bg-center w-[58px] h-[58px] rounded-2xl`}
						></div>
						<aside className='flex flex-col justify-center text-sm leading-[14px] font-bold text-[#525866]'>
							<StoreHours store={store} />
							<span className='font-normal mt-1 text-xs'>{store.store_location}</span>
						</aside>
					</header>
					<StoreInfoCard store={store} />
				</div>
			</section>
			<CategoryMenu />
		</>
	)
}
