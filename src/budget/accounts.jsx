import React from "react";
import { Card } from "semantic-ui-react";
import Account from "./account";
import { observer } from "mobx-react";

const Accounts = observer(props => (
	<Card.Group className="Accounts">
		{props.accounts.map((accnt, i) => <Account key={i} account={accnt} />)}
	</Card.Group>
));

Accounts.propTypes = {};
export default Accounts;
