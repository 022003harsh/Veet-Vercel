const express = require("express");
const generateSlug = require('random-word-slug')
const {ECSClient, RunTaskCommand} = require("@aws-sdk/client-ecs");

const app = express();
const port = process.env.PORT || 9000;

const ecsClient = new ECSClient({
    credentials:{
        accessKeyId: 'DSKHFGVERIFHG',
        secretAccessKey: 'jshdblskdjhvbldf'
    }
})

const config = {
    CLUSTER: 'jhvbfedkhvbefhberfo',
    TASK: 'awsdksjhfbdskuhfb'
}

app.use(express.json());
app.post('/project', async (req, res) => {
    const {gitURL} = req.body;
    const projectSlug = generateSlug();
    //spin the ECS container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefination: config.TASK,
        launchType:'FARGATE',
        COUNT: 1,
        networkConfiguration:{
            awsvpConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets:['subnet-327fg38u4t6','subnet-327fg38u4t6','subnet-327fg38u4t6'],
                securityGroups: ['sg-392074553259876']
            }
        },
        overrides: {
            containerOverrides:[
                {
                    name: 'builder-image',
                    environment: [
                        {
                            name: 'GIT_REPOSITORY_URL',
                            value: gitURL
                        },
                        {
                            name: 'PROJECT_ID',
                            value: projectSlug
                        }
                    ]
                }
            ]
        }
    })


    await ecsClient.send(command);
    return res.json({status: 'queued', data:{projectSlug, url: `http://${projectSlug}.localhost:8000`}})

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});