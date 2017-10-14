import React from "react";
import { Line, XYAxes } from "./graphcomponents/index";
import { observer } from "mobx-react";
import Circles from "./circles";
import Tooltip from "./tooltip";

var padding = 20;

@observer
class BudgetGraph extends React.Component {
	state = {
		tooltip: {
			display: "hidden",
			pos: {
				x: 0,
				y: 0
			},
			data: {
				date: new Date().toDateString(),
				events: {}
			},
			padding: {
				margin: padding
			}
		}
	};

	showTooltip({ x, y, datum }) {
		this.setState({
			tooltip: {
				display: "visible",
				pos: {
					x: +x,
					y: +y
				},
				data: {
					date: datum.date.toDateString(),
					events: datum.events
				},
				padding: {
					margin: padding,
					paddingLeft: this.props.store.paddingLeft,
					paddingTop: this.props.store.paddingTop
				}
			}
		});
	}
	hideTooltip() {
		this.setState({
			tooltip: {
				display: "hidden"
			}
		});
	}
	render() {
		let { ref = "BudgetGraph", store } = this.props;
		let { xScale, yScale } = store;
		return (
			<svg className="BudgetGraph" ref={ref} width="100%" height="100%">
				<XYAxes store={store} />
				{store.accounts.map((accnt, i) => (
					<g key={i}>
						<Line
							color={accnt.color}
							data={accnt.data}
							xSelector={d => xScale(d.date)}
							ySelector={d => yScale(d.bal)}
							paddingTop={store.paddingTop}
							paddingLeft={store.paddingLeft}
						/>
						<Circles
							color={accnt.color}
							data={accnt.data}
							xSelector={d => xScale(d.date)}
							ySelector={d => yScale(d.bal)}
							hideTooltip={this.hideTooltip.bind(this)}
							showTooltip={this.showTooltip.bind(this)}
							paddingTop={store.paddingTop}
							paddingLeft={store.paddingLeft}
						/>
						<Tooltip {...this.state.tooltip} />
					</g>
				))}
			</svg>
		);
	}
}

export default BudgetGraph;
