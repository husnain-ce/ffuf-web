import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Box, Stack } from '@chakra-ui/react';
import FuzzForm from './components/FuzzForm';
import WordListSelectionMenu from './components/WordListSelectionMenu';
import FuzzFormAccordion from './components/FuzzFormAccordion';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Web Fuzzer</title>
        <meta name="description" content="An interactive UI for ffuf - a web fuzzing tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box>
          <Stack direction="column" spacing={5} alignItems="center">
            <FuzzFormAccordion />
          </Stack>
        </Box>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
