"use client";

import { useState } from "react";
import Link from "next/link";

import { MicrophoneIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
export function Slider() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="relative isolate overflow-hidden bg-slate-600 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything is better with a Song
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Concerts will bring you a feeling of comfort and relaxation after
              working days.
            </p>
            <div className="flex max-w-md gap-x-4 items-center mt-8">
              <label htmlFor="search" className="sr-only">
                Email address
              </label>
              <input
                id="search"
                name="search"
                type="text"
                autoComplete="search"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link href={`/menu?search=${searchTerm}`} passHref>
                <button className="flex-none rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-auto mb-4 border-0">
                  Search
                </button>
              </Link>
              {/* <button
                type="submit"
                className="flex-none rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-auto mb-4"
              >
                Search
              </button> */}
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <MicrophoneIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-white">
                Live Beats: Unforgettable Moments
              </dt>
              <dd className="mt-2 leading-7 text-gray-400">
                Step into the enchanting world of live music with our concert
                series, where melodies come to life and memories are made.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <MusicalNoteIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <dt className="mt-4 font-semibold text-white">
                Memorable Evenings
              </dt>
              <dd className="mt-2 leading-7 text-gray-400">
                Join us in creating unforgettable moments, as we transform
                ordinary evenings into extraordinary experiences
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
