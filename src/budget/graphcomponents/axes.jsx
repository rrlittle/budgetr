import React from "react";
import { select, axisTop, axisBottom, axisLeft, axisRight } from "d3";
import { observer } from "mobx-react";

@observer
export class Axis extends React.Component {
	componentDidMount() {
		this.renderAxis();
	}
	componentDidUpdate() {
		this.renderAxis();
	}
	renderAxis() {
		let { orient, scale, format, ticks = 5 } = this.props;
		let node = this.refs.axis;
		const axes = {
			top: axisTop,
			bottom: axisBottom,
			left: axisLeft,
			right: axisRight
		};
		if (!scale) return;
		let axis = axes[orient](scale);
		if (format) axis.tickFormat(format);
		if (ticks) axis.ticks(ticks);
		select(node).call(axis);
	}
	render() {
		let { translate } = this.props;
		return <g className="Axis" ref="axis" transform={translate} />;
	}
}

export const XYAxes = observer(props => {
	let {
		paddingLeft,
		paddingTop,
		paddingBottom,
		height,
		xScale,
		yScale,
		xformat,
		yformat
	} = props.store;
	let xSettings = {
		translate: `translate(${paddingLeft},${height - paddingBottom})`,
		scale: xScale,
		orient: "bottom",
		format: xformat
	};
	let ySettings = {
		translate: `translate(${paddingLeft},${paddingTop})`,
		scale: yScale,
		orient: "left",
		format: yformat
	};
	let should_render = paddingLeft && paddingBottom && height && paddingTop;
	return (
		<g className="XYAxis">
			{should_render ? (
				<g>
					<Axis {...xSettings} />
					<Axis {...ySettings} />
				</g>
			) : (
				<div className="XYAxis_Not_Set" />
			)}
		</g>
	);
});
