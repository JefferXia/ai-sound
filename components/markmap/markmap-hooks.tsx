'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { Markmap } from 'markmap-view'
import { transformer } from './markmap'
import * as htmlToImage from 'html-to-image'
import { saveAs } from 'file-saver'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ImageDown } from 'lucide-react'

export default function MarkmapHooks({
  data
}: {
  data: any
}) {

  // Ref for SVG element
  const refSvg = useRef<any>()
  // Ref for markmap object
  const refMm = useRef<Markmap>()
  // Ref for toolbar wrapper
  // const refToolbar = useRef<HTMLDivElement>()

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current) return
    try {
      const mm = Markmap.create(refSvg.current, { duration: 100, pan: false })
      // console.log('create', refSvg.current)
      refMm.current = mm
      // renderToolbar(refMm.current, refToolbar.current);
    } catch (e) { }
  }, [refSvg.current])

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current
    if (!mm) return
    const { root } = transformer.transform(data)
    mm.setData(root)
    mm.fit()
  }, [refMm.current, data])

  // 下载
  const onSave = async () => {
    const dataUrl = await htmlToImage.toPng(refSvg.current)
    saveAs(dataUrl, 'mindmap.png')
  }

  return (
    <div
      className='w-full h-full relative dark:text-white'
    >
      <svg
        className='w-full h-full'
        ref={refSvg}
      />
      <div className='absolute right-4 bottom-4'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onSave}>
                <ImageDown size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='max-w-xs'>
              <p>下载图片</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

