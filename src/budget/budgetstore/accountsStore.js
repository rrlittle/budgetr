import { observable, computed, action, useStrict } from "mobx";
import { Flow } from "./flowStore";
import Account from "./accountStore";
import Scale from "./scale";
import { WEEKLY, FR, MONTHLY, TU } from "rrule";
import moment from "moment";
import { timeFormat } from "d3";

useStrict(true);

export default class AccountsStore {
	@observable accounts = [];
	@observable paddingTop;
	@observable paddingBottom;
	@observable paddingLeft;
	@observable paddingRight;
	@observable width;
	@observable height;
	@observable start = moment().subtract(1, "day");
	@observable end = moment().add(1, "day");
	@observable tempFlow;
	@observable tempTo;
	@observable tempFrom;

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

	constructor({
		paddingTop = 30,
		paddingBottom = 30,
		paddingLeft = 30,
		paddingRight = 30,
		start = moment().subtract(5, "days"),
		end = moment().add(20, "days")
	}) {
		console.log(start, end);
		this.paddingTop = paddingTop;
		this.paddingBottom = paddingBottom;
		this.paddingLeft = paddingLeft;
		this.paddingRight = paddingRight;
		this.setStart(start);
		this.setEnd(end);
		console.log(this.start);
		console.log(this.end);
	}

	@action
	dropTempFlow = () => {
		this.tempFlow = undefined;
		this.tempFrom = undefined;
		this.tempTo = undefined;
	};
	@action
	makeTempFlow = () => {
		this.tempFlow = new Flow({});
		return this.tempFlow;
	};

	@action saveTempFlow = () => {};

	@action
	setTempToAccount = accntName => {
		this.tempTo = this.accounts.find(accnt => {
			console.log(this.tempFrom, accnt, this.tempFrom !== accnt);
			return accnt.name === accntName && accnt !== this.tempFrom;
		});
	};

	@action
	setTempFromAccount = accntName => {
		this.tempFrom = this.accounts.find(
			accnt => accnt.name === accntName && accnt !== this.tempTo
		);
	};

	@action
	addAccount = () => {
		console.log("sasdfs");
		this.accounts.push(
			new Account({
				accounts: this,
				name: ""
			})
		);
	};
	@action
	deleteAccount = i => {
		this.accounts.remove(this.accounts[i]);
	};

	@action
	setStart = start => {
		let s = moment(start);
		if (s < this.end) this.start = s;
	};

	@action
	setEnd = end => {
		let e = moment(end);
		if (e > this.start) this.end = e;
	};

	/**set the node for the graph **/
	@action
	set_node = node => {
		this.width = node.clientWidth;
		this.height = node.clientHeight;
	};

	/**fetch accounts from server **/
	@action
	fetchData = () => {
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
	};
}
