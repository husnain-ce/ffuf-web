import { Checkbox, CheckboxGroup, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

const filteringOptions = [
	{
		label: 'Filter by HTTP status codes',
		value: 'filter_http_status_codes',
		inputType: 'text'
	},
	{
		label: 'Filter by response line-count',
		value: 'filter_line_count',
		inputType: 'text'
	},
	{
		label: 'Filter by regular expression',
		value: 'filter_regexp',
		inputType: 'text'
	},
	{
		label: 'Filter by response size',
		value: 'filter_response_size',
		inputType: 'text'
	},
	{
		label: 'Filter by response time',
		value: 'filter_response_time',
		inputType: 'text'
	},
	{
		label: 'Filter by response word count',
		value: 'filter_word_count',
		inputType: 'text'
	},
];

export default function FilterOptions({ filterOpts, setFilterOpts, ...props }) {
	const [selectedOpts, setSelectedOpts] = useState([]);

	const selectOptions = (v) => {
		setSelectedOpts(v);
		
		const _filterOpts = {};
		
		v.forEach((o, idx) => {
			_filterOpts[o] = null;
		});
		setFilterOpts(_filterOpts);
		// setMatcherOpts
	};

	const updateFilterOpts = (key, v) => {
		const _filterOpts = {
			...filterOpts
		};

		_filterOpts[key] = v;
		setFilterOpts(_filterOpts);
	};

	return (
		<Stack spacing={2} direction="column">
			<Heading fontSize="md">
				Filter Options:
			</Heading>
			<CheckboxGroup onChange={(v) => selectOptions(v)} colorScheme="green" defaultValue={[]}>
				{ filteringOptions && filteringOptions.map((o, idx) => (
					<Stack key={idx} direction="row" spacing={2} alignItems="center">
						<Checkbox width="48" value={o.value} size="sm" colorScheme="green">
							{o.label}
						</Checkbox>
						<Input onChange={(e) => updateFilterOpts(o.value, e.target.value)} justifySelf="flex-end" disabled={!selectedOpts.includes(o.value)} type={o.inputType ? 'text' : o.inputType} size="sm" maxWidth="32" />
					</Stack>
				))}
			</CheckboxGroup>
		</Stack>
	);
}
