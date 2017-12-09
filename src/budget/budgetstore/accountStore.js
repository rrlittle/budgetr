import { observable, computed, action } from "mobx";
import { Flow } from "./flowStore";
import moment from "moment";

export default class Account {
	@observable store;
	@observable name;
	@observable color;
	@observable flows = [];
	@observable balances = [];

	constructor({
		accounts,
		name,
		flows = [],
		balances = [],
		color = "#000000"
	}) {
		this.accounts = accounts;
		this.flows.replace(flows.map(f => new Flow(f)));
		this.balances.replace(
			balances.map(b => ({ date: moment(b.date, "MM/DD/Y"), bal: b.bal }))
		);
		this.name = name;
		this.color = color;
	}
	@action addBal = (bal, date) => this.balances.push({ date: date, bal: bal });
	@action deleteBal = bal => this.balances.remove(bal);

	@action
	addFlow = () => {
		let newflow = new Flow({});
		this.flows.push(newflow);
		return newflow;
	};

	@action
	deleteFlow = flow =>
		!this.flows.remove(flow) || console.warn("failed to delete flow", flow);

	@action setColor = color => (this.color = color);
	@action setName = name => (this.name = name);
	@computed
	get data() {
		if (!this.accounts.start || !this.accounts.end) {
			console.warn("start/end is not set");
			return;
		}

		let events = {};
		this.balances.map(b => {
			events[b.date.format("MM/DD/Y")] = { sanity_check: b.bal }; // stored as moments
			return null;
		});
		// full of all sanity checks

		let most_recent = this.get_most_recent();
		let most_recent_date = most_recent.date;

		this.flows.forEach(flow => {
			let f_evnts = flow.between(most_recent_date, this.accounts.end);
			f_evnts.forEach(date => {
				let date_str = moment(date).format("MM/DD/Y");
				let d_evnt = events[date_str] || {};
				d_evnt[flow.name] = flow.amnt;
				events[date_str] = d_evnt;
			});
		});

		// events = {d: {e:amnt, e:amnt, ...}, d: {e:amnt, e:amnt, ...}, ... }
		// sanity checks are special events

		let ordered_events = Object.entries(events);
		// convert {Date: evnts, Date: evnts} -> [[Date, evnts], [Date, evnts]]

		ordered_events.sort(
			(entry1, entry2) =>
				moment(entry1[0], "MM/DD/Y") - moment(entry2[0], "MM/DD/Y")
		);
		// date1 - date2 -> (-) if date1 comes first, (+) if date2 comes first

		// ordered_events = [[d, {e:amnt, e:amnt}], [d, {e:amnt, e:amnt}], ...]

		let data = [];
		let bal = 0;

		ordered_events.forEach(([date, evnts]) => {
			bal += Object.values(evnts).reduce((sum, amnt) => sum + amnt);
			if ("sanity_check" in evnts) bal = evnts["sanity_check"];

			data.push({
				date: new Date(date),
				bal: bal,
				events: evnts
			});
		});

		return data;
	}

	get_most_recent() {
		let closest = null;
		let smallest_diff = Number.NEGATIVE_INFINITY; // over 0

		this.balances.map(b => {
			let diff = b.date - this.accounts.start;
			if (diff > 0) return null;
			if (diff > smallest_diff) {
				smallest_diff = diff;
				closest = b;
			}
			return null;
		});
		let ret = {
			date: closest ? closest.date : this.accounts.start,
			bal: closest ? closest.bal : 0
		};
		return ret;
	}
}
