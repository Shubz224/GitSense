import { GoogleGenerativeAI } from '@google/generative-ai'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
})


export const summariseCommit = async (diff: string) => {
    //htps://github.com/docker/genai-stack/commit/1a2b3c4d5e6f7g8h9i0j.diff

    const response = await model.generateContent([

        `You are an expert programmer, and you are trying to summarize a git diff.
        Reminders about the git diff format:
        For every file, there are a few metadata lines, like (for example):
        \`\`\`
        diff --git a/lib/index.js b/lib/index.js
        index aadf691..bfef603 100644
        -- a/lib/index. js 
        +++ b/lib/index. js
        \`\`\`
        This means that \'lib/index.jsl was modified in this commit. Note that this is only an example.
        Then there is a specifier of the lines that were modified.
        A line starting with \+\ means it was added.
        A line that starting with \'-\' means that line was deleted.
        A line that starts with neither '+' nor l'- is code given for context and better understanding.
        [...]
        EXAMPLE SUMMARY COMMENTS:
        \`\`\`
        *Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
        * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
        * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
        * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
         *Lowered numeric tolerance for test files
        \`\`\`
        Most commits will have less comments than this examples list.
        The last comment does not include the file names,
        because there were more than two relevant files in the hypothetical commit.
        Do not include parts of example in your summary.
        It is given only as an exammple of appropriate comments.`,
        `Please summarize the following diff file : \n\n${diff}`,



    ]);

    return response.response.text();

} 

console.log(await summariseCommit(`
    diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index a9b565a..19d8101 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -8,29 +8,30 @@ datasource db {
 }
 
 model User {
-  id            String          @id @default(cuid())
-  createdAt     DateTime        @default(now())
-  updatedAt     DateTime        @updatedAt
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
 
-  imageUrl      String?
-  firstName     String?
-  lastName      String?
+  imageUrl  String?
+  firstName String?
+  lastName  String?
 
-  emailAddress  String          @unique
-  credits       Int             @default(150)
+  emailAddress String @unique
+  credits      Int    @default(150)
 
-  UserToProjects  UserToProject[]
+  UserToProjects UserToProject[]
 }
 
 model Project {
-  id            String          @id @default(cuid())
-  createdAt     DateTime        @default(now())
-  updatedAt     DateTime        @updatedAt
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
 
-  name          String
-  githubUrl     String
-  deletedAt     DateTime?
+  name           String
+  githubUrl      String
+  deletedAt      DateTime?
   UserToProjects UserToProject[]
+  commits        Commit[]
 }
 
 model UserToProject {
@@ -41,9 +42,25 @@ model UserToProject {
   userId    String
   projectId String
 
-  user      User     @relation(fields: [userId], references: [id])
-  project   Project  @relation(fields: [projectId], references: [id])
-  
+  user    User    @relation(fields: [userId], references: [id])
+  project Project @relation(fields: [projectId], references: [id])
 
   @@unique([userId, projectId])
 }
+
+model Commit {
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  projectId String
+  project   Project @relation(fields: [projectId], references: [id])
+
+  commitMessage      String
+  commitHash         String
+  commitAuthorName   String
+  commitAuthorAvatar String
+  commitDate         DateTime
+  //ai summary
+  summary            String
+}`))