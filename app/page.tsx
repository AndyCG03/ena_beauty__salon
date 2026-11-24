import {readFile} from 'node:fs/promises';
import path from 'node:path';
// Trusted, versioned salon markup rendered at build time. No client-side HTML fetch.
export default async function Home() {
 const content=await readFile(path.join(process.cwd(),'app/content.html'),'utf8');
 return <div dangerouslySetInnerHTML={{__html:content}} />;
}
