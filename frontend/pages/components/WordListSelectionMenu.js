import { Button, Input, InputGroup, InputLeftAddon, Menu, MenuButton, MenuItem, MenuList, Stack } from "@chakra-ui/react";
import { ChevronDownIcon} from "@chakra-ui/icons";
import { useEffect, useState } from "react";

function WordListSubMenu({ wordListHandler, pathName, pathMap, ...props }) {
	return (
		<Stack direction="column" spacing={5}>
			<Menu>
				<MenuButton as={Button} my={2} width="xs" style={{ borderRadius: 0 }} rightIcon={<ChevronDownIcon />}>
					{ pathName }
				</MenuButton>
				<MenuList p={2}>
					{ pathMap && Object.keys(pathMap) && Object.keys(pathMap).map((f, idx) => {
						return typeof pathMap[f] === 'string' ? (
							<MenuItem my={2} key={idx} onClick={() => wordListHandler(pathMap[f])}>{f}*</MenuItem>
						) : (
							<MenuItem my={2} key={idx} as={WordListSubMenu} wordListHandler={wordListHandler} pathName={f} pathMap={pathMap[f]} />
						)}
					)}
				</MenuList>
			</Menu>
		</Stack>
	);
}

export default function WordListSelectionMenu({ initialWordList, initialKeyword, updatePath, updateKeyword, pathMap, field, form, ...props }) {
	const [wordList, setWordList] = useState(initialWordList);
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		setWordList(initialWordList);
		setKeyword(initialKeyword);
	}, [initialWordList, initialKeyword]);

	const handleWordListSelection = (wordList) => {
		updatePath(wordList)
		setWordList(wordList);
	};

	const handleKeywordInput = (e) => {
		updateKeyword(e.target.value);
		setKeyword(e.target.value);
	};

	return (
		<Stack direction="row" spacing={5}>
			<Stack direction="column" spacing={5} justifyContent="flex-start" alignItems="flex-start">
				<Menu>
					<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
						Word List
					</MenuButton>
					<MenuList p={2}>
						{ pathMap && Object.keys(pathMap) && Object.keys(pathMap).map((f, idx) => {
							return typeof pathMap[f] === 'string' ? (
								<MenuItem key={idx} onClick={() => handleWordListSelection(pathMap[f])}>{f}*</MenuItem>
							) : (
								<MenuItem key={idx} as={WordListSubMenu} wordListHandler={handleWordListSelection} pathName={f} pathMap={pathMap[f]} />
							)}
						)}
					</MenuList>
				</Menu>
			</Stack>
			<InputGroup>
				<InputLeftAddon bgColor={!wordList.length ? "#ececec" : "lightgreen" }>
					{!wordList.length ? "" : wordList.split("/").pop()}:	
				</InputLeftAddon>
				<Input onChange={handleKeywordInput} value={keyword} placeholder="PARAM" />
			</InputGroup>
		</Stack>
	);
}
