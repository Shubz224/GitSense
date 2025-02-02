import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TabsContent } from '@radix-ui/react-tabs';
import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    fileReferances: { fileName: string; sourceCode: string; summary: string }[],

}

const CodeRefrances = ({ fileReferances }: Props) => {
    const [tab, setTab] = React.useState(fileReferances[0]?.fileName)
    if (fileReferances.length === 0) return null
    return (
        <div className='max-v-[70vw]'>
            <Tabs value={tab} onValueChange={setTab}>

                <div className="overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md">

                    {fileReferances.map(file => (
                        <button  onClick={()=>setTab(file.fileName)} key={file.fileName} className={cn(
                            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground',
                            {
                                'bg-primary text-primary-foreground': tab === file.fileName,
                            }
                        )}>
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {fileReferances.map(file => (
                    <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7x1 rounded-md'>
                        <SyntaxHighlighter language='typescript' style={nightOwl} >
                            {file.sourceCode}
                        </SyntaxHighlighter>

                    </TabsContent>
                ))}

            </Tabs>

        </div>
    )
}

export default CodeRefrances