import React from "react";
import {
	Menu,
	Input,
	Button,
	Modal,
	Segment,
	Icon,
	Header,
	Dropdown
} from "semantic-ui-react";
import { observer } from "mobx-react";
import moment from "moment";
import { TransactionForm } from "./transaction_form";
import { FlowForm } from "./flowmodal.jsx";

window.moment = moment;

@observer
class TopBar extends React.Component {
	state = {
		tx_open: false
	};
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
				<Menu.Item>
					<Button
						content="Add Transaction"
						onClick={() => this.setState({ tx_open: !this.state.tx_open })}
					/>
					<Modal open={this.state.tx_open}>
						<Modal.Content>
							<FlowForm flow={store.makeTempFlow()} />
						</Modal.Content>
						<Modal.Content>
							<Dropdown
								button
								placeholder="From"
								options={store.accounts.map(a => ({
									text: a.name,
									value: a.name
								}))}
								text={store.tempFrom ? store.tempFrom.name : ""}
								value={store.tempFrom ? store.tempFrom.name : ""}
								onChange={(e, { value }) => store.setTempFromAccount(value)}
							/>
							<Dropdown
								button
								placeholder="To"
								options={store.accounts.map(a => ({
									text: a.name,
									value: a.name
								}))}
								text={store.tempTo ? store.tempTo.name : ""}
								value={store.tempTo ? store.tempTo.name : ""}
								onChange={(e, { value }) => store.setTempToAccount(value)}
							/>
						</Modal.Content>
						<Modal.Actions>
							<Button
								color="green"
								onClick={() => {
									store.saveTempFlow();
									this.setState({ tx_open: !this.state.tx_open });
								}}
							>
								<Icon name="checkmark" /> Save
							</Button>
							<Button
								color="red"
								onClick={() => {
									store.dropTempFlow();
									this.setState({ tx_open: !this.state.tx_open });
								}}
							>
								<Icon name="delete" /> Cancel
							</Button>
						</Modal.Actions>
					</Modal>
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
