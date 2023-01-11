import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, FormControl, FormLabel, Heading, IconButton, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MultipleWordListsSelectionBox from "./MultipleWordListsSelectionBox";
import axios from "axios";
import UrlSearchBar from "./UrlSearchBar";
import AdvancedOptions from "./AdvancedOptions";
import * as urlUtil from "url";
import { QuestionIcon } from "@chakra-ui/icons";

export default function FuzzFormAccordion({ results, setResults, scroller, setResponse }) {
	const [url, setURL] = useState("");
	const [wordLists, setWordLists] = useState([{}]);
	const [matcherOpts, setMatcherOpts] = useState({});
	const [filterOpts, setFilterOpts] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		// kill old req, if any
		(async () => {
			try {
				await axios.get("http://localhost:8000/api/kill")
			} catch (e) { }
		})();
	}, []);

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
			if (fuzzBody.word_lists && fuzzBody.word_lists.length > 1) {
				if (!fuzzBody.word_lists.every(v => v.path && v.keyword && v.keyword.length > 0)) {
					setIsLoading(false);
					toast({
						title: "Fuzzing failed!",
						description: "For multiple word lists, explicit keywords are expected, but were not found in current configuration.\nPlease add keywords for each word list",
						status: "error",
						duration: 9000,
						isClosable: true
					});

					return;
				}
			}

			const res = await axios.post("http://localhost:8000/api/fuzz", {
				...fuzzBody
			});

			if (!res.data.results.length) {
				setIsLoading(false);
				toast({
					title: "No Results!",
					description: "There were no results obtained for the currently set configuration, this might be due to the provided advanced options yeilding no corresponding results.",
					status: "warning",
					duration: 9000,
					isClosable: true
				});

				return;
			}

			// console.log(res);
			// console.log(JSON.stringify(res.data, null, 4));
			setResponse(res.data);
			setResults(res.data.results.map((r, idx) => {
				return {
					inputs: {
						...r.input
					},
					status: r.status,
					length: r.length,
					words: r.words,
					lines: r.lines,
					duration: r.duration,
				}
			}));
			setIsLoading(false);
		} catch (e) {
			const default_err_res = "Please make sure that your URL is valid, at least one word list is selected, keywords are corresponding and valid inputs to advanced options are provided.";
			let err_res;
			if (e.response.status === 422) {
				err_res = default_err_res;
			} else {
				err_res = e?.response?.data?.detail ?? "Please make sure that your URL is valid, at least one word list is selected, keywords are corresponding and valid inputs to advanced options are provided.";
			}
			setIsLoading(false);
			if (err_res.includes("\n")) {
				err_res.split("\n").forEach(single_err_res => toast({
					title: "Fuzzing failed!",
					description: single_err_res,
					status: "error",
					duration: 9000,
					isClosable: true
				}))
			} else {
				toast({
					title: "Fuzzing failed!",
					description: err_res,
					status: "error",
					duration: 9000,
					isClosable: true
				});
			}
			setResults([]);
		}

		scroller();
	};

	return (
		<Box width="2xl" justifyContent="center">
			<Stack direction="column" spacing={5}>
				{ /* URL Search bar + Fuzz Btn */}
				<InputGroup>
					<InputLeftElement>
						<IconButton onClick={onOpen} h="1.75rem" size="sm" fontSize="md" icon={<QuestionIcon />} />
					</InputLeftElement>
					<UrlSearchBar pl="2.5rem" setURL={setURL} />
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
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Fuzz URL Guide</ModalHeader>
					<ModalCloseButton />
					<ModalBody px={10} py={5}>
						<ul>
							<li>Keywords are replaced by corresponding wordlist values</li>
							<li>The default "FUZZ" keyword is automatically appended to the given URL, if not explicitly provided. e.g. http://google.com becomes http://google.com/FUZZ</li>
							<li>You can use multiple keywords by placing them throughout the URL and providing them against the corresponding word lists. e.g. http://google.com/?PARAM=VALUE and then provide a word list with the keyword PARAM and another with VALUE</li>
						</ul>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}
