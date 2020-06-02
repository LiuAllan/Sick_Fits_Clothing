import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Dot = styled.div`
	background: ${props => props.theme.red};
	color: white;
	border-radius: 50%;
	padding: 0.5rem;
	line-height: 2rem;
	min-width: 3rem;
	margin-left: 1rem;
	font-weight: 100;
	font-feature-settings: 'tnum';
	fon-variant-numeric: tabular-nums;
`;

const AnimationStyles = styled.span`
	position: relative;
	.count {
		display: block;
		position: relative;
		transition: all 0.4s;
		backface-visibility: hidden;
	}
	/*Initial state of the entered duplicate Dot*/
	.count-enter {
		transform: scale(2) rotateX(0.5turn);
	}

	/*New Dot rotates to forward facing*/
	.count-enter-active {
		transform: rotateX(0);
	}

	/*Old Dot begins exit forward facing*/
	.count-exit {
		top: 0;
		position: absolute;
		transform: rotateX(0);
	}

	/*Old Dot exits by flipping 180 degrees as the new Dot enters by flipping in*/
	.count-exit-active {
		transform: scale(2) rotateX(0.5turn);
	}
`;

//Cart counter animation. Doubles the dot when the counter increments for 4 seconds before going to the new value

const CartCount = (props) => (
	<AnimationStyles>
		<TransitionGroup>
			<CSSTransition 
				unmountOnExit 
				className="count" 
				classNames="count" 
				key={props.count} 
				timeout={{ enter: 400, exit: 400}}
			>
				<Dot>{props.count}</Dot>
			</CSSTransition>
		</TransitionGroup>
	</AnimationStyles>
);
// This destructured props
// const CartCount =({ count }) => (
// 	<Dot>{count}</Dot>
// );

export default CartCount;