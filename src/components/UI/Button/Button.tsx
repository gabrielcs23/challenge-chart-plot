import React, { FunctionComponent } from 'react';
import './Button.css'

/**
 * Simple bootstrap-like button wrapper
 */

export const Button: FunctionComponent<ButtonProps> = ({content, disabled, onClick}: ButtonProps) => {
	
	return (
		<button
			className={`btn btn-primary ${disabled ? 'disabled' : ''}`}
			type="button"
			onClick={onClick}
		>
			{content}
		</button>
	)

}

/**
 * @property content: string that goes inside the button
 * @property disabled: is button disabled? (optional)
 * @property onClick: onClick callback
 */

type ButtonProps = {
	content: string,
	disabled?: boolean,
	onClick: () => any
}