import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, FormControl, FormLabel, Heading, InputGroup, InputRightElement, Stack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MultipleWordListsSelectionBox from "./MultipleWordListsSelectionBox";
import axios from "axios";
import UrlSearchBar from "./UrlSearchBar";
import AdvancedOptions from "./AdvancedOptions";
import * as urlUtil from "url";

export default function FuzzFormAccordion({ results, setResults, scroller }) {
	const [url, setURL] = useState("");
	const [wordLists, setWordLists] = useState([{}]);
	const [matcherOpts, setMatcherOpts] = useState({});
	const [filterOpts, setFilterOpts] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const generateFuzzBody = () => {
		const fuzzBody = {
			url_dict: {
				url
			},
			word_lists: wordLists.map(wl => {
				if (wl.keyword) {
					if (!wl.keyword.length) {
						delete wl.keyword;
					} else {
						wl.keyword = wl.keyword.toUpperCase();
					}
				}

				return wl;
			}),
		};

		const custom_query = urlUtil.parse(url).pathname
		if (custom_query && custom_query.length > 0 && custom_query !== "/") {
			fuzzBody.url_dict.custom_query = custom_query;
		}

		for (let key of Object.keys(matcherOpts)) {
			let v = matcherOpts[key];
			if (v !== null && v !== undefined && v.length > 0) {
				if (!fuzzBody.matcher_options) {
					fuzzBody.matcher_options = {};
				}

				if (["match_line_count", "match_response_size", "match_word_count"].includes(key)) {
					v = Number(v);
				} else if (key === "match_http_status_codes") {
					if (v !== "all") {
						v = v.split(",").map(_ => Math.round(Number(_.trim())))
					}
				}

				fuzzBody.matcher_options[key] = v;
			}
		}

		for (let key of Object.keys(filterOpts)) {
			let v = filterOpts[key];
			if (v !== null && v !== undefined && v.length > 0) {
				if (!fuzzBody.filter_options) {
					fuzzBody.filter_options = {};
				}

				fuzzBody.filter_options[key] = v;
			}
		}

		return fuzzBody;
	};

	const fuzz = async () => {
		setIsLoading(true);
		const fuzzBody = generateFuzzBody();
		// console.log(fuzzBody);
		try {
			const res = await axios.post("http://localhost:8000/api/fuzz", {
				...fuzzBody
			});

			// console.log(res);
			// console.log(JSON.stringify(res.data, null, 4));
			setResults(res.data.results.map((r, idx) => {
				return {
					inputs: {
						...r.input
					},
					status: r.status,
					length: r.length,
					words: r.words,
					lines: r.lines
				}
			}));
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			toast({
				title: "Fuzzing failed!",
				description: "Please make sure that your URL is valid, at least one word list is selected, keywords are corresponding and valid inputs to advanced options are provided.",
				status: "error",
				duration: 9000,
				isClosable: true
			});
			setResults([]);
		}

		scroller();
	};

	return (
		<Box width="2xl" justifyContent="center">
			<Stack direction="column" spacing={5}>
				{ /* URL Search bar + Fuzz Btn */}
				<InputGroup>
					<UrlSearchBar setURL={setURL} />
					<InputRightElement width="4.5rem">
						<Button
							h="1.75rem"
							size="sm"
							colorScheme="teal"
							isLoading={isLoading}
							type="submit"
							onClick={fuzz}
						>
							Fuzz
						</Button>
					</InputRightElement>
				</InputGroup>
				<Accordion allowToggle mt={5}>
					<AccordionItem>
						<h2 as={Heading}>
							<AccordionButton>
								<Box flex="1" textAlign="center">
									Add Word Lists
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							{/* Word list selection */}
							<MultipleWordListsSelectionBox wordLists={wordLists} setWordLists={setWordLists} />
						</AccordionPanel>
					</AccordionItem>							
					{/* Advanced matcher and filter options */}
					<AccordionItem>
						<h2 as={Heading}>
							<AccordionButton>
								<Box flex="1" textAlign="center">
									Advanced options
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							<AdvancedOptions matcherOpts={matcherOpts} setMatcherOpts={setMatcherOpts} filterOpts={filterOpts} setFilterOpts={setFilterOpts} />
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Stack>
		</Box>
	);
}
