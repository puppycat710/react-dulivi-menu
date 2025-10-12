import Lottie from 'lottie-react'
import loadingAnimation from '../assets/loading.json'

export function LoadingScreen() {
	return (
		<div className='w-full h-screen flex items-center justify-center bg-red'>
			<Lottie
				animationData={loadingAnimation}
				style={{ width: 800, height: 800 }}
				loop
				autoplay
			/>
		</div>
	)
}
