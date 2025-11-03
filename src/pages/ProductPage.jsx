import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { LoadingScreen } from '../components/LoadingScreen'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export function ProductPage() {
	const { slug } = useParams()
	const [product, setProduct] = useState(null)
	const [observation, setObservation] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const fetchData = async () => {
			const res = await api.get(`/product/slug/${slug}`)
			setProduct(res.data.data)
		}
		fetchData()
	}, [slug])

	if (!product) return <LoadingScreen />

	return (
		<div className='relative'>
			{/* Botão no topo */}
			<button
				className='fixed top-2 left-2 cursor-pointer bg-gray-200 px-3 py-1 rounded-lg text-sm'
				onClick={() => navigate(-1)}
			>
				← Voltar
			</button>
			{/* Produto */}
			<div className='max-w-[475px] mx-auto'>
				<img src={product.image} width={'100%'} height={360} className='w-full h-[360px] object-cover object-center' />
				<main className='flex  flex-col p-4 text-[#20293b] leading-[1.5]'>
					<span className='text-2xl font-bold'>{product.title}</span>
					<span className='text-[#525866] text-sm mt-2'>{product.description}</span>
					<span className='text-sm mt-6'>
						A partir de <span className='font-bold'>R$ {product.price}</span>
					</span>
					<hr className='border-[#0000001F] my-4 w-full'></hr>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='observation' className='text-sm font-bold'>
							Observaões?
						</Label>
						<Input
							id='observation'
							name='observation'
							type='text'
							placeholder='Observações sobre o produto'
							value={observation}
							onChange={(e) => {
								setObservation(e.target.value)
							}}
							className='border-[#0000003D]'
						/>
					</div>
				</main>
			</div>
		</div>
	)
}
