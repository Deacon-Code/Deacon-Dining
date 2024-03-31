BASE_URL="http://localhost:5050"

SEARCH_KEYWORD="b"

curl -X GET "${BASE_URL}/menu/search?keyword=${SEARCH_KEYWORD}" \
  -H "Content-Type: application/json" \
  -w "\nResponse code: %{http_code}\n"