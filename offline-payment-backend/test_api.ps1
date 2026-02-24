$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080"
$token = ""

Write-Host "================================="
Write-Host "1. Testing Register Endpoint"
Write-Host "================================="
$registerBody = @{
    name     = "Test User"
    email    = "test4@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Register Success."
    $token = $registerResponse.token
}
catch {
    Write-Host "Failed to register (maybe already exists)."
}

if (-not $token) {
    Write-Host "`n================================="
    Write-Host "2. Testing Login Endpoint"
    Write-Host "================================="
    $loginBody = @{
        email    = "test4@example.com"
        password = "password123"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        Write-Host "Login Success."
        $token = $loginResponse.token
    }
    catch {
        Write-Host "Failed to login: $_"
        exit
    }
}

Write-Host "Acquired Token: $token"

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "`n================================="
Write-Host "3. Testing Add Money Endpoint"
Write-Host "================================="
try {
    $addMoneyResponse = Invoke-RestMethod -Uri "$baseUrl/api/wallet/add?email=test4@example.com&amount=50.00" -Method Post -Headers $headers
    Write-Host "Add Money Response: $addMoneyResponse"
}
catch {
    Write-Host "Failed to add money: $_"
}

Write-Host "`n================================="
Write-Host "4. Testing Get Balance Endpoint"
Write-Host "================================="
try {
    $getBalanceResponse = Invoke-RestMethod -Uri "$baseUrl/api/wallet/balance?email=test4@example.com" -Method Get -Headers $headers
    Write-Host "Get Balance Response: $getBalanceResponse"
}
catch {
    Write-Host "Failed to get balance: $_"
}
