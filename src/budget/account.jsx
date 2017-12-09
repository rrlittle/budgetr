import React from "react";
import { Card, Button, List, Modal, Input, Confirm } from "semantic-ui-react";
import Flow from "./flow";
import { observer } from "mobx-react";
import { CirclePicker } from "react-color";
import FlowModal from "./flowmodal";
import SanityModal from "./sanitymodal";

@observer
export default class Account extends React.Component {
	state = {
		showColorPicker: false,
		flow: null,
		showSanityCheck: false,
		editHeader: false,
		header: ""
	};
	componentDidMount() {
		this.setState({
			header: this.props.account.name
		});
	}
	render() {
		let { account, onDelete } = this.props;
		let { editHeader, header, deleteAccount } = this.state;
		return (
			<Card className="Account">
				<SanityModal
					account={account}
					open={this.state.showSanityCheck}
					onAdd={(bal, date) => {
						account.addBal(bal, date);
						this.setState({ showSanityCheck: false });
					}}
					onDelete={sc => account.deleteBal(sc)}
					close={() => this.setState({ showSanityCheck: false })}
				/>
				<FlowModal
					flow={this.state.flow}
					onDone={() => this.setState({ flow: null })}
					onDelete={() => {
						account.deleteFlow(this.state.flow);
						this.setState({ flow: null });
					}}
				/>
				<Confirm
					onCancel={() => this.setState({ deleteAccount: false })}
					onConfirm={() => {
						onDelete();
						this.setState({ deleteAccount: false });
					}}
					open={deleteAccount}
				/>
				<Card.Content>
					<Card.Header>
						{editHeader ? (
							<Input
								value={header}
								onChange={(e, { value }) => this.setState({ header: value })}
							/>
						) : (
							account.name
						)}
						<Button.Group floated="right" size="mini">
							<Button
								toggle
								active={editHeader}
								icon={editHeader ? "check" : "edit"}
								onClick={() => {
									account.setName(header);
									this.setState({ editHeader: !editHeader });
								}}
							/>
							<Button
								icon="delete"
								onClick={() => {
									if (editHeader)
										this.setState({ header: account.name, editHeader: false });
									else {
										this.setState({ deleteAccount: true });
									}
								}}
							/>
						</Button.Group>
					</Card.Header>
				</Card.Content>
				<Card.Content
					style={{ background: account.color }}
					onClick={() => this.setState({ showColorPicker: true })}
				/>
				<Modal basic open={this.state.showColorPicker}>
					<Modal.Content>
						<CirclePicker
							color={account.color}
							onChangeComplete={color => {
								this.setState({ showColorPicker: false });
								account.setColor(color.hex);
							}}
						/>
					</Modal.Content>
				</Modal>

				<Card.Content extra>
					<Button
						basic
						size="mini"
						color="green"
						content="add flow"
						onClick={() => {
							let f = account.addFlow();
							this.setState({ flow: f });
						}}
					/>
					<Button
						basic
						size="mini"
						color="red"
						content="sanity check"
						onClick={() => this.setState({ showSanityCheck: true })}
					/>
				</Card.Content>
				<Card.Content extra>
					<List>
						{account.flows.map((f, i) => (
							<Flow
								key={i}
								flow={f}
								onClick={() => this.setState({ flow: f })}
							/>
						))}
					</List>
				</Card.Content>
			</Card>
		);
	}
}
