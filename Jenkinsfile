pipeline {
    agent any
    
    environment {
        BASE_URL_API = 'https://apichallenges.herokuapp.com'
        BASE_URL_UI = 'https://realworld.qa.guru'
    }
    
    stages {
        stage('Check Node.js') {
            steps {
                sh '''
                    echo "Checking Node.js installation..."
                    node --version || echo "Node.js not found in system"
                    npm --version || echo "npm not found in system"
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
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install'
            }
        }
        
        stage('Run API Tests') {
            steps {
                sh 'npx playwright test --project=api --reporter=line,allure-playwright'
            }
        }
        
        stage('Run UI Tests') {
            steps {
                sh 'npx playwright test --project=ui --reporter=line,allure-playwright'
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
            sh 'rm -rf allure-results test-results playwright-report'
        }
        success {
            echo '✅ Все тесты прошли успешно!'
        }
        failure {
            echo '❌ Часть тестов упала!'
        }
    }
}