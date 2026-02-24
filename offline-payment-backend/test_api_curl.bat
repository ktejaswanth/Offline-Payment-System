@echo off
echo Testing Register... > results.txt
curl -s -X POST "http://localhost:8080/api/auth/register" -H "Content-Type: application/json" -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"p123\"}" >> results.txt
echo. >> results.txt
echo. >> results.txt

echo Testing Login... >> results.txt
curl -s -X POST "http://localhost:8080/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\",\"password\":\"p123\"}" >> results.txt
echo. >> results.txt
echo. >> results.txt

echo Testing Add Money without token (Should fail)... >> results.txt
curl -s -X POST "http://localhost:8080/api/wallet/add?email=alice@example.com&amount=50.00" >> results.txt
echo. >> results.txt
echo. >> results.txt
