pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sang71315"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/electromart-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/electromart-backend"
        GIT_REPO = "https://github.com/pamudithasandaru/electromart.git"
        AWS_REGION = "us-east-1"
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
                    dir('terraform-ec2') {
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
                    dir('terraform-ec2') {
                        sh '''
                            echo "Planning Terraform deployment..."
                            terraform plan -out=tfplan -input=false
                        '''
                    }
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform-ec2') {
                        sh '''
                            echo "Applying Terraform configuration..."
                            terraform apply -auto-approve tfplan
                        '''
                    }
                }
            }
        }

        stage('Wait for EC2 Startup') {
            steps {
                echo "Waiting 60 seconds for EC2 instance to initialize..."
                sh "sleep 60"
            }
        }

        stage('Get Deployment Info') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform-ec2') {
                        sh '''
                            echo "=========================================="
                            echo "Deployment Complete!"
                            echo "=========================================="
                            echo ""
                            echo "Application URL:"
                            terraform output -raw application_url
                            echo ""
                            echo ""
                            echo "API URL:"
                            terraform output -raw api_url
                            echo ""
                            echo ""
                            echo "SSH Command:"
                            terraform output -raw ssh_command
                            echo ""
                            echo "=========================================="
                        '''
                    }
                }
            }
        }

        stage('Update EC2 Containers') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform-ec2') {
                        sh '''
                            EC2_IP=$(terraform output -raw public_ip)
                            echo "Updating containers on EC2: $EC2_IP"
                            ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/electromart-key ec2-user@$EC2_IP "cd /home/ec2-user/electromart && sudo docker-compose pull && sudo docker-compose up -d --force-recreate"
                            echo "Containers updated successfully!"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! EC2 instance deployed to AWS."
        }
        failure {
            echo "Pipeline failed - check logs"
        }
        always {
            script {
                sh "docker logout || true"
            }
            // Clean up terraform plan file
            dir('terraform-ec2') {
                sh "rm -f tfplan || true"
            }
        }
    }
}