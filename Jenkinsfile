pipeline {
    agent any

    environment {
        // Docker Hub image names (update if you want a different repo/org)
        FRONTEND_IMAGE = "electromart-backend"
        BACKEND_IMAGE  = "electromart-frontend"
        // Point to your repository (this repo) so the job clones the correct code
        GIT_REPO = "https://github.com/pamudithasandaru/electromart.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                // clone the repository (main branch)
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    echo "Building frontend image from ./frontend/Dockerfile"
                    sh "docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile ./frontend"
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    echo "Building backend image from ./backend/Dockerfile"
                    sh "docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile ./backend"
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                // expects a usernamePassword credential with id 'dockerhub'
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
        always {
            script {
                // ensure logout to avoid leaving credentials in session
                sh 'docker logout || true'
            }
        }
        success {
            echo "Pipeline finished successfully"
        }
        failure {
            echo "Pipeline failed - check logs"
        }
    }
}
