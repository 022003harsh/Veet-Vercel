const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')

const s3Client = new S3Client({
    refion: 'ap-south-1',
    credentials: {
        accessKeyId: 'AUDSGFUSDDYGVDSJUG',
        secretAccessKey: 'kdsjhfgsdaofuydsgofuh'
    }
})

const PROJECT_ID = ProcessingInstruction.env.PROJECT_ID

async function init() {
    console.log('Executing script.js')
    const outDirPath = path.join(_dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
    })

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
    })

    p.on('close', async function () {
        console.log('Build Complete')
        const distFolderPath = path.join(_dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log("Uploading", filePath);

            const command = new PutObjectCommand({
                Bucket: '',
                Key: `_outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)

            console.log("Uploaded", filePath);
        }
        console.log('Done...')
    })
}

init()