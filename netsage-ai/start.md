### Terminal 1 : Backend

run inside netsage-ai : `cd backend`  
 Now Activate Virtual Environment :-  
 A. For mac - Run :  
1.`python3 -m venv .venv`  
 2.`source .venv/bin/activate`  

 B. Install all the dependencies :
`pip install -r requirements.txt`  
 C. Start the backend server :
`python -m uvicorn backend.main:app --reload`

---

### Terminal 2 : Frontend

A. Run inside netsage-ai : `cd frontend`  
B. Install the dependencies : `npm install`  
3. Start the dev server : `npm run dev`
