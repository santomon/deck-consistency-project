import Head from "next/head";
import Link from "next/link";
import * as ydke from "ydke";
import { ChangeEvent, useState } from "react";
import { useQueries, useQuery, useQueryClient } from "react-query";
import { CardInfo, YGOCardInfoResponseSchema } from "~/types";
import {useDeckStore} from "~/store";
import {main} from "@popperjs/core";
import {queryKeyFactory} from "~/utils";
import DeckView from "~/components/DeckView";
import { useCardInfos } from "~/queries";

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // State maintenance
  const queryClient = useQueryClient();
  const mainDeck = useDeckStore((state) => state.mainDeck);
  const replaceMainDeck = useDeckStore((state) => state.replaceMainDeck)
  const xdd = queryClient.getQueryData<CardInfo[]>(["cardInfo", 1]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update state
  };


  const handleYDKEButtonSubmitted = () => {
    let ydkeResult;
    try {
      ydkeResult = ydke.parseURL(inputValue); //
      ydkeResult = {
        main: Array.from(ydkeResult.main),
        extra: Array.from(ydkeResult.extra),
        side: Array.from(ydkeResult.side),
      };
    } catch (e) {
      ydkeResult = {
        main: new Array<number>(),
        extra: new Array<number>(),
        side: new Array<number>(),
      };
    }
    replaceMainDeck(ydkeResult.main)
    setInputValue("");
  }

  const mainDeckQueryResults = useCardInfos();
  console.log("main window main deck", mainDeck)
  console.log(mainDeckQueryResults.map((mdqr) => mdqr.data))


  return (
    <>
      <Head>
        <title>Deck Consistency Simulation</title>
        <meta name="description" content="Deck Consistency Simulation" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-teal-700">
        <div className="flex flex-col items-center p-4">
          <div className={"flex flex-row items-center gap-2"}>
            <input
                id="textInput"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Type something..."
                className="w-80 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleYDKEButtonSubmitted}
                className="p-2 bg-blue-500 text-white rounded-md shadow-sm"
            >
              Parse YDKE
            </button>
          </div>
        </div>
        <DeckView />
      </main>
    </>
  );
}
