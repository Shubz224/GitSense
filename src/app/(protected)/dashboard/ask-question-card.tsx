'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'

const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferances, setfilesReferances] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [answer, setAnswer] = React.useState('')

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!project?.id) return
        setLoading(true)
        setOpen(true)
        const { output, fileReferances } = await askQuestion(question, project.id)
        setfilesReferances(fileReferances)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }


        setLoading(false)



    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src='/logo.png' alt='Gitsense' width={40} height={40} />
                        </DialogTitle>
                    </DialogHeader>
                    {answer}
               {filesReferances.map(file=>{
                return <span>{file.fileName}</span>
               })}


                </DialogContent>
            </Dialog>



            <Card className='relative col-span-5'>
                <CardHeader>
                    <CardTitle>
                        Ask Question
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='which file should I edit to change the home page ?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="h-4"></div>
                        <Button type='submit'>
                            Ask Gitsense!
                        </Button>

                    </form>
                </CardContent>

            </Card>
        </>
    )
}

export default AskQuestionCard