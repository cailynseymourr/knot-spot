# Knot Spot
 
A crochet companion website. Save your patterns, keep track of your yarn stash, log your progress on each project, and get two AI-powered tools: a yarn recommender that picks the best yarn from your stash for a pattern, and a time predictor that estimates when you'll finish a project.
 
Built by Cailyn Seymour as a solo seminar project at the University of Oregon.
 
## Features
 
- **Patterns:** write a pattern row by row, or upload one as a PDF or image. Add a category, yarn details, and a YouTube tutorial link (it plays right on the pattern page). View, edit, and delete patterns.
- **Yarn stash:** add yarn with its brand, color, weight, yardage, and an optional photo.
- **Progress tracker:** log each work session (date, rows, stitches, and a note). Each pattern shows a progress ring and a log history, and the Progress Tracker page lists every project you've started.
- **AI Insights, yarn recommender:** ranks the yarn in your stash for a pattern and explains each pick, including warnings like "short by 120 yd".
- **AI Insights, time predictor:** estimates a finish date from your progress logs.
## Tech stack
 
| Part | Tools |
|---|---|
| Frontend | React (Create React App), React Router |
| Database and storage | Firebase (Cloud Firestore, Firebase Storage) |
| AI backend | Python, Flask, Flask-CORS, scikit-learn |
 
## Project structure
 
```
knot-spot/
├── public/
│   └── images/              hero photo for the Home page
├── src/
│   ├── components/          Navbar, ConfirmDialog, YarnBall, YarnWeightSelect, AddPatternMenu
│   ├── pages/               Home, Patterns, CreatePattern, UploadPattern, ViewPattern,
│   │                        YarnStash, ProgressTracker, AIInsights
│   ├── services/            Firebase code: firebase.js, patternsService.js,
│   │                        yarnService.js, progressService.js
│   ├── App.js               routes
│   └── index.css            colors, fonts, and shared styles
└── backend/
    ├── app.py               Flask server and endpoints
    ├── recommender.py       yarn recommender
    ├── test_predict.py      tests for the time predictor
    └── test_recommend.py    tests for the yarn recommender
```
 
## Running it locally
 
You need Node.js, Python 3, and a free [Firebase](https://console.firebase.google.com) project.
 
### 1. Set up Firebase
 
1. In the Firebase console, create a project and add a **Web app**.
2. Under **Databases & Storage**, create a **Firestore** database (test mode is fine for local development).
3. Create a file named `.env` in the project root and fill in your project's values:
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```
 
   Don't commit this file. Make sure `.env` is listed in `.gitignore`.
 
### 2. Start the website
 
```
npm install
npm start
```
 
The site opens at http://localhost:3000. Restart `npm start` any time you change `.env`.
 
### 3. Start the AI server
 
In a second terminal:
 
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors scikit-learn
python app.py
```
 
On macOS or Linux, activate the environment with `source venv/bin/activate` instead. The server runs at http://localhost:5000, and http://localhost:5000/health should show `{"status":"ok"}`.
 
The AI Insights page needs this server running. The rest of the site works without it. To use a different address, set `REACT_APP_API_URL` in `.env`.
 
## How the AI features work
 
### Yarn recommender
 
Each yarn in your stash gets a score out of 100 for the pattern:
 
- **Weight (up to 50):** an exact match scores 50. One weight off scores 20 with a "swatch first" warning. Anything further off is left out.
- **Yardage (up to 40):** enough yardage scores 30, plus a bonus if there isn't much left over. If you're short, the score scales down and the result shows how many yards you're missing.
- **Name (10):** a bonus if the yarn matches the one the pattern calls for.
The top three are returned with the reasons and warnings behind each score. It's a transparent scoring function instead of a trained model, which makes every recommendation explainable.
 
### Time predictor
 
1. Rows logged on each date are added up into a running total.
2. With three or more data points, a scikit-learn linear regression fits rows done against days and uses the slope as your pace. With fewer, it uses your average rows per day.
3. If you haven't logged recently, today counts as a data point, so a slowdown lowers the estimate.
4. The finish date comes from the rows left divided by your pace. Confidence is low, medium, or high depending on how many different days you've logged.
### API
 
| Endpoint | Purpose |
|---|---|
| `GET /health` | Check that the server is running |
| `POST /recommend-yarn` | Body: `{ pattern, yarns }`. Returns ranked yarn picks |
| `POST /predict-time` | Body: `{ totalRows, logs }`. Returns an estimated finish date |
 
## Data
 
Data lives in three Firestore collections:
 
- `patterns`: name, description, category, YouTube link, yarn used, yarn weight, yardage needed, rows, total rows, and an optional file link
- `yarns`: name, brand, color, weight, yardage, and an optional photo (resized in the browser and stored with the yarn)
- `progressLogs`: pattern id, date, rows done, stitches, and a note
## Tests
 
```
npm test                      # React: renders the Home page
cd backend
python test_predict.py        # time predictor, including edge cases
python test_recommend.py      # yarn recommender, including edge cases
```
 
## Known limitations and next steps
 
- **No accounts yet.** Everyone shares one set of data, and the Firestore database is in test mode, so its rules need tightening before real use.
- **Pattern file uploads use Firebase Storage,** which may need to be enabled on your Firebase plan. If an upload fails, the pattern is still saved without the file.
- **The recommender doesn't consider fiber** and relies on the weight and yardage you enter.
- **The time predictor needs a total row count** and at least one log. Estimates get better with more logged sessions.
- **Flask runs its development server,** which is fine locally but not for hosting.
- Next steps: user accounts, auto-filling yarn details from the yarn name, and deploying the site and the AI server.
## Credits
 
- Hero photo: my own.
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) from Google Fonts.