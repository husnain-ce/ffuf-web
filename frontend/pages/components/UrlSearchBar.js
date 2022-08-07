import { Input } from "@chakra-ui/react";

export default function UrlSearchBar({ setURL, ...props }) {
	return (
		<Input 
			pr="4.5rem"
			{...props}
			onChange={(e) => setURL(e.target.value)}
			placeholder="http://testphp.vulnweb.com" />
	);
}