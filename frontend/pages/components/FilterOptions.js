import { QuestionIcon } from "@chakra-ui/icons";
import { Checkbox, CheckboxGroup, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, useDisclosure } from "@chakra-ui/react";
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
	const { isOpen, onOpen, onClose } = useDisclosure();

	const selectOptions = (v) => {
		setSelectedOpts(v);
		
		const _filterOpts = {};
		
		v.forEach((o, idx) => {
			_filterOpts[o] = filterOpts[o] ?? null;
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
			<Stack direction="row" justifyContent="space-between">
				<Heading fontSize="md">
					Filter Options:
				</Heading>
				<IconButton size="sm" fontSize="lg" icon={<QuestionIcon />} onClick={onOpen} />
			</Stack>
			<CheckboxGroup onChange={(v) => selectOptions(v)} colorScheme="green" defaultValue={[]}>
				{ filteringOptions && filteringOptions.map((o, idx) => (
					<Stack key={idx} direction="row" spacing={2} alignItems="center">
						<Checkbox width="48" value={o.value} size="sm" colorScheme="green">
							{o.label}
						</Checkbox>
						<Input value={filterOpts[o.value] ?? ""} onChange={(e) => updateFilterOpts(o.value, e.target.value)} justifySelf="flex-end" disabled={!selectedOpts.includes(o.value)} type={o.inputType ? 'text' : o.inputType} size="sm" maxWidth="32" />
					</Stack>
				))}
			</CheckboxGroup>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Filter Options Help</ModalHeader>
					<ModalCloseButton />
					<ModalBody px={10} py={5}>
						<strong>
							<u>There are 5 filter options:</u>
						</strong>
						<ul>
							<li>Filter by HTTP status codes - Provide a comma-separated list of valid HTTP status codes and ranges you want to filter by. {"("}e.g. 200-300, 301, 400, 404, 500-504{")"}</li>
							<li>Filter by Response Line Counts - Provide a comma-separated list numerical values and ranges greater than 0, and all responses having equivalent line counts will be filtered. {"("}e.g. 100, 200-500, 10, 0-9{")"}</li>
							<li>Filter by Regular Expression - Provide a valid regular expression to filter by</li>
							<li>Filter by Response Sizes - Provide a comma-separated list numerical values and ranges to filter against the corresponding responses' payload size</li>
							<li>Filter by Response Times - Provide a numerical value preceded by {"<"} or {">"} to filter responses within that range. (e.g. {">"}100, {"<"}100) </li>
							<li>Filter by Response Word Count s- Provide a comma-separated list numerical values and ranges greater than 0, and all responses having equivalent word count will be filtered</li>
						</ul>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Stack>
	);
}
