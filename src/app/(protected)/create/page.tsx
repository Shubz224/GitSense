'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    function onSubmit(data: FormInput) {
        window.alert(JSON.stringify(data,null,2))
        return true;

    }
    return (
        <div className='flex items-centre gap-12 h-full justify-center'>

            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your Github Repository to link to GitSense
                    </p>
                </div>

                <div className='h-4'></div>

                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input  {...register('projectName', { required: true })} placeholder='Project Name'
                            required />
                           <div className="h-2"></div>
                           <Input  {...register('repoUrl', { required: true })} placeholder='Github URL'
                            required />
                           <div className="h-2"></div>
                           <Input  {...register('githubToken', { required: true })} placeholder='Github Token (Optional)'
                            required />
                            <div className="h-4"></div>
                            <Button type='submit'>
                                Create Project
                            </Button>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default CreatePage