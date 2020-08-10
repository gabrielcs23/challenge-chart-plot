import React, { FunctionComponent } from 'react';
import './HandleIcon.css';

// Replicates prototype's handle icon with divs and proper css
export const HandleIcon: FunctionComponent = () => (
	<div className="handle-container">
		<div className="handle-box">
            <div className="handle-line" />
            <div className="handle-line" />
        </div>
	</div>
);