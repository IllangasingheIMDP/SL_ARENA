import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";




export const metadata = {
  title: "Slarena Admin",
  description: "Slarena Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
