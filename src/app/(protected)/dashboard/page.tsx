'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import React from 'react'

const DashboardPage = () => {
  const {project}=useProject()
    const {user} = useUser()
  return (
    <div>{project?.name}</div>
  )
}

export default DashboardPage;