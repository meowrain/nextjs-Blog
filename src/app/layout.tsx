import './globals.css'
import type {Metadata} from 'next'
import NavBar from "@/app/components/NavBar";
import MyProfilePic from "@/app/components/MyProfilePic";
export const metadata: Metadata = {
    title: "MeowRain's Blog",
    description: 'Created by meowrain',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">

        <body className="dark:bg-slate-800">
        <NavBar />
        <MyProfilePic />
        {children}
        </body>

        </html>
    )
}
