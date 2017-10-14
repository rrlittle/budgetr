import React from "react";
import { List } from "semantic-ui-react";
import { observer } from "mobx-react";

const Flow = observer(props => (
	<List.Item className="Flow" onClick={() => props.onClick()}>
		<List.Content>
			<List.Header>{props.flow.name}</List.Header>
			<List.Content>
				{`(${props.flow.amnt}) ${props.flow.RR.toText()}`}
			</List.Content>
		</List.Content>
	</List.Item>
));

Flow.propTypes = {};
export default Flow;
