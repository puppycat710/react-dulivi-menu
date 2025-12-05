import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api.js'
import { MapPin } from 'lucide-react'

export default function RetiradaComponenet() {
	const [store, setStore] = useState(null)
	const [mapsLink, setMapsLink] = useState('')
	const { storeSlug } = useParams()

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/store/slug/${storeSlug}`)
				const store_data = res.data.data
				if (store_data.password) delete store_data.password
				const end = `${store_data?.store_street || ''} ${store_data?.store_number || ''}, ${
					store_data?.store_suburb || ''
				}, ${store_data?.store_city || ''} - ${store_data?.store_state || ''}, ${store_data?.store_zipcode || ''}`
				setMapsLink(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(end)}`)

				setStore(store_data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (storeSlug) fetchStore()
	}, [storeSlug])
	return (
		<>
			<div className='flex flex-col gap-1.5 mt-2'>
				<span className='text-xs text-[#747e91] font-semibold'>Endereço do restaurante:</span>
				<div className='flex flex-col gap-3'>
					<span className='text-sm font-bold'>
						{store?.store_street || ''}
						{store?.store_number ? `, ${store.store_number}` : ''}
						{store?.store_suburb ? ` - ${store.store_suburb}` : ''}
					</span>
					<a
						href={mapsLink}
						target='_blank'
						rel='noopener noreferrer'
						className='text-sm text-dulivi border-dulivi border-1 rounded-2xl mx-2 py-3 text-center font-bold flex items-center justify-center gap-2'
					>
						<MapPin size={20} />
						<span>Ver no mapa</span>
					</a>
				</div>
			</div>
		</>
	)
}
