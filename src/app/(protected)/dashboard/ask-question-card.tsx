'use client'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import CodeRefrances from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'sonner'

const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setfilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setfilesReferences([])
        e.preventDefault()
        if (!project?.id) return
        setLoading(true)

        const { output, fileReferances } = await askQuestion(question, project.id)
        setOpen(true)
        setfilesReferences(fileReferances)

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
                <DialogContent className='sm:max-w-[90vw]'>
                    <DialogHeader>

                        <div className="flex items-center gap-2">

                            <DialogTitle>
                                <Image src='/logo.png' alt='Gitsense' width={40} height={40} />
                            </DialogTitle>
                            <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => {
                                saveAnswer.mutate({
                                    projectId: project!.id,
                                    question,
                                    answer,
                                    filesReferences
                                }, {
                                    onSuccess: () => {
                                        toast.success('Answer saved!')
                                    },
                                    onError: () => {
                                        toast.error('Failed to save answer!')
                                    }

                                })
                            }}>
                                Save Answer
                            </Button>

                        </div>









                    </DialogHeader>

                    <MDEditor.Markdown source={answer} className='max-w-[90vw] !h-full max-h-[40vh] overflow-scroll' />
                    <div className="h-4"></div>

                    <CodeRefrances fileReferances={filesReferences} />

                    <Button type='button' onClick={() => { setOpen(false) }}> Close</Button>





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
                        <Button type='submit' disabled={loading}>
                            Ask Gitsense!
                        </Button>

                    </form>
                </CardContent>

            </Card>
        </>
    )
}

export default AskQuestionCard