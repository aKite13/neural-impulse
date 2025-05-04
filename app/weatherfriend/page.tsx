
import Image from "next/image";
import WeatherFriendClient from "../components/WeatherFriendClient";


export default function WeatherFriend() {
  return (
  
      <div className="relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-10 lg:px-20 py-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 max-w-xl space-y-6">
            <h1 className="text-center lg:text-left">
              <span className="special-word text-4xl sm:text-5xl">Weather</span>{" "}
              <span className="special-word-1 text-4xl sm:text-5xl">Friend</span>
            </h1>
            <p className="intro-text text-lg sm:text-xl text-center lg:text-left">
              Your weather assistant is ready. Ask about the weather in any city!
            </p>
            <WeatherFriendClient />
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <Image
                src="/img/refined.png"
                alt="WeatherFriend Bot"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className="rounded-full border-2 p-1 bg-indigo-800 dark:bg-indigo-500 object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
  
  );
}

