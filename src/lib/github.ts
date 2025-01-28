
import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios'
import { aiSummariseCommit } from './gemini';


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});



type Response = {
    commitHash: string
    commitMessage: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string

}

const githubUrl = 'https://github.com/docker/genai-stack'


//getting commithashes from github url // wroks perfctly fine

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)

    if (!owner || !repo) {
        throw new Error("Invalid github")
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
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author.date ?? ""
    }))


}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnproccessedCommits(projectId, commitHashes);
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit=>{
        return summariseCommit(githubUrl,commit.commitHash)
    }))
     
    const summaries = summaryResponses.map((response)=>{
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
        
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary,index)=>{
            console.log(`processing commit ${index}/`)
            return{
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary

            }
        })
    })
    return commits

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function summariseCommit(githubUrl: string, commitHash: string) {
    // get the diff,tthen diff into ai

    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff',

        }

    })

    return await aiSummariseCommit(data) || ""




}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { githubUrl: true },
    })


    if (!project?.githubUrl) {
        throw new Error("Project does not have a GitHub URL")
    }



    return { project, githubUrl: project?.githubUrl }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function filterUnproccessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))

    return unprocessedCommits
}









pollCommits('cm6b2bzit0000voistrwepbj5').then(console.log)





































































/* export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pollCommits = async (projectId: string) => {
    try {
        const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
        const commitHashes = await getCommitHashes(githubUrl);
        const unprocessedCommits = await filterUnproccessedCommits(projectId, commitHashes);

        const summaryResponses = await Promise.allSettled(
            unprocessedCommits.map((commit) => summariseCommit(githubUrl, commit.commitHash))
        );

        const summaries = summaryResponses.map((response) => {
            if (response.status === 'fulfilled') {
                return response.value as string;
            }
            console.error('Error summarizing commit:', response.reason);
            return "";
        });

        const commits = await db.commit.createMany({
            data: summaries.map((summary, index) => ({
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary,
            })),
        });

        return commits;
    } catch (error) {
        console.error('Error in pollCommits:', error);
        throw new Error('Failed to poll commits');
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function summariseCommit(githubUrl: string, commitHash: string) {
    try {
        const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
            headers: {
                Accept: 'application/vnd.github.v3.diff',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
            timeout: 20000, // Set a timeout of 10 seconds
        });
        return await aiSummariseCommit(data) || "";
    } catch (error) {
        console.error('Error fetching commit diff:', error);
        throw new Error('Failed to fetch commit diff');
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { githubUrl: true },
    });

    if (!project?.githubUrl) {
        throw new Error("Project does not have a GitHub URL");
    }

    if (!project.githubUrl.startsWith('https://github.com/')) {
        throw new Error("Invalid GitHub URL");
    }

    return {
        project,
        githubUrl: project.githubUrl,
    };
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function filterUnproccessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommits) => processedCommits.commitHash === commit.commitHash))
    return unprocessedCommits
}

await pollCommits('cm6b2bzit0000voistrwepbj5').then(console.log) */
