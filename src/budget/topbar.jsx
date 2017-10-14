import React from "react";
import { Menu, Input } from "semantic-ui-react";
import { observer } from "mobx-react";
import moment from "moment";
window.moment = moment;

@observer
class TopBar extends React.Component {
	render() {
		let { store } = this.props;
		return (
			<Menu className="Topbar" style={{ height: "100%", width: "100%" }}>
				<Menu.Item>
					<Input
						className="fromDate"
						type="date"
						value={store.start.format("Y-MM-DD")}
						onChange={(e, { value }) => store.setStart(value)}
					/>
				</Menu.Item>
				<Menu.Item position="right">
					<Input
						type="date"
						value={store.end.format("Y-MM-DD")}
						onChange={(e, { value }) => store.setEnd(value)}
					/>
				</Menu.Item>
			</Menu>
		);
	}
}

export default TopBar;
