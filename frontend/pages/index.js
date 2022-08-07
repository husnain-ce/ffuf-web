import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { Box, Center, Heading, Stack } from '@chakra-ui/react';
import FuzzForm from './components/FuzzForm';
import WordListSelectionMenu from './components/WordListSelectionMenu';
import FuzzFormAccordion from './components/FuzzFormAccordion';

export default function Home() {
  return (
    <div height="100vh">
      <Head>
        <title>Web Fuzzer</title>
        <meta name="description" content="An interactive UI for ffuf - a web fuzzing tool" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main height="100vh">
        <Center mt="32">
          <Box height="100%" justifyContent="center" alignItems="center">
            <Stack direction="column" spacing={5} alignItems="center">
              <Heading fontSize="2xl">Web Fuzzer</Heading>
              <FuzzFormAccordion />
            </Stack>
          </Box>
        </Center>
      </main>
    </div>
  )
}
