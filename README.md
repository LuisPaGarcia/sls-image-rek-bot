# Serverless Image recognition Bot 🤖

## Using mongodb provided by MLab and Serverless framework with Node.js

1. Create an instance of mongodb. (MLab gives you a free instance here: https://mlab.com)
2. Get your twitter credentials. (Here: https://developer.twitter.com/)
3. You need an IAM user with permision to allow to make actions.

```YAML
#...

iamRoleStatements:
    - Effect: Allow
      Action:
        - rekognition:DetectLabels
      Resource: "*" 

#...
```

2. Deploy.

```shell
$ sls deploy
```