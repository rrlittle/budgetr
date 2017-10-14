import React from "react";

export default props => {
	let { padding = {}, pos = {}, data = {}, display = "hidden" } = props;
	let { margin = 20, paddingLeft = 0, paddingTop = 0 } = padding;
	let { x = 0, y = 0 } = pos;
	let { date = new Date().toDateString(), events = {} } = data;

	// calculate height & width
	let evnts_offset = 15;
	let width = margin * 2 + 80; // margin + longest evnts + amnt + margin
	// margin + line * (t + events_length) + margin
	let height = margin * 2 + evnts_offset * (Object.keys(events).length + 1);

	x = +x;
	y = +y;
	let transform;
	let transformArrow;
	if (y > height) {
		transform = `translate(${paddingLeft + x - width / 2}, ${paddingTop +
			y -
			height -
			20})`;
		transformArrow = `translate(${width / 2 - 20}, ${height - 2})`;
	} else {
		transform = `translate(${paddingLeft + x - width / 2}, ${paddingTop +
			Math.round(y) +
			20})`;
		transformArrow = `translate(${width / 2 - 20}, ${0}) rotate(180,20,0)`;
	}
	var transformTitle = `translate(${width / 2},${margin + evnts_offset})`;
	var transformBody = `translate(${width / 2}, ${margin + evnts_offset * 2})`;

	let svg_props = {
		opacity: 0.7,
		visibility: display
	};
	return (
		<g transform={transform}>
			<rect
				width={width}
				height={height}
				rx="5"
				ry="5"
				visibility={display}
				opacity=".7"
			/>
			<polygon
				points="10,0 30,0 20,10"
				transform={transformArrow}
				{...svg_props}
			/>
			<text visibility={display} transform={transformTitle}>
				<tspan x="0" textAnchor="middle" fill="white">
					{date}
				</tspan>
			</text>
			<text visibility={display} transform={transformBody}>
				{Object.entries(events).map(([evnt, amnt], i) => (
					<tspan
						key={evnt}
						x="0"
						y={evnts_offset * i}
						textAnchor="middle"
						fill="white"
					>
						{evnt} : {amnt}
					</tspan>
				))}
			</text>
		</g>
	);
};
