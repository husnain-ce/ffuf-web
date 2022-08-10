import { Box, Stack, Text } from "@chakra-ui/react";

export default function CustomToolTip({ active, payload, label }) {
	if (active && payload && payload.length) {
		return (
			<Stack spacing={2} bgColor="white" borderRadius={10} px={5} py={2}>
				<p as={Text} mb={2}>{(label.length && label) ?? "-"}</p>
				{ payload.map((p, idx) => (
					<p key={idx}>
						<strong style={{ color: p.color }}>
							{p.dataKey}:
						</strong>{' '}
						{p.value}
					</p>
				))}
				<p>
					<strong>
						status code:
					</strong>{' '}
					{payload[0].payload.status}</p>
			</Stack>
		)
	}

	return null;
};
