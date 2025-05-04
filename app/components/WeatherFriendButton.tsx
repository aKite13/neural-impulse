// components/WeatherFriendButton.tsx
"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function WeatherFriendButton() {
  const router = useRouter();
  const { status } = useSession();

  const handleWeatherFriendClick = () => {
    if (status === "authenticated") {
      router.push("/weatherfriend");
    } else {
      router.push("/signup");
    }
  };

  return (
    <button 
      onClick={handleWeatherFriendClick}
      className="mt-6 px-6 py-3 bg-indigo-800 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-900 dark:hover:bg-indigo-600 transition-colors cursor-pointer"
    >
      Talk to WeatherFriend
    </button>
  );
}