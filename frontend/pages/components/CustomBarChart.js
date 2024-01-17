import { Box } from "@chakra-ui/react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import CustomToolTip from "./CustomToolTip";

export default function CustomBarChart({ data }) {
	if (!data.length) {
		return null;
	}

	// console.log(data);
	const dataTransformer = (data) => {
		return data.map(r => {
			const inputs = Object.keys(r.inputs);
			// console.log("A", r.status);
			return {
				name: r.inputs[inputs[0]],
				length: r.length,
				words: r.words,
				lines: r.lines,
				status: r.status,
				duration: r.duration,
			};
		});
	};

	return (
		<Box width="2xl" height="md">
			<ResponsiveContainer>
				<BarChart data={dataTransformer(data)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip content={<CustomToolTip />} />
					<Legend />
					<Bar dataKey="length" fill="#8884d8" />
					<Bar dataKey="words" fill="#82ca9d" />
					<Bar dataKey="lines" fill="#8dd1e1" />
				</BarChart>
			</ResponsiveContainer>
		</Box>
	)
}