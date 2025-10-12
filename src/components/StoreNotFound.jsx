import { AlertCircle } from 'lucide-react'

export function StoreNotFound() {
	return (
		<div className='w-full h-screen flex flex-col items-center justify-center gap-2 bg-gray-50 p-4 text-center'>
			<AlertCircle className='w-24 h-24 text-red-500 animate-pulse' />
			<h1 className='text-3xl sm:text-4xl font-bold text-gray-800'>
				Loja não encontrada
			</h1>
			<p className='text-gray-500'>
				O link que você acessou não corresponde a nenhuma loja ativa.
			</p>
			<a
				href='/'
				className='px-4 py-2 bg-dulivi text-white rounded-lg shadow hover:bg-dulivi/60 transition'
			>
				Voltar para Home
			</a>
		</div>
	)
}
