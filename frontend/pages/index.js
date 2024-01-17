import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { Box, Center, Heading, Stack, Flex } from '@chakra-ui/react';
import FuzzFormAccordion from './components/FuzzFormAccordion';
import { motion } from "framer-motion";
import { useRef, useState } from 'react';
import CustomBarChart from './components/CustomBarChart';

export default function Home() {
  const [results, setResults] = useState([]);
  const [response, setResponse] = useState(null);
  const resultsRef = useRef(null);

  const scrollToResults = () => resultsRef.current.scrollIntoView();

  const getSegmentedResults = () => {
    // return results
    const segmentedResults = [];

    const resultsToTake = results.slice(0, 1000);

    let segment = [];
    let semiSegment = [];
    for (let i = 0, len = resultsToTake.length; i < len; i++) {
      if ((i + 1) % 20 === 0 || (i + 1) === len) {
        segment.push(semiSegment);
        semiSegment = [];
      }

      if (segment.length === 3 || (i + 1) === len) {
        segmentedResults.push(segment);
        segment = [];
      }

      semiSegment.push({ ...resultsToTake[i] });
    }

    if (segmentedResults.length > 0) {
      return segmentedResults.map((r, idx) => (
        <Stack key={idx} direction="row" spacing={2}>
          {r.map((data, dataIdx) => (
            <CustomBarChart key={dataIdx} data={data} />
          )
          )}
        </Stack>
      ));
    }
    return null;
  }

  return (
    <div>
      <motion.div
        // style={{ height: "100%" }}
        animate={{
          background: "linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)",
          backgroundSize: "400% 400%",
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ repeat: Infinity, repeatDelay: 2, ease: "easeIn", duration: 10 }}
      >
        <Head>
          <title>Web Fuzzer</title>
          <meta name="description" content="An interactive UI for ffuf - a web fuzzing tool" />
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>

        <main>
          { /* <a href="https://www.flaticon.com/free-icons/cyber-security" title="cyber security icons">Cyber security icons created by Freepik - Flaticon</a> */}
          {/* <Box style={{ position: "absolute", zIndex: -1, top: "50px", left: "50px", opacity: 0.4, transform: "rotate(-45deg)" }}>
            <Image src="/assets/cyber-security.png" width="300" height="260" alt="" />
          </Box> */}
          <Center height="100vh">
            <Box justifyContent="center" alignItems="center" px={8} py={7} borderRadius={10} backgroundColor="white" boxShadow={"1px 1px 5px rgba(0, 0, 0, 0.7)"} border="1px solid" borderColor="gray.300">
              <Stack direction="column" spacing={5} alignItems="center">
                <Heading fontSize="2xl">Web Fuzzer</Heading>
                <FuzzFormAccordion results={results} setResults={setResults} scroller={scrollToResults} setResponse={setResponse} />
              </Stack>
            </Box>
          </Center>
          <Center ref={resultsRef}>
            {results && results.length > 0 && (
              <Stack width="97vw" bgColor="white" mx={5} direction="column" my={5} borderRadius={10}>
                <Heading textAlign="center" fontSize="3xl" mb={5} mt={3}>Results</Heading>
                <Flex pl="8">
                  <h5><strong>Number of mutations:</strong></h5>&nbsp;
                  <p>{response.file_count}</p>
                </Flex>
                <Flex pl="8" pb="5">
                  <h5><strong>Number of seeds:</strong></h5>&nbsp;
                  <p>{response.word_count}</p>
                </Flex>
                {getSegmentedResults()}
              </Stack>
            )}
          </Center>
        </main>
      </motion.div>
    </div>
  )
}
