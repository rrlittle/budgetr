import { observable, computed, action } from "mobx";
import Account from "./accountStore";
import Scale from "./scale";
import { WEEKLY, FR, MONTHLY, TU } from "rrule";
import moment from "moment";
import { timeFormat } from "d3";

export default class AccountsStore {
	@observable accounts = [];
	paddingTopContainer = observable();
	paddingBottomContainer = observable();
	paddingLeftContainer = observable();
	paddingRightContainer = observable();

	node = observable();

	startDate = observable();
	endDate = observable();

	yformat = undefined;
	xformat = timeFormat("%d-%b-%y");

	@computed
	get xScale() {
		return new Scale({
			type: "date",
			data: this.data.map(d => d.date),
			paddingNear: this.paddingLeft,
			paddingFar: this.paddingRight,
			length: this.width
		});
	}

	@computed
	get all_balances() {
		return this.data
			.map(d => Object.values(d.accounts).map(a => a.bal))
			.reduce((whole, subset) => whole.concat(subset), []);
	}
	// get all the balances from all accounts
	@computed
	get yScale() {
		return new Scale({
			data: this.all_balances.concat([0]),
			paddingNear: this.paddingTop,
			paddingFar: this.paddingBottom,
			length: this.height,
			reverse: true
		});
	}

	/** returns accounts data in form:
		[{date: Date(), accounts: {accnt:{bal: events:{e:amnt, e:amnt, ...}}}}]

		from 
		this.accounts = [accntStore, accntStore]
		accntStore.data -> [{date: Date, bal: #, events: {}}]
	**/
	@computed
	get data() {
		let data = {};
		this.accounts.map(a => {
			// a is an account.
			let a_data = a.data;
			// a_data = [{date: Date, bal: #, events: {}}]
			a_data.map(a_day => {
				// get or create day in data
				let date_str = moment(a_day.date).format("MM/DD/Y");
				let data_day = data[date_str] || {};
				data_day[a.name] = { ...a_day }; // save the  account in the data_day
				data[date_str] = data_day;
				return null; // map not returning anything
			});
			return null; // map not returning anything
		});

		// data -> {Date: {accnt: {bal: #, events: {}}}}

		let ordered_data = Object.entries(data);
		ordered_data.sort(
			(entry1, entry2) =>
				moment(entry1[0], "MM/DD,Y") - moment(entry2[0], "MM/DD/Y")
		);
		return ordered_data
			.map(d => ({ date: new Date(d[0]), accounts: d[1] }))
			.filter(d => d.date >= this.start);
	}

	@computed
	get paddingTop() {
		return this.paddingTopContainer.get();
	}
	@computed
	get paddingBottom() {
		return this.paddingBottomContainer.get();
	}
	@computed
	get paddingLeft() {
		return this.paddingLeftContainer.get();
	}
	@computed
	get paddingRight() {
		return this.paddingRightContainer.get();
	}

	@computed
	get width() {
		try {
			return this.node.get().clientWidth;
		} catch (err) {
			console.warn("node note set");
		}
	}

	@computed
	get height() {
		try {
			return this.node.get().clientHeight;
		} catch (err) {
			console.warn("node note set");
		}
	}

	@computed
	get start() {
		return this.startDate.get();
	}
	@computed
	get end() {
		return this.endDate.get();
	}

	// @computed
	// get data() {}

	constructor({
		paddingTop = 30,
		paddingBottom = 30,
		paddingLeft = 30,
		paddingRight = 30,
		start = moment(),
		end = moment().add(20, "days")
	}) {
		this.paddingTopContainer.set(paddingTop);
		this.paddingBottomContainer.set(paddingBottom);
		this.paddingLeftContainer.set(paddingLeft);
		this.paddingRightContainer.set(paddingRight);
		this.startDate.set(start);
		this.endDate.set(end);
	}

	/**set the node for the graph **/
	@action
	set_node(node) {
		this.node.set(node);
	}

	/**fetch accounts from server **/
	@action
	fetchData() {
		let raw_json = [
			{
				name: "Landing Pad",
				flows: [
					{
						name: "lottery",
						amnt: 2000,
						freq: WEEKLY,
						dtstart: "07/20/2017",
						byweekday: [TU]
					},
					{
						name: "party supplies",
						amnt: -850,
						freq: WEEKLY,
						byweekday: [FR],
						dtstart: "08/10/2017"
					},
					{
						name: "rent",
						amnt: -1031,
						freq: MONTHLY,
						bymonthday: [1],
						dtstart: "08/10/2017"
					}
				],
				balances: [{ date: "09/14/2017", bal: 500 }]
			}
		];
		this.accounts.replace(
			raw_json.map(a => new Account({ accounts: this, ...a }))
		);
	}

	@action
	setStart(start) {
		let s = moment(start);
		if (s < this.endDate) this.startDate.set(s);
	}

	@action
	setEnd(end) {
		let e = moment(end);
		if (e > this.startDate) this.endDate.set(e);
	}
}
