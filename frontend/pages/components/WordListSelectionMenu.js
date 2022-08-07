import { Button, Input, InputGroup, InputLeftAddon, Menu, MenuButton, MenuItem, MenuList, Stack } from "@chakra-ui/react";
import { ChevronDownIcon} from "@chakra-ui/icons";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

const tmp = {
	"Discovery": {
		"Web-Content": {
			"big.txt": "seclists/Discovery/Web-Content/big.txt",
			"CMS": {
				"Django.txt": "seclists/Discovery/Web-Content/CMS/Django.txt",
				"Drupal.txt": "seclists/Discovery/Web-Content/CMS/Drupal.txt",
				"sitemap-magento.txt": "seclists/Discovery/Web-Content/CMS/sitemap-magento.txt",
				"wordpress.fuzz.txt": "seclists/Discovery/Web-Content/CMS/wordpress.fuzz.txt",
				"wp-plugins.fuzz.txt": "seclists/Discovery/Web-Content/CMS/wp-plugins.fuzz.txt",
				"wp-themes.fuzz.txt": "seclists/Discovery/Web-Content/CMS/wp-themes.fuzz.txt"
			},
			"combined_words.txt": "seclists/Discovery/Web-Content/combined_words.txt",
			"common.txt": "seclists/Discovery/Web-Content/common.txt",
			"directory-list-1.0.txt": "seclists/Discovery/Web-Content/directory-list-1.0.txt",
			"directory-list-2.3-big.txt": "seclists/Discovery/Web-Content/directory-list-2.3-big.txt",
			"directory-list-2.3-medium.txt": "seclists/Discovery/Web-Content/directory-list-2.3-medium.txt",
			"directory-list-2.3-small.txt": "seclists/Discovery/Web-Content/directory-list-2.3-small.txt",
			"directory-list-lowercase-2.3-big.txt": "seclists/Discovery/Web-Content/directory-list-lowercase-2.3-big.txt",
			"directory-list-lowercase-2.3-medium.txt": "seclists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt",
			"directory-list-lowercase-2.3-small.txt": "seclists/Discovery/Web-Content/directory-list-lowercase-2.3-small.txt",
			"dirsearch.txt": "seclists/Discovery/Web-Content/dirsearch.txt",
			"URL": {
				"urls-Drupal-7.20.txt": "seclists/Discovery/Web-Content/URL/urls-Drupal-7.20.txt",
				"urls-joomla-3.0.3.txt": "seclists/Discovery/Web-Content/URL/urls-joomla-3.0.3.txt",
				"urls-wordpress-3.3.1.txt": "seclists/Discovery/Web-Content/URL/urls-wordpress-3.3.1.txt"
			},
			"web-extensions.txt": "seclists/Discovery/Web-Content/web-extensions.txt",
			"web-mutations.txt": "seclists/Discovery/Web-Content/web-mutations.txt",
			"weblogic.txt": "seclists/Discovery/Web-Content/weblogic.txt"
		}
	},
	"Fuzzing": {
		"SQLi": {
			"Generic-BlindSQLi.fuzzdb.txt": "seclists/Fuzzing/SQLi/Generic-BlindSQLi.fuzzdb.txt",
			"Generic-SQLi.txt": "seclists/Fuzzing/SQLi/Generic-SQLi.txt",
			"quick-SQLi.txt": "seclists/Fuzzing/SQLi/quick-SQLi.txt"
		},
		"XSS": {
			"XSS-BruteLogic.txt": "seclists/Fuzzing/XSS/XSS-BruteLogic.txt",
			"XSS-Bypass-Strings-BruteLogic.txt": "seclists/Fuzzing/XSS/XSS-Bypass-Strings-BruteLogic.txt"
		}
	},
	"test": {
		"common.txt": "seclists/test/common.txt",
		"fuzzing-boom.txt": "seclists/test/fuzzing-boom.txt"
	}
};

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

	pathMap = tmp;

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
