import { Checkbox, CheckboxGroup, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";

const matchOptions = [
	{
		label: 'Match by HTTP status codes',
		value: 'match_http_status_codes',
		inputType: 'text'
	},
	{
		label: 'Match by response line-count',
		value: 'match_line_count',
		inputType: 'number'
	},
	{
		label: 'Match by regular expression',
		value: 'match_regexp',
		inputType: 'text'
	},
	{
		label: 'Match by response size',
		value: 'match_response_size',
		inputType: 'number'
	},
	{
		label: 'Match by response time',
		value: 'match_response_time',
		inputType: 'text'
	},
	{
		label: 'Match by response word count',
		value: 'match_word_count',
		inputType: 'number'
	},
];

export default function MatcherOptions({ matcherOpts, setMatcherOpts, ...props }) {
	const [selectedOpts, setSelectedOpts] = useState([]);

	const selectOptions = (v) => {
		setSelectedOpts(v);
		
		const _matcherOptions = {};
		
		v.forEach((o, idx) => {
			_matcherOptions[o] = null;
		});
		setMatcherOpts(_matcherOptions);
		// setMatcherOpts
	};

	const updateMatcherOpts = (key, v) => {
		const _matcherOptions = {
			...matcherOpts
		};

		_matcherOptions[key] = v;
		setMatcherOpts(_matcherOptions);
	};

	return (
		<Stack spacing={2} direction="column">
			<Heading fontSize="md">
				Matcher Options:
			</Heading>
			<CheckboxGroup onChange={(v) => selectOptions(v)} colorScheme="green" defaultValue={[]}>
				{ matchOptions && matchOptions.map((o, idx) => (
					<Stack key={idx} direction="row" spacing={2} alignItems="center">
						<Checkbox width="48" value={o.value} size="sm" colorScheme="green">
							{o.label}
						</Checkbox>
						<Input onChange={(e) => updateMatcherOpts(o.value, e.target.value)} justifySelf="flex-end" disabled={!selectedOpts.includes(o.value)} type={o.inputType ? 'text' : o.inputType} size="sm" maxWidth="32" />
					</Stack>
				))}
			</CheckboxGroup>
		</Stack>
	);
}