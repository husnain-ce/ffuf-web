import { Center, Divider, Stack } from "@chakra-ui/react";
import FilterOptions from "./FilterOptions";
import MatcherOptions from "./MatcherOptions";

export default function AdvancedOptions({ matcherOpts, setMatcherOpts, filterOpts, setFilterOpts, ...props }) {
	return (
		<Stack direction="row" spacing={5}>
			<MatcherOptions matcherOpts={matcherOpts} setMatcherOpts={setMatcherOpts} />
			<Center>
				<Divider orientation="vertical" />
			</Center>
			<FilterOptions filterOpts={filterOpts} setFilterOpts={setFilterOpts} />
		</Stack>
	);
}