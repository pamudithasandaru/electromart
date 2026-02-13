pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sang71315"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/electromart-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/electromart-backend"
        GIT_REPO = "https://github.com/pamudithasandaru/electromart.git"
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
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed - check logs"
        }
        always {
            script {
                sh "docker logout"
            }
        }
    }
}