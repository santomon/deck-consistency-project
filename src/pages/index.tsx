import Head from "next/head";
import Link from "next/link";
import * as ydke from "ydke";
import { ChangeEvent, useState } from "react";
import { useQueries, useQuery, useQueryClient } from "react-query";
import { CardInfo, YGOCardInfoResponseSchema } from "~/types";
import {useDeckStore} from "~/store";
import {main} from "@popperjs/core";

const createPlaceHolderCardInfoResponse = (): CardInfo[] => {
  return [];
};

const getCardInfo = async (cardIds?: number[]) => {
  const commaSeparatedIds = cardIds?.join(",");
  if (!commaSeparatedIds) {
    return createPlaceHolderCardInfoResponse();
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CIENTVAR_YGO_CARD_INFO_API_BASE_URL}?id=${commaSeparatedIds}`,
  );
  const responseData = YGOCardInfoResponseSchema.parse(await response.json());
  return responseData.data;
};

const queryKeyFactory = {
  cardInfo: (cardId: number) => ["cardInfo", cardId],
};

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // State maintenance
  const queryClient = useQueryClient();
  const mainDeckIds = useDeckStore((state) => state.mainDeckIds);
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
  }

  const mainDeckQueryResults = useQueries(
    mainDeckIds.map((cardId) => {
      return {
        queryKey: queryKeyFactory.cardInfo(cardId),
        queryFn: () => getCardInfo([cardId]),
        initialData: [],
      };
    }),
  );


  return (
    <>
      <Head>
        <title>Deck Consistency Simulation</title>
        <meta name="description" content="Deck Consistency Simulation" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-teal-700">
        <div className="flex flex-col items-center p-4">
          <label
            htmlFor="textInput"
            className="mb-2 text-lg font-medium text-gray-700"
          >
            Enter Text
          </label>
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm"
            >
            Parse YDKE
          </button>
        </div>
      </main>
    </>
  );
}
