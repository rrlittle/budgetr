import React from "react";
import { observer } from "mobx-react";
import { Modal, Button, Icon, Form, Input, Table } from "semantic-ui-react";
import moment from "moment";

@observer
export default class SanityModal extends React.Component {
	state = {
		bal: 0,
		date: moment()
	};
	render() {
		let { account, onAdd, onDelete, open, close } = this.props;

		return (
			<div>
				<Modal basic open={open}>
					<Modal.Header>{account.name} Sanity Checks</Modal.Header>
					<Modal.Content>
						<Table basic inverted striped>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell content="Bal" />
									<Table.HeaderCell content="Date" />
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{account.balances.map((b, i) => (
									<Table.Row key={i}>
										<Table.Cell>{b.bal}</Table.Cell>
										<Table.Cell>{b.date.format("MM/DD/Y")}</Table.Cell>
										<Table.Cell>
											<Button
												basic
												color="red"
												icon="delete"
												circular
												onClick={() => onDelete(b)}
											/>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						<Form>
							<Form.Field inline>
								<Input
									type="number"
									value={this.state.bal}
									onChange={(e, { value }) => this.setState({ bal: +value })}
								/>
								<Input
									type="date"
									value={this.state.date.format("Y-MM-DD")}
									onChange={(e, { value }) => {
										console.log(value);
										this.setState({ date: moment(value, "Y-MM-DD") });
									}}
								/>
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button
							color="green"
							onClick={() => onAdd(this.state.bal, this.state.date)}
						>
							<Icon name="checkmark" /> Add
						</Button>
						<Button color="red" onClick={close}>
							<Icon name="delete" /> Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}
