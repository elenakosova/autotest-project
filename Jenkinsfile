pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '--user root'
        }
    }
    
    environment {
        BASE_URL_API = 'https://apichallenges.herokuapp.com'
        BASE_URL_UI = 'https://realworld.qa.guru'
    }
    
    stages {
        stage('Check System') {
            steps {
                sh '''
                    echo "=== Running in Docker container ==="
                    node --version
                    npm --version
                    pwd
                    ls -la
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/elenakosova/autotest-project.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Playwright') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run API Tests') {
            steps {
                sh 'npx playwright test --project=api --reporter=line,allure-playwright'
            }
        }
    }
    
    post {
        always {
            // Публикация Allure отчета
            allure includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            
            // Очистка
            sh 'rm -rf allure-results test-results playwright-report || true'
        }
        success {
            script {
                echo "✅ ====== API ТЕСТЫ ПРОЙДЕНЫ ====== ✅"
                echo "📊 Allure отчет: ${BUILD_URL}allure"
            }
        }
        failure {
            script {
                echo "❌ ====== ТЕСТЫ УПАЛИ ====== ❌"
                echo "🔍 Логи: ${BUILD_URL}console"
            }
        }
    }
}