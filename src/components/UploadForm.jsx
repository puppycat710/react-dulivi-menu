import { useState } from 'react'
import { api } from '../services/api'

export default function UploadForm() {
	const [imageFile, setImageFile] = useState(null)
	const [imageUrl, setImageUrl] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleUpload(e) {
		e.preventDefault()
		if (!imageFile) {
			alert('Selecione uma imagem primeiro!')
			return
		}

		setLoading(true)

		try {
			const formData = new FormData()
			formData.append('imagem', imageFile)

			const response = await api.post('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			setImageUrl(response.data.url)
			alert('Imagem enviada com sucesso!')
		} catch (error) {
			console.error('Erro no upload:', error.response || error.message) // Exibe mais detalhes
			alert('Erro ao enviar imagem.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<form
				onSubmit={handleUpload}
				style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
			>
				<input
					type='file'
					accept='image/*'
					onChange={(e) => setImageFile(e.target.files[0])}
					required
				/>
				<button type='submit' disabled={loading}>
					{loading ? 'Enviando...' : 'Enviar Imagem'}
				</button>

				{/* Exibir a imagem enviada, se existir */}
				{imageUrl && (
					<div>
						<p>Imagem enviada:</p>
						<img
							src={imageUrl}
							alt='Imagem enviada'
							style={{ width: '200px', marginTop: '10px' }}
						/>
					</div>
				)}
			</form>

			{imageUrl && <p>{imageUrl}</p>}
		</>
	)
}
