import { Button, forwardRef, Input, InputGroup, InputLeftAddon, Menu, MenuButton, MenuItem, MenuList, Stack } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import SelectFile from "./SelectFile";

const WordListSubMenu = forwardRef((props, ref) => {
	const { wordListHandler, pathName, pathMap } = props;
	const wordListFiles = [];

	return (
		<Stack direction="column" spacing={5}>
			<Menu>
				<MenuButton ref={ref} as={Button} my={2} width="xs" style={{ borderRadius: 0 }} rightIcon={<ChevronDownIcon />}>
					{ pathName }
				</MenuButton>
				<MenuList p={2}>
					{ pathMap && Object.keys(pathMap) && Object.keys(pathMap).map((f, idx) => {
						if (typeof pathMap[f] === 'string') {
							wordListFiles.push({ name: f, path: pathMap[f] });
						} else {
							return (
								<MenuItem my={2} key={idx} as={WordListSubMenu} wordListHandler={wordListHandler} pathName={f} pathMap={pathMap[f]} />
							)
						}
					})}
					{ wordListFiles.length > 0 && (
						<SelectFile
						my={2}
						files={wordListFiles}
						onChangeHandler={(e) => wordListHandler(e.target.value)}
						/>
					)}
				</MenuList>
			</Menu>
		</Stack>
	);
});

export default function WordListSelectionMenu({ initialWordList, initialKeyword, updatePath, updateKeyword, pathMap, field, form, ...props }) {
	const [wordList, setWordList] = useState(initialWordList);
	const [keyword, setKeyword] = useState("");
	const wordListFiles = [];

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
							if (typeof pathMap[f] === 'string') {
								wordListFiles.push({ name: f, path: pathMap[f] });
								return null;
							} else {
								return (
									<MenuItem key={idx} as={WordListSubMenu} wordListHandler={handleWordListSelection} pathName={f} pathMap={pathMap[f]} />
								)
							}
							}
						)}
						{ wordListFiles.length > 0 && (
							<SelectFile 
							my={2}
							files={wordListFiles} 
							onChangeHandler={(e) => handleWordListSelection(e.target.value)}
							/>
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
