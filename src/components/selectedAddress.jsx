import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SvgDeliveryTime from './svg/SvgDeliveryTime'
import { Motorbike, Loader2 } from 'lucide-react'
import { api } from '../services/api.js'

export default function SelectedAddress() {
	const [store, setStore] = useState(null)
	const { storeSlug } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	// Buscar dados da loja
	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password

				setStore(store_data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			} finally {
				setIsLoading(false)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])

	if (isLoading) {
		return (
			<div className='flex justify-center items-center gap-2 my-4 text-blue-600 font-bold'>
				<div className='spinner' />
				<p>Calculando tempo e valor de entrega...</p>
			</div>
		)
	}

	return (
		<>
			<div className='mt-3 text-blue-600 font-semibold flex flex-col gap-1'>
				<div className='flex items-center gap-2'>
					<SvgDeliveryTime width={18} height={18} />
					<p>
						{store?.delivery_time_min} - {store?.delivery_time_max} min
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Motorbike width={18} height={18} />
					<p>
						{Number(store?.default_delivery_fee || 0).toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						})}
					</p>
				</div>
			</div>
		</>
	)
}
