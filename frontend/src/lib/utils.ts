import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const pingServer = async (
  setServerLoading: Dispatch<SetStateAction<boolean>>
) => {
  let response = null;
  const url: string = import.meta.env.VITE_BACKEND_URL;
  while (!response) {
    try {
      response = await axios.get(url as string);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  setServerLoading(false);
  console.log("response");
  return response;
};

export { pingServer };
