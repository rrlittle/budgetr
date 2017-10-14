import React from "react";
import { observer } from "mobx-react";
import { line, curveStepAfter } from "d3";

export const Line = observer(props => {
	let {
		color = "black",
		cap = "round",
		width = 4,
		data,
		curve = curveStepAfter,
		paddingTop,
		paddingLeft,
		xSelector,
		ySelector
	} = props;
	let lineFoo = line()
		.x(xSelector)
		.y(ySelector)
		.curve(curve);
	return (
		<g transform={`translate(${paddingLeft},${paddingTop})`}>
			<path
				d={lineFoo(data)}
				strokeLinecap={cap}
				fill="none"
				stroke={color}
				strokeWidth={width}
			/>
		</g>
	);
});
