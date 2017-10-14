import React from "react";
import "semantic-ui-css/semantic.min.css";
import Budget from "./budget/index";
import * as d3 from "d3";

window.d3 = d3;

class App extends React.Component {
	render() {
		return <Budget />;
	}
}
export default App;
