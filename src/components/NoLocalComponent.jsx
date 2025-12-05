import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api.js'

export default function NoLocalComponent() {
	const [store, setStore] = useState(null)
	const { storeSlug } = useParams()

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password

				setStore(store_data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])
	return (
		<>
			<div className='flex flex-col gap-1.5 px-2'>
				<span className='text-xs text-[#747e91] font-semibold'>Endereço do restaurante:</span>
				<div className='flex flex-col gap-2.5'>
					<span className='text-sm font-bold'>
						{store?.store_street || ''}
						{store?.store_number ? `, ${store.store_number}` : ''}
						{store?.store_suburb ? ` - ${store.store_suburb}` : ''}
					</span>
					<span className='text-sm text-dulivi bg-dulivi/20 rounded py-3 text-center font-semibold'>
						Retire seu pedido no balcão
					</span>
				</div>
			</div>
		</>
	)
}
