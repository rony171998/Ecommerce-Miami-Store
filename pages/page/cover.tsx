import CoverTextInCenter from '../../components/CoverTextInCenter';
import bgImg from '../../assets/cover-bg.jpg';
import bgPortraitImg from '../../assets/cover-bg-portrait.jpg';

export default function CoverPage() {
	return (
		<>
			<CoverTextInCenter
				showChevronDown
				img={bgImg.src}
				imgPortrait={bgPortraitImg.src}
				content={{
					intro: 'Intro',
					head: 'Main header',
					subHead: 'subheader'
				}}
				shadow={{
					opacity: 0.5,
					backgroundColor: '#000'
				}}
				link={'http://google.com'}
			/>
			<div className='text-center' style={{minHeight: 200}}></div>
		</>
	);
}