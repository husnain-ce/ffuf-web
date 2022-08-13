import { QuestionIcon } from "@chakra-ui/icons";
import { Checkbox, CheckboxGroup, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Tooltip, useDisclosure } from "@chakra-ui/react";
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
	const { isOpen, onOpen, onClose } = useDisclosure();

	const selectOptions = (v) => {
		setSelectedOpts(v);
		
		const _matcherOptions = {};
		
		v.forEach((o, idx) => {
			_matcherOptions[o] = matcherOpts[o] ?? null;
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
			<Stack direction="row" justifyContent="space-between">
				<Heading fontSize="md">
					Matcher Options:
				</Heading>
				<IconButton size="sm" fontSize="lg" icon={<QuestionIcon />} onClick={onOpen} />
			</Stack> 
			<CheckboxGroup onChange={(v) => selectOptions(v)} colorScheme="green" defaultValue={[]}>
				{ matchOptions && matchOptions.map((o, idx) => (
					<Stack key={idx} direction="row" spacing={2} alignItems="center">
						<Checkbox width="48" value={o.value} size="sm" colorScheme="green">
							{o.label}
						</Checkbox>
						<Input value={matcherOpts[o.value] ?? ""} onChange={(e) => updateMatcherOpts(o.value, e.target.value)} justifySelf="flex-end" disabled={!selectedOpts.includes(o.value)} type={o.inputType ? 'text' : o.inputType} size="sm" maxWidth="32" />
					</Stack>
				))}
			</CheckboxGroup>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Matcher Options Help</ModalHeader>
					<ModalCloseButton />
					<ModalBody px={10} py={5}>
						<strong>
							<u>There are 5 matcher options:</u>
						</strong>
						<ul>
							<li>Match by HTTP status codes - Provide a comma-separated list of valid HTTP status codes you want to match by. "all" is also a valid input for all HTTP status codes</li>
							<li>Match by Response Line Count - Provide a numerical value greater than 0, and all responses having equivalent line count will be returned</li>
							<li>Match by Regular Expression - Provide a valid regular expression to match by</li>
							<li>Match by Response Size - Provide a numerical value to match against the corresponding responses' payload size</li>
							<li>Match by Response Time - Provide a numerical value preceded by {"<"} or {">"} to get responses within that range. {"("}e.g. {">"}100, {"<"}100{")"} </li>
							<li>Match by Response Word Count - Provide a numerical value greater than 0, and all responses having equivalent word count will be returned</li>
						</ul>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Stack>
	);
}