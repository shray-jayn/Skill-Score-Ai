from fastapi import FastAPI, HTTPException
import subprocess
import json
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI Backend in Turborepo"}

@app.post("/analyze")
async def analyze(data: dict):
    try:
        url = data.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="Missing 'url' in request body")

        user_data = json.dumps(data)
        print(f"Received user data: {user_data}")
        print(f"Extracted URL: {url}")

        script_dir = os.path.dirname(os.path.abspath(__file__))
        database_script = os.path.join(script_dir, "database.py")
        process_script = os.path.join(script_dir, "script.py")

        try:
            db_result = subprocess.run(["python", database_script, user_data], capture_output=True, text=True, check=True)
            coaching_round_id = db_result.stdout.strip()
            print(f"Extracted Coaching Round ID: {coaching_round_id}")
        except subprocess.CalledProcessError as e:
            print(f"Error executing database.py: {e.stderr}")
            raise HTTPException(status_code=500, detail="Error executing database script")

        try:
            process_result = subprocess.run(["python", process_script, url, coaching_round_id], capture_output=True, text=True, check=True)
            print(f"script.py output: {process_result.stdout}")
        except subprocess.CalledProcessError as e:
            print(f"Error executing script.py: {e.stderr}")
            raise HTTPException(status_code=500, detail="Error executing processing script")

        return {"success": True, "message": "Processing completed."}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
