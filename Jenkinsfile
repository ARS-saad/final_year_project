pipeline {
    agent {
        node {
            label "node"
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-user-pass')
        GITHUB_TOKEN          = credentials('github-token')

        IMAGE_NAME            = "890iop/travel_agency"
        IMAGE_TAG             = "latest"
    }

    stages {
//        stage('build') {
//            steps {
//                sh 'npm ci'
//                sh 'npm run build'
//            }
//        }

        stage('docker login and push image to docker hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('deploy to k8s') {
            steps {
                script {
                    sh './k8s/deploy.sh'
                    sh 'kubectl rollout restart deployment.apps/travel_agency-deployment'
                }
            }
        }
    }

    post {
        always {
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}
