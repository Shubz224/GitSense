
import { db } from '@/server/db';
import { Octokit } from 'octokit';

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const githubUrl = 'https://github.com/docker/genai-stack';


type Response = {
    commitHash: String
    commitMessage: String
    commitAuthorName: String
    commitAuthorAvatar: String
    commitDate: String

}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
     
    if (!owner || !repo) {
        throw new Error("Invalid github url")
    }


   

    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })


    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.slice(0, 15).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit?.author.date ?? ""
    }))

}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnproccessedCommits(projectId, commitHashes)
    console.log(unprocessedCommits)
    return unprocessedCommits

}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })

    if (!project?.githubUrl) {
        throw new Error("Project does not have a github url")
    }



    return {
        project,
        githubUrl: project?.githubUrl
    }
}




async function filterUnproccessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommits) => processedCommits.commitHash === commit.commitHash))
    return unprocessedCommits
}

await pollCommits('cm6b2bzit0000voistrwepbj5').then(console.log)
