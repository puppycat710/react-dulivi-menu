import { useState } from 'react'
import EntregaComponent from './EntregaComponent'
import NoLocalComponent from './NoLocalComponent'
import RetiradaComponenet from './RetiradaComponenet'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { toast } from 'sonner'

export default function DeliveryAddress() {
	const [option, setOption] = useState('entrega')
	const [selectedAddress, setSelectedAddress] = useState(null)
	const navigate = useNavigate()
	const { storeSlug } = useParams()
	const session_id = sessionStorage.getItem('session_id')

	const handleNext = async () => {
		// Se for entrega, precisa ter endereço selecionado
		if (option === 'entrega' && !selectedAddress) {
			toast.error('Selecione um endereço antes de continuar!')
			return
		}

		// Se for entrega, monta endereço — senão manda null
		let addressString = null

		if (option === 'entrega') {
			addressString = `${selectedAddress.rua}, ${selectedAddress.numero} - ${selectedAddress.bairro}, ${
				selectedAddress.cidade
			} - ${selectedAddress.estado} ${selectedAddress.complemento ? ' - (' + selectedAddress.complemento + ')' : ''}`
		}

		const res = await api.put(`/session/update/${session_id}`, {
			data: {
				delivery_method: option,
				delivery_address: addressString, // só vem preenchido quando for entrega
			},
		})

		// navigate(`/${storeSlug}/checkout/payment`)
	}

	return (
		<>
			<div className='max-w-[474px] mx-auto flex flex-col gap-5 pt-8 lg:px-0 px-4 relative'>
				<i
					onClick={() => navigate(`/${storeSlug}/checkout`)}
					className='absolute top-4 left-4 cursor-pointer shadow-back rounded-full p-1 text-dulivi'
				>
					<ChevronLeft />
				</i>
				<h1 className='text-sm font-bold text-center'>Endereço de entrega</h1>
				<hr className='border-[#0000001F] w-full' />

				<div className='px-2'>
					<span className='text-xs text-[#747e91] font-semibold mb-4 block'>Como deseja receber seu pedido?</span>

					{/* CONTROLADO POR ESTADO */}
					<RadioGroup className='flex flex-col gap-5' value={option} onValueChange={(value) => setOption(value)}>
						<div className='flex items-center gap-3'>
							<RadioGroupItem
								value='entrega'
								id='entrega'
								className='
                cursor-pointer
                border-2
                border-[#0000008a]
                data-[state=checked]:border-dulivi
                data-[state=checked]:text-dulivi
                data-[state=checked]:ring-dulivi
                data-[state=checked]:ring-offset-2'
							/>
							<Label htmlFor='entrega' className='cursor-pointer'>
								Receber no meu endereço
							</Label>
						</div>

						<div className='flex items-center gap-3'>
							<RadioGroupItem
								id='no_local'
								className='
                cursor-pointer
                border-2
                border-[#0000008a]
                data-[state=checked]:border-dulivi
                data-[state=checked]:text-dulivi
                data-[state=checked]:ring-dulivi
                data-[state=checked]:ring-offset-2'
								value='no_local'
							/>
							<Label htmlFor='no_local' className='cursor-pointer'>
								Consumir no restaurante
							</Label>
						</div>

						<div className='flex items-center gap-3'>
							<RadioGroupItem
								id='retirada'
								className='
                cursor-pointer
                border-2
                border-[#0000008a]
                data-[state=checked]:border-dulivi
                data-[state=checked]:text-dulivi
                data-[state=checked]:ring-dulivi
                data-[state=checked]:ring-offset-2'
								value='retirada'
							></RadioGroupItem>
							<Label htmlFor='retirada' className='cursor-pointer'>
								Retirar no restaurante
							</Label>
						</div>
					</RadioGroup>
				</div>

				<hr className='border-[#0000001F] w-full' />

				{/* RENDERIZA APENAS O COMPONENTE SELECIONADO */}
				<div className='mb-20'>
					{option === 'entrega' && (
						<EntregaComponent selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
					)}
					{option === 'no_local' && <NoLocalComponent />}
					{option === 'retirada' && <RetiradaComponenet />}
				</div>

				<div className='fixed bottom-0 left-0 p-4 w-full box-shadow-checkout text-sm bg-white'>
					<button onClick={handleNext} className='w-full bg-dulivi text-white py-2 rounded-xl font-bold cursor-pointer'>
						Próximo
					</button>
				</div>
			</div>
		</>
	)
}
