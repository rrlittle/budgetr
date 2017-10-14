import React from "react";
import { observer } from "mobx-react";
import AccountsStore from "./budgetstore/accountsStore";
import { Grid } from "semantic-ui-react";
import BudgetGraph from "./budgetgraph";
import Accounts from "./accounts";
import TopBar from "./topbar";

window.store = new AccountsStore({
	paddingLeft: 40,
	paddingRight: 30,
	paddingTop: 30,
	paddingBottom: 30
});

@observer
class Budget extends React.Component {
	state = {
		store: window.store
	};
	componentDidUpdate() {
		this.state.store.set_node(this.refs.chart);
	}
	componentDidMount() {
		this.state.store.set_node(this.refs.chart);
		this.state.store.fetchData();
	}
	render() {
		console.log(this.state.store);
		return (
			<Grid
				className="budget"
				style={{ width: "100vw", height: "100vh", margin: 0 }}
			>
				<Grid.Column
					width={4}
					className="accounts"
					style={{
						background: "steelblue",
						paddingLeft: 0,
						maxWidth: 250,
						paddingRight: 0
					}}
				>
					<Accounts accounts={this.state.store.accounts} />
				</Grid.Column>
				<Grid.Column
					width={12}
					style={{ background: "slategray", padding: 0, maxHeight: "100vh" }}
				>
					<Grid.Row
						className="menu"
						style={{ background: "seagreen", height: "8%", minHeight: 40 }}
					>
						<TopBar store={this.state.store} />
					</Grid.Row>
					<div
						ref="chart"
						style={{
							background: "slateblue",
							height: "92%",
							minHeight: 300
						}}
					>
						<Grid.Row className="chart" style={{ height: "100%" }}>
							<BudgetGraph store={this.state.store} />
						</Grid.Row>
					</div>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Budget;
