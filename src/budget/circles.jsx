import React from "react";
import { observer } from "mobx-react";

export const Circle = props => <circle {...props} />;

export default observer(props => {
	let {
		color = "black",
		data,
		xSelector,
		ySelector,
		hideTooltip,
		showTooltip,
		paddingTop,
		paddingLeft,
		r = 4
	} = props;
	let transform = `translate(${paddingLeft}, ${paddingTop})`;
	let transformed_data = data.map(d => ({
		cx: xSelector(d),
		cy: ySelector(d),
		onMouseOut: hideTooltip,
		onMouseEnter: e => {
			showTooltip({
				x: e.target.getAttribute("cx"),
				y: e.target.getAttribute("cy"),
				datum: d
			});
		},
		r: r,
		style: { fill: color, stroke: "black" }
	}));
	return (
		<g transform={transform}>
			{transformed_data.map((d, i) => <Circle key={i} {...d} />)}
		</g>
	);
});
