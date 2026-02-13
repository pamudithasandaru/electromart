pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sang71315"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/electromart-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/electromart-backend"
        GIT_REPO = "https://github.com/pamudithasandaru/electromart.git"
        AWS_REGION = "us-east-1"
        TF_VAR_mongodb_password = credentials('mongodb-password')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    echo "Building frontend image: ${FRONTEND_IMAGE}:latest"
                    sh "docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend"
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    echo "Building backend image: ${BACKEND_IMAGE}:latest"
                    sh "docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend"
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    echo "Pushing images to Docker Hub"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                }
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform') {
                        sh '''
                            echo "Initializing Terraform..."
                            terraform init -input=false
                        '''
                    }
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform') {
                        sh '''
                            echo "Planning Terraform deployment..."
                            terraform plan -out=tfplan -input=false \
                                -var="backend_image=${BACKEND_IMAGE}:latest" \
                                -var="frontend_image=${FRONTEND_IMAGE}:latest" \
                                -var="aws_region=${AWS_REGION}"
                        '''
                    }
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform') {
                        sh '''
                            echo "Applying Terraform configuration..."
                            terraform apply -auto-approve tfplan
                        '''
                    }
                }
            }
        }

        stage('Get Deployment Info') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform') {
                        sh '''
                            echo "=========================================="
                            echo "Deployment Complete!"
                            echo "=========================================="
                            echo "Application URL:"
                            terraform output -raw application_url || true
                            echo ""
                            echo "=========================================="
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! Application deployed to AWS."
        }
        failure {
            echo "Pipeline failed - check logs"
        }
        always {
            script {
                sh "docker logout || true"
            }
            // Clean up terraform plan file
            dir('terraform') {
                sh "rm -f tfplan || true"
            }
        }
    }
}