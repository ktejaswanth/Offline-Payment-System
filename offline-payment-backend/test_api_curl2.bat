@echo off
set TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3MTkwODk4NiwiZXhwIjoxNzcxOTk1Mzg2fQ.7cko8DZSDF4htUcoRnMRWbmHEOLshOK9l64Kq0m_6gM

echo Testing Add Money WITH token... > results.txt
curl -i -X POST "http://localhost:8080/api/wallet/add?email=alice@example.com&amount=50.00" -H "Authorization: Bearer %TOKEN%" >> results.txt
echo. >> results.txt

echo Testing Balance WITH token... >> results.txt
curl -i -X GET "http://localhost:8080/api/wallet/balance?email=alice@example.com" -H "Authorization: Bearer %TOKEN%" >> results.txt
echo. >> results.txt
