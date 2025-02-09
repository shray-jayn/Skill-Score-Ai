import json
import psycopg2 as ps
import uuid
import sys
import os
from dotenv import load_dotenv

load_dotenv()


dbname = os.getenv("DB_NAME")
dbuser = os.getenv("DB_USER")
dbpassword = os.getenv("DB_PASSWORD")
dbhost = os.getenv("DB_HOST")
dbport = os.getenv("DB_PORT")

userData = json.loads(sys.argv[1])

conn = ps.connect(dbname=dbname, user=dbuser, password=dbpassword, host=dbhost, port=dbport)

try:
    coaching_round_id = str(uuid.uuid4())
    coaching_session_id = None
    team_name = userData['teamName']
    coaching_round = userData['coachingRound']

    cur = conn.cursor() 

    if coaching_round == '2':
        check_query = """
            SELECT coaching_session_id FROM coaching_sessions WHERE coaching_session_name = %s
        """
        cur.execute(check_query, (team_name,))
        result = cur.fetchone()
        
        if result:
            coaching_session_id = result[0]
        else:
            coaching_session_id = str(uuid.uuid4())
    else:
        coaching_session_id = str(uuid.uuid4())

    sql_query = """
        INSERT INTO coaching_sessions (coaching_round_id, coaching_session_id, coaching_session_name, coachee_name1, coachee_name2, coachee_name3, date, round, user_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(sql_query, (coaching_round_id, coaching_session_id, userData['teamName'], userData['coacheeName1'], userData['coacheeName2'], userData['coacheeName3'], userData['formattedDate'], userData['coachingRound'], userData['userId']))

    conn.commit()

    cur.close()
    conn.close()

    print(coaching_round_id)

except ps.DatabaseError as e:
    print("Database Error:", e)
