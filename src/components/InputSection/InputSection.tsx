import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material-palenight.css';
import './InputSection.css';
import React, { FunctionComponent, useState } from 'react'
import { Resizable, Enable } from 're-resizable';
import CodeMirror from 'react-codemirror';
import { EditorConfiguration } from 'codemirror';

export const InputSection: FunctionComponent = () => {
	const [input, setInput] = useState('');

	// Sets the resizable permission to only resize on the bottom direction
	const resizeDirection: Enable = {
		top:false,
		right:false,
		bottom:true,
		left:false,
		topRight:false,
		bottomRight:false,
		bottomLeft:false,
		topLeft:false 
	}

	/**
	 * Configuration to the input text area
	 * 
	 * mode: recognizes json as input
	 * 
	 * although a scrollbar style and a theme are set, both are customized in this component's stylesheet to better match the prototype
	 */
	const codeMirrorOptions: EditorConfiguration = {
		lineNumbers: true,
		mode: {name: 'javascript', json: true},
		scrollbarStyle: 'simple',
		theme: 'material-palenight'
	}

	return (
		<Resizable
			defaultSize={{
				width: 'auto',
				height: 300
			}}
			enable={resizeDirection}
		>
			<CodeMirror
				value={input}
				onChange={setInput}
				options={codeMirrorOptions}
			/>
		</Resizable>
	)
}