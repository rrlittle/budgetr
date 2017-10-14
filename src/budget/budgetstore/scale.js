import { scaleTime, scaleLinear, extent } from "d3";

const Scale = ({
	type = "linear",
	data,
	selector = d => d,
	paddingNear = 30,
	paddingFar = 30,
	length = 100,
	reverse = false
}) => {
	let scale_map = {
		time: scaleTime,
		date: scaleTime,
		linear: scaleLinear
	};
	let domain = extent(data, selector);
	if (reverse) {
		domain.reverse();
	}
	let range = [paddingNear, length - paddingFar - paddingNear];
	let scale = scale_map[type]();
	return scale.domain(domain).range(range);
};

Scale.propTypes = {};
export default Scale;
