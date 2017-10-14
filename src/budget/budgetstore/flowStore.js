import { observable, computed, action } from "mobx";
import { RRule } from "rrule";
import * as rrule from "rrule";
import { DAILY, WEEKLY, MONTHLY, YEARLY } from "rrule";
import moment from "moment";

window.rrule = rrule;

export class Flow {
	nameBox = observable();
	@computed
	get name() {
		return this.nameBox.get();
	}
	@action
	setname(name) {
		this.nameBox.set(name);
	}
	amntBox = observable();
	@computed
	get amnt() {
		return this.amntBox.get();
	}
	@action
	setamnt(amnt) {
		this.amntBox.set(amnt);
	}
	freqBox = observable();
	@computed
	get freq() {
		return this.freqBox.get();
	}
	@action
	setfreq(freq) {
		if (freq === YEARLY) {
			// remove weekdays
			this.setbyweekday(undefined);
		} else if (freq === WEEKLY) {
			// remove months and monthdays
			this.setbymonth(undefined);
			this.setbymonthday(undefined);
		} else if (freq === MONTHLY) {
			// remove weekdays and months
			this.setbymonth(undefined);
			this.setbyweekday(undefined);
		} else {
			// remove weekdays, months, monthdays
			this.setbyweekday(undefined);
			this.setbymonth(undefined);
			this.setbymonthday(undefined);
		}
		this.freqBox.set(freq);
	}
	intervalBox = observable();
	@computed
	get interval() {
		return this.intervalBox.get();
	}
	@action
	setinterval(interval) {
		this.intervalBox.set(interval);
	}
	dtstartBox = observable();
	@computed
	get dtstart() {
		return this.dtstartBox.get();
	}
	@action
	setdtstart(dtstart) {
		this.dtstartBox.set(dtstart ? moment(dtstart, "Y-MM-DD") : undefined);
	}
	untilBox = observable();
	@computed
	get until() {
		return this.untilBox.get();
	}
	@action
	setuntil(until) {
		this.untilBox.set(until ? moment(until, "Y-MM-DD") : undefined);
	}
	countBox = observable();
	@computed
	get count() {
		return this.countBox.get();
	}
	@action
	setcount(count) {
		this.countBox.set(count);
	}
	byweekdayBox = observable();
	@computed
	get byweekday() {
		return this.byweekdayBox.get();
	}
	@action
	setbyweekday(byweekday) {
		this.byweekdayBox.set(byweekday);
	}
	@action
	toggleWeekday(weekday) {
		let weekdays = this.byweekday || [];
		if (weekdays.find(e => e === weekday)) {
			weekdays.remove(weekday);
			this.setbyweekday(weekdays);
		} else {
			this.setbyweekday(weekdays.concat([weekday]));
		}
	}
	bymonthBox = observable();
	@computed
	get bymonth() {
		return this.bymonthBox.get();
	}
	@action
	setbymonth(bymonth) {
		this.bymonthBox.set(bymonth);
	}
	@action
	toggleMonth(month) {
		let bymonth = this.bymonth || [];
		if (bymonth.find(e => e === month)) {
			bymonth.remove(month);
			this.setbymonth(bymonth);
		} else {
			this.setbymonth(bymonth.concat([month]));
		}
	}
	bymonthdayBox = observable();
	@computed
	get bymonthday() {
		return this.bymonthdayBox.get();
	}
	@action
	setbymonthday(bymonthday) {
		this.bymonthdayBox.set(bymonthday);
	}

	@action
	toggleMonthday(monthday) {
		let bymonthday = this.bymonthday || [];
		if (bymonthday.find(e => e === monthday)) {
			bymonthday.remove(monthday);
			this.setbymonthday(bymonthday);
		} else {
			this.setbymonthday(bymonthday.concat([monthday]));
		}
	}

	@action
	setrepitition(value) {
		if (value === "Until") {
			this.setcount(undefined);
			this.setuntil(moment().format("Y-MM-DD"));
		} else if (value === "For") {
			this.setcount(1);
			this.setuntil(undefined);
		} else {
			this.setcount(undefined);
			this.setuntil(undefined);
		}
	}

	@computed
	get repitition() {
		return this.until
			? "Until"
			: this.count || this.count === 0 ? "For" : "Forever";
	}

	@computed
	get RR() {
		let defs = {};
		if (this.freq || this.freq === 0) defs.freq = this.freq;
		if (this.interval) defs.interval = this.interval;
		if (this.dtstart) defs.dtstart = this.dtstart.toDate();
		if (this.until) {
			console.log("until", this.until);
			defs.until = this.until.toDate();
		}
		if (this.count) defs.count = this.count;
		if (this.byweekday) defs.byweekday = this.byweekday;
		if (this.bymonth) defs.bymonth = this.bymonth;
		if (this.bymonthday) defs.bymonthday = this.bymonthday;
		return new RRule(defs);
	}

	constructor({
		name = "",
		amnt = 0,
		freq = DAILY,
		interval = 1,
		dtstart = moment().format("MM/DD/Y"),
		until,
		count,
		byweekday,
		bymonth,
		bymonthday
	}) {
		this.nameBox.set(name);
		this.amntBox.set(amnt);
		this.freqBox.set(freq);
		this.intervalBox.set(interval);
		this.dtstartBox.set(moment(dtstart, "MM/DD/Y"));
		this.untilBox.set(until ? moment(until, "MM/DD/Y") : undefined);
		this.countBox.set(count);
		this.byweekdayBox.set(byweekday);
		this.bymonthBox.set(bymonth);
		this.bymonthdayBox.set(bymonthday);
	}

	between(start, end) {
		return this.RR.between(start.toDate(), end.toDate());
	}
}
