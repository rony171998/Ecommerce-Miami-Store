import clsx from 'clsx';
import {useAppDispatch,useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {disableBodyScroll,enableBodyScroll,clearAllBodyScrollLocks} from 'body-scroll-lock';
import {useEffect,useRef} from 'react';
import {setIsOpened} from '../redux/reducers/asideMenu';
import HeaderCart from './cart/HeaderCart';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import AsideMenuList from './asideMenu/MenuList';
import {IMenuItem} from '../@types/components';
import {useDrag} from '@use-gesture/react';

export default function AsideMenu({menuList}:{menuList?:IMenuItem[]}) {
	const rootEl = useRef(null);
	const isOpened = useAppSelector((state: RootState) => state.asideMenu.isOpened);
	const isRouteChanging = useAppSelector((state: RootState) => state.app.isRouteChanging);
	const dispatch = useAppDispatch();

	const closeIfOpened = () => {
		if (isOpened) {
			dispatch(setIsOpened(false));
		}
	};

	const onEscPressed = (e: KeyboardEvent) => {
		if (e.defaultPrevented || !isOpened) {
			return;
		}

		if (e.key !== undefined && e.key === 'Escape') {
			closeIfOpened();
		} else if (e.keyCode !== undefined && e.keyCode === 27) {
			closeIfOpened();
		}
	};

	const enableSwipe = useRef(() => {
		const body = document.querySelector('body');
		body!.style.touchAction = 'none';
	});

	const disableSwipe = useRef(() => {
		const body = document.querySelector('body');
		body!.style.touchAction = 'auto';
	});

	useEffect(() => {
		if (isRouteChanging) closeIfOpened();
	}, [isRouteChanging]); //eslint-disable-line

	useEffect(() => {
		if (isOpened) {
		  if (rootEl.current) {
			disableBodyScroll(rootEl.current);
		  }

		  enableSwipe.current(); // Llamamos a la función enableSwipe para habilitar el swipe
		  window.addEventListener('resize', closeIfOpened);
		  window.addEventListener('keydown', onEscPressed);
		} else {
		  if (rootEl.current) {
			enableBodyScroll(rootEl.current);
		  }

		  disableSwipe.current(); // Llamamos a la función disableSwipe para deshabilitar el swipe
		  window.removeEventListener('resize', closeIfOpened);
		  window.removeEventListener('keydown', onEscPressed);
		}

		return () => {
		  clearAllBodyScrollLocks();
		  window.removeEventListener('resize', closeIfOpened);
		  window.removeEventListener('keydown', onEscPressed);
		  disableSwipe.current();//Llamamos a la función disableSwipe al desmontar el componente
		};
	  },[isOpened]);

	  // Set the drag hook and define component movement based on gesture data
		const bind =useDrag(({down,movement:[mx]})=>{
			if (down && mx > 100) {
			closeIfOpened();
			}
		});

	return (
		<aside
			{...bind()}
			className={clsx('aside-menu',{'aside-menu_visible':isOpened})} ref={rootEl}>
			<div className='aside-menu__header'>
				<HeaderCart className={'cart-header cart-header_horizontal'} />
				<button className='btn' onClick={closeIfOpened} >
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			{menuList && <AsideMenuList menuList={menuList} />}
		</aside>
	);
}