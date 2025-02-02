'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react';
import React from 'react'
import AskQuestionCard from '../dashboard/ask-question-card';
import MDEditor from '@uiw/react-md-editor';
import CodeRefrances from '../dashboard/code-references';

const QApage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestion.useQuery({ projectId })
  const [questionIndex, setQuestionIndex] = React.useState(0)

  const question = questions?.[questionIndex]


  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h4"></div>
      <h1 className='text-xl font-semibold'>Saved Question</h1>
      <div className="h2"></div>
      <div className="flex flex-col gap-2">
        {
          questions?.map((question, index) => {
            return <React.Fragment key={question.id}>
              <SheetTrigger onClick={() => setQuestionIndex(index)}>
                <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                  <img className='rounded-full' height={30} width={30} src={question.user.imageUrl ?? ""} />
                  <div className='text-left flex flex-col'>
                    <div className="flex items-center gap-2 ">
                      <p className='text-gray-700 line-clamp-1 text-lg font-medium'>
                        {question.question}

                      </p>
                      <span className='text-xs text-gray-400 whitespace-nowrap'>
                        {question.createdAt.toLocaleDateString()}

                      </span>

                    </div>
                    <p className='text-gray-500 line-clamp-1 text-sm'>
                      {question.answer}
                    </p>

                  </div>
                </div>


                {question && (
                  <SheetContent className='sm:max-w-[80vh]'>
                    <SheetHeader>
                      <SheetTitle>
                        {question.question}
                      </SheetTitle>
                      <MDEditor.Markdown source={question.answer} />
                      <CodeRefrances fileReferances={(question.filesReferences ?? []) as any }/>
                    </SheetHeader>
                  </SheetContent>

                )}
              </SheetTrigger>
            </React.Fragment>
          })
        }
      </div>
    </Sheet>
  )
}

export default QApage