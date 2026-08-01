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
        stage('Checkout Source Code') {
            steps {
                // Safely handles checkout and wipes old broken repository metadata if needed
                checkout scmGit(
                    userRemoteConfigs: [[url: 'https://github.com/ARS-saad/final_year_project.git', credentialsId: 'github-token']],
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'CleanBeforeCheckout']]
                )
            }
        }

        stage('Docker Build & Push') {
            steps {
                // Securely log into Docker without leaking passwords in stdout/process trees
                sh 'echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'chmod +x ./k8s/deploy.sh'
                sh './k8s/deploy.sh'
                sh 'kubectl rollout restart deployment.apps/travel-agency-deployment'
            }
        }
    }

    post {
        always {
            // Clean up Docker images to save disk space on the agent
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker logout || true"
        }
        success {
            echo "Pipeline built and deployed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
