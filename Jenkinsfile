pipeline {
    agent {
        node {
            label "node"
        }
    }

    environment {
        // AWS EKS Cluster details
        AWS_REGION                    = 'us-east-1'
        EKS_CLUSTER_NAME              = 'devopssteps-eks-1'

        // Docker Credentials & Image details
        DOCKERHUB_CREDENTIALS         = credentials('dockerhub-user-pass')
        GITHUB_TOKEN                  = credentials('github-token')
        IMAGE_NAME                    = "890iop/travel_agency"
        IMAGE_TAG                     = "${BUILD_NUMBER}" // Use build number instead of static 'latest'

        // Base Supabase URL
        NEXT_PUBLIC_SUPABASE_URL      = 'http://44.218.130.6:8000'

        // Sensitive Credentials
        OPENROUTER_API_KEY            = credentials('OPENROUTER_API_KEY')
        NEXT_PUBLIC_SUPABASE_ANON_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    stages {
        stage('Fetch or Provision Load Balancer IP') {
            steps {
                script {
                    sh '''
                        # Connect to AWS EKS
                        aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}

                        # Apply service manifest to ensure LoadBalancer exists
                        kubectl apply -f k8s/04-service.yaml

                        echo "Waiting for LoadBalancer external IP/hostname..."
                        EXTERNAL_IP=""
                        for i in {1..30}; do
                            EXTERNAL_IP=$(kubectl get svc travel-agency-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
                            if [ -z "$EXTERNAL_IP" ]; then
                                EXTERNAL_IP=$(kubectl get svc travel-agency-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                            fi

                            if [ -n "$EXTERNAL_IP" ]; then
                                break
                            fi
                            sleep 5
                        done

                        if [ -z "$EXTERNAL_IP" ]; then
                            echo "Error: Timed out waiting for LoadBalancer IP"
                            exit 1
                        fi

                        # Set environment variable for subsequent stages
                        echo "http://${EXTERNAL_IP}:3000" > site_url.txt
                        echo "Resolved SITE_URL: http://${EXTERNAL_IP}:3000"
                    '''
                    // Read external URL into pipeline environment variable
                    env.NEXT_PUBLIC_SITE_URL = readFile('site_url.txt').trim()
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                // Pass NEXT_PUBLIC_ variables as build arguments so Next.js bakes them in
                sh """
                    docker build \\
                      --build-arg NEXT_PUBLIC_SITE_URL="${env.NEXT_PUBLIC_SITE_URL}" \\
                      --build-arg NEXT_PUBLIC_SUPABASE_URL="${env.NEXT_PUBLIC_SUPABASE_URL}" \\
                      --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}" \\
                      -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Deploy Application to K8s') {
            steps {
                script {
                    sh '''
                        # Substitute variables & apply remaining k8s manifests
                        envsubst < k8s/configmap.yaml | kubectl apply -f -
                        envsubst < k8s/secret.yaml | kubectl apply -f -
                        envsubst < k8s/deployment.yaml | kubectl apply -f -

                        # Restart rollout to ensure pods pull the new tag
                        kubectl rollout restart deployment.apps/travel-agency-deployment
                    '''
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker images to save disk space on the agent
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            cleanWs()
        }
    }
}
