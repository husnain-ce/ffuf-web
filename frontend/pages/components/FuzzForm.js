import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

/**
 * TODO:
 * - parse query string for URL to get keywords
 * - compare wordlist keyword against keywords in query string
 * - if discrepancy then error
 * 
 */

export default function FuzzForm() {
	return (
		<Formik
			initialValues={{
				url: '',
				custom_query: '',
			}}
			onSubmit={(values, { setSubmitting }) => {
				// submit method goes here
				setSubmitting(false);
			}}
		>
			{(props) => (
				<Box width="xl" justifyContent="center">
					<Form>
						<Tabs colorScheme="teal">
							<TabList>
								<Tab>Enter URL</Tab>
								<Tab>Add Word Lists</Tab>
								<Tab>Advanced Options</Tab>
							</TabList>
							<TabPanels px="5">
								<TabPanel>
									<Stack direction="column" spacing={5} alignItems="center">
										<Box width="xl" justifyContent="center">
											<Field name="url">
												{({ field, form }) => (
													<FormControl>
														<FormLabel>URL</FormLabel>
														<InputGroup>
															<Input 
																pr="4.5rem"
																{...field}
																placeholder="http://testphp.vulnweb.com" />
															<InputRightElement width="4.5rem">
																<Button
																	h="1.75rem"
																	size="sm"
																	colorScheme="teal"
																	isLoading={props.isSubmitting}
																	type="submit"
																>
																	Fuzz
																</Button>
															</InputRightElement>
														</InputGroup>
														{/* <FormErrorMessage></FormErrorMessage> */}
													</FormControl>
												)}
											</Field>
										</Box>
									</Stack>
								</TabPanel>
								<TabPanel>
			
								</TabPanel>
								<TabPanel>
								
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Form>
				</Box>
			)}
		</Formik>
	);
}