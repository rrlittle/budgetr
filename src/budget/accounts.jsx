import React from "react";
import { Card, Button, Modal } from "semantic-ui-react";
import Account from "./account";
import { observer } from "mobx-react";

const Accounts = observer(props => {
	return (
		<Card.Group className="Accounts">
			{props.store.accounts.map((accnt, i) => (
				<Account
					key={i}
					account={accnt}
					onDelete={() => {
						props.store.deleteAccount(i);
					}}
				/>
			))}
			<Card>
				<Button icon="plus" onClick={() => props.store.addAccount()} />
			</Card>
		</Card.Group>
	);
});

export default Accounts;
