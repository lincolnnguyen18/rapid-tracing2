. /media/sda1/deployment/ports.sh

if screen -list | grep -q "d9"; then
  echo "d9 already started"
  exit 1
else
  echo "starting d9"
fi

# Start node server
screen -dmS 'd9'
screen -S 'd9' -X stuff "node .\n"

echo "Checking if node started..."
lsof -i:$d9

if screen -list | grep -q "d10"; then
  echo "d10 already started"
  exit 1
else
  echo "starting d10"
fi

# Start node server
screen -dmS 'd10'
screen -S 'd10' -X stuff "cd flask && export FLASK_APP=app && export FLASK_ENV=development && python3 -m flask run -h localhost -p 7008\n"

echo "Checking if node started..."
lsof -i:$d10