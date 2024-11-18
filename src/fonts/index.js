import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["700", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--poppin-font",
});
