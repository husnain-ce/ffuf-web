import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { Box, Center, Heading, Stack } from '@chakra-ui/react';
import FuzzForm from './components/FuzzForm';
import WordListSelectionMenu from './components/WordListSelectionMenu';
import FuzzFormAccordion from './components/FuzzFormAccordion';

export default function Home() {
  return (
    <div style={{ height: "100%" }}>
      <Head>
        <title>Web Fuzzer</title>
        <meta name="description" content="An interactive UI for ffuf - a web fuzzing tool" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main style={{ height: "100%" }}>
        { /* <a href="https://www.flaticon.com/free-icons/cyber-security" title="cyber security icons">Cyber security icons created by Freepik - Flaticon</a> */ }
        <Box style={{ position: "absolute", zIndex: -1, top: "50px", left: "50px", opacity: 0.4, transform: "rotate(-45deg)" }}>
          <Image src="/assets/cyber-security.png" width="300" height="260" alt="" />
        </Box>
        <Center height="100%">
          <Box justifyContent="center" alignItems="center">
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
