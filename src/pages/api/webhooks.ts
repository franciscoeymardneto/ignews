import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'

async function buffer(readble: Readable) {
    const chunks = []

    for await (const chunck of readble) {
        chunks.push(
            typeof chunck === 'string' ? Buffer.from(chunck) : chunck
        )
    }

    return Buffer.concat(chunks)
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const buf = await buffer(req)

    res.status(200).json({ ok: true})
    
}