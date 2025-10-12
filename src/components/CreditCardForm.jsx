'use client'

import { useState } from 'react'
import {
	initMercadoPago,
	createCardToken,
	CardNumber,
	SecurityCode,
	ExpirationDate,
} from '@mercadopago/sdk-react'

initMercadoPago('TEST-1474a6a4-d256-4733-8b93-91472a5c72e5') // sua public key de teste

export default function CreditCardForm() {
	const [formData, setFormData] = useState({
		cardholderName: '',
		identificationType: 'CPF',
		identificationNumber: '',
	})

	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const response = await createCardToken({
				cardholderName: formData.cardholderName,
				identificationType: formData.identificationType,
				identificationNumber: formData.identificationNumber,
			})
			setToken(response)
			console.log('Token criado:', response)
		} catch (error) {
			console.error('Erro ao criar token do cartão:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white'>
			<h2 className='text-lg font-bold mb-4'>Cadastrar Cartão</h2>
			<form onSubmit={handleSubmit} className='space-y-3'>
				<CardNumber
					placeholder='Número do Cartão'
					className='border p-2 w-full'
				/>
				<ExpirationDate
					placeholder='MM/AA'
					className='border p-2 w-full'
					mode='short'
				/>
				<SecurityCode placeholder='CVV' className='border p-2 w-full' />

				<input
					name='cardholderName'
					placeholder='Nome do Titular'
					onChange={handleChange}
					type='text'
					className='border p-2 w-full'
					required
				/>

				<input
					name='identificationNumber'
					placeholder='CPF'
					onChange={handleChange}
					type='tel'
					inputMode='numeric'
					pattern='\d*'
					minLength={11}
					maxLength={11}
					className='border p-2 w-full'
					required
				/>

				<button
					type='submit'
					disabled={loading}
					className='bg-blue-500 text-white px-4 py-2 rounded'
				>
					{loading ? 'Gerando Token...' : 'Cadastrar'}
				</button>
			</form>

			{token && (
				<div className='mt-4 p-2 bg-gray-100 rounded'>
					<p className='font-bold'>Token Gerado:</p>
					<pre className='break-words text-sm'>
						{JSON.stringify(token, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
