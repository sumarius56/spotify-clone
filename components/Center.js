import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();

  const [color, setColor] = useState(null);

  const playlistId = useRecoilValue(playlistIdState);

  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
    const interval = setInterval(() => {
      setColor(shuffle(colors).pop());
    }, 3000);
    return () => clearInterval(interval);
  }, [playlistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(
      function (data) {
        console.log("Some information about this playlist", data.body);
        setPlaylist(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
          <img
            className="rounded-full h-10 w-10"
            src={session?.user?.image}
            alt={session?.user?.name}
          />
          <h2>{session?.user?.name}</h2>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black  ${color} h-80 text-white  p-8 w=full`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt="/"
        />
        <div>
          <p>PLAYLIST</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {playlist?.name}
          </h2>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
