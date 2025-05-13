import Image from "next/image"
//import Link from "next/link" // Добавляем импорт компонента Link
import WeatherFriendButton from "./components/WeatherFriendButton"

export default function Home() {
  return (
    <div className="lg:px-40 px-10 py-25 flex flex-col items-center gap-20">
      {/* Основной контент */}
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-30 lg:text-start">
        <div>
          <h1>
            <span className="special-word text-5xl">Welcome To</span>{" "}
            <span className="special-word-1 text-5xl">My Website</span>
          </h1>
          <p className="intro-text">
            Hi! I&apos;m a beginner web developer <br /> studying AI and using
            vibe coding <br /> to generate code with AI based on task
            descriptions.
            <br /> Welcome to my blog,
            <br /> where you can dive into AI topics,
            <br /> create your own posts, and share your thoughts in the
            comments.
          </p>
        </div>
        <div>
          <Image
            src="/mern.png"
            alt="MERN Stack"
            className="rounded-full border-2 p-1 bg-indigo-800 dark:bg-indigo-500"
            width={500}
            height={500}
            priority={true}
          />
        </div>
      </div>

      {/* WeatherFriend секция */}
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-60 lg:text-start">
        <div>
          <Image
            src="/img/weatherfriend.png"
            alt="WeatherFriend Bot"
            className="rounded-full border-2 p-1 bg-indigo-800 dark:bg-indigo-500"
            width={350}
            height={350}
            priority={true}
          />
        </div>
        <div>
          <h2>
            <span className="special-word text-4xl">Meet Weather</span>
            <span className="special-word-1 text-4xl">Friend</span>
          </h2>
          <p className="intro-text mt-4">
            Weather Friend is your personal weather assistant.
            <br /> Get real-time weather updates, personalized forecasts,
            <br /> for your day.
          </p>

          <WeatherFriendButton />
        </div>
      </div>
    </div>
  )
}
