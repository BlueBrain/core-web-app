"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { SingleGallery } from "@/constants/explore-section/gallery-content"
import { classNames } from "@/util/utils"

export default function Card({
  content
}:{content: SingleGallery}) {

  const [mouseStatus, setMouseStatus] = useState<boolean>(false)

  return (
    <Link
      href={ `/explore/gallery/${content.slug.current}` }
      className={classNames(
        "relative flex flex-col p-3 rounded-md transition-background duration-500 ease-linear",
        mouseStatus ? "bg-primary-7" : "bg-primary-8"
      )}
      onMouseOver={() => setMouseStatus(true)}
      onFocus={() => setMouseStatus(true)}
      onMouseOut={() => setMouseStatus(false)}
      onBlur={() => setMouseStatus(false)}
      >
        <div className={classNames(
          "block w-full shadow-strongImage rounded-sm overflow-hidden origin-center transition-transform duration-500 ease-in-out",
          mouseStatus ? "scale-100" : "scale-95"

        )}>
          <Image
            src={content.imageCover}
            alt={content.title}
            width={400}
            height={400}
            className={
              classNames(
                "w-full h-auto transform-filter",
                mouseStatus ? "brightness-100" : "brightness-90"
              )
            }
            />
        </div>
        <div className="w-full p-2 flex flex-col">
          <h2 className="text-white text-2xl font-bold mt-5">{content.title}</h2>

          <aside className="flex flex-row items-center gap-x-2 p-1 my-2 border border-primary-6 border-solid">
            <div className="flex flex-row text-primary-2 text-xs font-normal">
              127 images
            </div> 
            <div className="w-px h-3 block bg-primary-6" />
            <div className="flex flex-row text-primary-2 text-xs font-normal">
              32 videos
            </div> 
          </aside>

          <p className="text-primary-3 font-normal leading-normal">
            {content.description}
          </p>
        </div>
    </Link>
  )
}