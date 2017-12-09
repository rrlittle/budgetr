import React from "react";
import {
	Modal,
	Input,
	Button,
	Icon,
	Label,
	Dropdown,
	Form,
	Grid,
	Header
} from "semantic-ui-react";
import { observer } from "mobx-react";
import {
	MO,
	TU,
	WE,
	TH,
	FR,
	SA,
	SU,
	DAILY,
	WEEKLY,
	MONTHLY,
	YEARLY
} from "rrule";

const Monthdays = observer(props => (
	<Grid style={{ paddingTop: 20 }}>
		<Grid.Row>
			{Array.apply(null, Array(31)).map((e, i) => (
				<Grid.Column key={i} style={{ padding: 2, width: 30 }}>
					<Label
						circular
						color={
							props.flow.bymonthday &&
							props.flow.bymonthday.find(e => e === i + 1)
								? "green"
								: "red"
						}
						onClick={() => props.flow.toggleMonthday(i + 1)}
					>
						{i + 1}
					</Label>
				</Grid.Column>
			))}
		</Grid.Row>
	</Grid>
));

const Months = observer(props => (
	<Grid style={{ paddingTop: 20 }}>
		<Grid.Row>
			{[
				["Jan"],
				["Feb"],
				["Mar"],
				["Apr"],
				["May"],
				["Jun"],
				["Jul"],
				["Aug"],
				["Sep"],
				["Oct"],
				["Nov"],
				["Dec"]
			].map((e, i) => (
				<Grid.Column key={i} style={{ padding: 2 }}>
					<Label
						style={{ width: 36 }}
						circular
						color={
							props.flow.bymonth &&
							props.flow.bymonth.find(entr => entr === i + 1)
								? "green"
								: "red"
						}
						onClick={() => props.flow.toggleMonth(i + 1)}
					>
						{e}
					</Label>
				</Grid.Column>
			))}
		</Grid.Row>
	</Grid>
));

const Weekdays = observer(props => (
	<Grid style={{ paddingTop: 20 }}>
		<Grid.Row>
			{[
				["Mon", MO],
				["Tue", TU],
				["Wed", WE],
				["Thu", TH],
				["Fri", FR],
				["Sat", SA],
				["Sun", SU]
			].map((e, i) => (
				<Grid.Column key={i} style={{ padding: 2 }}>
					<Label
						style={{ width: 36 }}
						circular
						color={
							props.flow.byweekday &&
							props.flow.byweekday.find(entr => entr === e[1])
								? "green"
								: "red"
						}
						onClick={() => props.flow.toggleWeekday(e[1])}
					>
						{e[0]}
					</Label>
				</Grid.Column>
			))}
		</Grid.Row>
	</Grid>
));

@observer
export default class FlowModal extends React.Component {
	render() {
		let { flow, onDone, onDelete } = this.props;
		return (
			<div>
				{flow ? (
					<Modal open={Boolean(flow)}>
						<Modal.Content>
							<FlowForm flow={flow} />
						</Modal.Content>
						<Modal.Actions>
							<Button color="green" onClick={onDone}>
								<Icon name="checkmark" /> Done
							</Button>
							<Button color="red" onClick={onDelete}>
								<Icon name="delete" /> Delete
							</Button>
						</Modal.Actions>
					</Modal>
				) : (
					<div />
				)}
			</div>
		);
	}
}

@observer
export class FlowForm extends React.Component {
	render() {
		let { flow } = this.props;
		return (
			<div>
				<Header>
					<Input
						fluid
						placeholder="Flow Name"
						value={flow.name}
						onChange={(e, { value }) => {
							console.log(value);
							flow.setname(value);
						}}
					/>
				</Header>
				<Input
					fluid
					labelPosition="right"
					type="number"
					placeholder="Amount"
					value={flow.amnt}
					onChange={(e, { value }) => flow.setamnt(+value)}
				>
					<Label basic>$</Label>
					<input />
				</Input>

				<Form>
					<Form.Field inline>
						Every{" "}
						<Input
							placeholder="interval"
							type="number"
							value={flow.interval}
							onChange={(e, { value }) => flow.setinterval(+value)}
						/>
						<Dropdown
							placeholder="frequency"
							search
							options={[
								{ text: "Years", value: YEARLY },
								{ text: "Months", value: MONTHLY },
								{ text: "Weeks", value: WEEKLY },
								{ text: "Days", value: DAILY }
							]}
							value={flow.freq}
							onChange={(e, { value }) => {
								console.log(value);
								flow.setfreq(+value);
							}}
						/>
					</Form.Field>
				</Form>

				<Form>
					<Form.Field inline>
						Beginning{" "}
						<Input
							type="date"
							value={flow.dtstart ? flow.dtstart.format("Y-MM-DD") : ""}
							onChange={(e, { value }) => flow.setdtstart(value)}
						/>
					</Form.Field>
				</Form>

				<Form>
					<Form.Field inline>
						<Dropdown
							options={[
								{ text: "Forever", value: "Forever" },
								{ text: "Until", value: "Until" },
								{ text: "For", value: "For" }
							]}
							inline
							value={flow.repitition}
							onChange={(e, { value }) => flow.setrepitition(value)}
						/>
						{flow.repitition === "Until" && (
							<Input
								type="date"
								value={flow.until.format("Y-MM-DD")}
								onChange={(e, { value }) => flow.setuntil(value)}
							/>
						)}
						{flow.repitition === "For" && (
							<span>
								<Input
									type="number"
									value={flow.count}
									onChange={(e, { value }) =>
										+value >= 1 && flow.setcount(parseInt(value, 0))}
								/>
								{" Events"}
							</span>
						)}
					</Form.Field>
				</Form>

				{flow.freq === WEEKLY && <Weekdays flow={flow} />}
				{(flow.freq === MONTHLY || flow.freq === YEARLY) && (
					<Monthdays flow={flow} />
				)}
				{flow.freq === YEARLY && <Months flow={flow} />}
			</div>
		);
	}
}
