import { Select } from "@chakra-ui/react";

export default function SelectFile({ files, onChangeHandler, ...props }) {
	if (!files && !files.length) return null;

	return (
		<Select 
		onChange={onChangeHandler} 
		defaultValue=""
		{...props}>
			<option hidden disabled value="">-- select a word list --</option>
			{ files.map((file, idx) => (
				<option key={idx} value={file.path}>{file.name}</option>
			)) }
		</Select>
	);
}
