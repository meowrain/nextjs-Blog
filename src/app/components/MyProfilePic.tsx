import Image from "next/image"
import {ReactElement} from "react";

export default function MyProfilePic(): ReactElement {
    return (
        <section className="w-full mx-auto">
            <Image className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8" src="/images/107172084 - 副本.jpg" width={200} height={200} alt="Meowrain" priority={true}/>
        </section>
    )
}