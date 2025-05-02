"use client";
import React, { useEffect, useState } from "react";
import { HoverBorderGradient } from "@/ui/HoverBorder";
import { motion } from "framer-motion";
import { PlaceholdersAndVanishInput } from "@/ui/InputBox";
import axios from "axios";
import { Skeleton } from "@/ui/skeleton";

interface SearchResult {
  content: string;
  match: string;
}
export default function Feature2() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<SearchResult[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/search", {
        url,
        query,
      });
      setRes(response.data.results);
      setErr(null);
    } catch (error) {
      console.error("Search error:", error);
      setErr("Error performing search. Please try again.");
      setRes([]);
    } finally {
      setLoading(false);
    }
  };

  const query_placeholders = [
    "ML Algorithms",

    "NLP Advancements",

    "Data Science",

    "AI advancements in 2025",

    "What models are best suited for text-analysis",

    "Top models for reasoning",

    "Is grok a good model",
  ];

  const url_placeholders = [
    "https://reddit.com",

    "https://anything.com",

    "https://anyinfo.com",

    "https://smarter.codes",
  ];

  const text = "Instant Content Extraction";
  const text_effect = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: i * 0.1,
      },
    }),
  };

  useEffect(() => {
    setRes([]);
    setLoading(false);
    setErr(null);
  }, []);

  return (
    <div className="relative z-0 overflow-hidden pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        className="text-center pt-8"
      >
        <span className="cursor-pointer">
          <h1 className="text-5xl  cursor-pointer md:text-6xl font-semibold">
            Transform Web Content into
          </h1>
          <h1 className="text-5xl md:text-6xl font-semibold">
            Actionable Insights
          </h1>
          <p className="text-xl mt-6 font-medium">
            Leverage transformer models to understand context, not just keywords
          </p>
          <p className="text-lg font-medium">
            And get 10 most relevant HTML chunks in milliseconds using Milvus
            vector database
          </p>
        </span>
      </motion.div>

      <div className="flex justify-center">
        {text.split(" ").map((cur, i) => (
          <motion.div
            key={i}
            variants={text_effect}
            initial="initial"
            custom={i}
            animate="animate"
            className="text-5xl md:leading-[4rem] font-medium text-center tracking-tighter pr-2 mt-24  bg-clip-text bg-gradient-to-b from-[#ffffff] to-neutral-400 text-transparent"
          >
            {cur == "" ? <span>&nbsp;</span> : cur}
          </motion.div>
        ))}
      </div>
      <div className="pb-24">
        <motion.div
          initial={{ x: -100, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05 }}
          className="text-xl mb-20 cursor-pointer font-semibold flex flex-col justify-center items-center text-center text-gray-400"
        >
          Built on FastAPI for seamless integration with
          <br />
          your existing workflows.
        </motion.div>
        <div className="flex flex-col items-center">
          <div className="pb-12 w-full max-w-3xl">
            <div className="input-wrapper">
              <PlaceholdersAndVanishInput
                oftype="url"
                Value={url}
                placeholders={url_placeholders}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            <div className="flex items-center gap-2 pl-24">
              <div className="flex-1">
                <PlaceholdersAndVanishInput
                  oftype="query"
                  Value={query}
                  placeholders={query_placeholders}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQuery(e.target.value)
                  }
                />
              </div>
              <HoverBorderGradient
                type="submit"
                className=" dark:bg-black bg-white text-black dark:text-white cursor-pointer gap-4 flex items-center space-x-2"
              >
                Search
                <svg
                  width="66"
                  height="65"
                  viewBox="0 0 66 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-black dark:text-white"
                >
                  <path
                    d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
                    stroke="currentColor"
                    strokeWidth="15"
                    strokeMiterlimit="3.86874"
                    strokeLinecap="round"
                  />
                </svg>
              </HoverBorderGradient>
            </div>
          </form>
        </div>
        {err && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg max-w-md w-full">
              <p className="text-center">{err}</p>
            </div>
          </motion.div>
        )}
        {loading ? (
          <div className="flex justify-center mt-8">
            <Skeleton className="w-[450px] h-[120px] rounded-full bg-gray-500" />
          </div>
        ) : (
          res.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center mt-12 w-full max-w-2xl mx-auto"
            >
              <div className="relative w-full">
                <div className="rgb-animate-border"></div>
                <div className="relative bg-black rounded-xl overflow-hidden p-4 w-full">
                  <div className="space-y-4">
                    {res.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900/50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-gray-200">{result.content}</p>
                          </div>
                          <span className="text-sm text-green-400 ml-2">
                            {result.match} match
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
