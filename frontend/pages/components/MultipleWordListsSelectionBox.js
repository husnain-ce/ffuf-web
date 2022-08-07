import { IconButton, Stack } from "@chakra-ui/react";
import WordListSelectionMenu from "./WordListSelectionMenu";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MultipleWordListsSelectionBox({ wordLists, setWordLists, ...props }) {
	const [pathMap, setPathMap] = useState({});
	const getPathMap = async () => {
		const { data } = await axios.get("http://localhost:8000/api/params");

		setPathMap(data);
	};

	useEffect(() => {
		getPathMap();
	}, []);

	const addWordList = () => {
		setWordLists([...wordLists, {}]);
	};

	const removeWordList = (idx) => {
		setWordLists(wordLists.filter((wl, wlIdx) => {
			return wlIdx !== idx;
		}));
	};

	const updateWordListPath = (wordListPath, idx) => {
		if (wordLists.length <= idx) {
			return;
		}

		setWordLists(wordLists.map((wl, wlIdx) => {
			if (wlIdx === idx) {
				wl.path = wordListPath;
			}

			return wl;
		}));
	}

	const updateWordListKeyword = (keyword, idx) => {
		if (wordLists.length <= idx) {
			return;
		}

		setWordLists(wordLists.map((wl, wlIdx) => {
			if (wlIdx === idx) {
				if (typeof keyword !== 'string' || !keyword.length) {
					if (wl.keyword) {
						delete wl.keyword;
					}
				} else {
					wl.keyword = keyword;
				}
			}

			return wl;
		}));
	}

	return (
		<Stack direction="column">
				{ wordLists && wordLists.map((wordListObj, idx) => {
					return (
						<Stack key={idx} direction="row" spacing={5} width="100%" justifyContent="space-between" alignItems="center">
							<WordListSelectionMenu initialWordList={wordListObj.path ?? ""} initialKeyword={wordListObj.keyword ?? ""} updatePath={(wordListPath) => updateWordListPath(wordListPath, idx)} updateKeyword={(keyword) => updateWordListKeyword(keyword, idx)} pathMap={pathMap} />
							<Stack direction="row" spacing={2}>
								<IconButton onClick={addWordList} size="xs" fontSize="sm" colorScheme="green" borderRadius="50" justifySelf="flex-end" icon={<AddIcon />} />
								{ idx > 0 && (
									<IconButton onClick={() => removeWordList(idx)} size="xs" fontSize="sm" colorScheme="red" borderRadius="50" justifySelf="flex-end" icon={<MinusIcon />} />
								)}
							</Stack>
						</Stack>
					)}
				)}
		</Stack>
	);
}