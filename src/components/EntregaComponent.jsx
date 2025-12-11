import { useEffect, useState } from 'react'
import { api } from '../services/api'
import DrawerAddress from './DrawerAddress'
import SelectCityAndDistrict from './SelectCityAndDistrict'

export default function EntregaComponent({ selectedAddress, setSelectedAddress }) {
	const [hasCustomAreas, setHasCustomAreas] = useState(false)
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	// Buscar bairros
	useEffect(() => {
		const fetchDeliveryAreas = async () => {
			try {
				const res = await api.get(`/deliveryarea/all?fk_store_id=${fk_store_id}`)
				const data = res.data.data
				if (data?.length > 0) {
					setHasCustomAreas(true)
				}
			} catch (err) {}
		}

		fetchDeliveryAreas()
	}, [fk_store_id])

	return (
		<>
			{hasCustomAreas ? (
				<SelectCityAndDistrict selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
			) : (
				// SE NÃO TIVER BAIRROS → MOSTRA SEU FORM ATUAL
				<DrawerAddress selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
			)}
		</>
	)
}
