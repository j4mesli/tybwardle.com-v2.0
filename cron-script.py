import json
import random
from github import Github

with open('today.json', 'r', encoding="utf8") as obj:
    newChar = json.load(obj)

with open('characters.json', 'r', encoding="utf8") as chars:
    characters = json.load(chars)

output = characters[random.randint(0, len(characters) - 1)]
while output == newChar:
    output = characters[random.randint(0, len(characters) - 1)]

with open('today.json', 'w', encoding='utf8') as today:
    json.dump(output, today, ensure_ascii=False)

# GitHub
with open('tybwkeys.txt','r') as key:
    githubKey = key.read()
g = Github(githubKey)
repo = g.get_user().get_repo("tybwardle.com-v2.0-PRODUCTION")
today = repo.get_contents('backend/json/today.json')
output_json = json.dumps(output, ensure_ascii=False)
# update json
repo.update_file(today.path, "Automatic update to today.json time span via GitHub API", output_json, today.sha, branch="main")
