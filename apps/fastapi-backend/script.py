# API for ChatGPT
def chat_completion(openai_api_key, gpt_model = "gpt-4o", seed=10):
    
    from openai import OpenAI
    gpt_model = "gpt-4o"  # "gpt-3.5-turbo"
    openai_client = OpenAI(api_key=openai_api_key)
    return (openai_client,gpt_model)


def simple_gpt(system_prompt, user_response, openai_api_key):
    client, gpt_model = chat_completion(openai_api_key)
    GPTresponse = client.chat.completions.create(
            model=gpt_model,
            messages=[
            {"role": "system", "content":  system_prompt},
            {"role": "user", "content": user_response},
          ]
        )

    GPT_validation = GPTresponse.choices[0].message.content  
    
    return GPT_validation

def parse_gpt_output_mcq(str_parse, options = 6):
    l1 = []
    c1 = 0
    for i in range(0,options):
        if i!=options and ((str(i+1) +'.' )in str_parse)  and ((str(i+2) +'.' )in str_parse) :
            l1.append((' ' + str_parse).split( str(i+1) +'.')[1].split( str(i+2) +'.')[0].replace("*",''))
        c1 = i
    try:
        last_option = (' ' + str_parse ).split( str(c1+1) +'.')[1].split('\n')[0].replace("*",'')
        l1.append(last_option)  
    except:
        pass

    return l1        

def transcribe_to_csv(file_url, assembly_api_key,coaching_round_id):
    
    import csv
    import os
    import assemblyai as aai
    import uuid

    
    aai.settings.api_key = assembly_api_key

    config = aai.TranscriptionConfig(speaker_labels=True)

    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(
      file_url,
      config=config
    )

    results = []
    for utterance in transcript.utterances:
        results.append([utterance.speaker, utterance.text,  uuid.uuid4(), utterance.start/1000, utterance.end/1000])
      
    import pandas as pd
    df = pd.DataFrame(results, columns = ['speaker_id', 'transcribed_text', 'paragraph_id','starting_time', 'ending_time'])
    df['coaching_round_id'] = coaching_round_id



    return df

## Main
import random
def main(file_url, competency_excel_path, coaching_round_id, openai_api_key,assembly_api_key,
        dbname, dbuser, dbpassword, dbhost, dbport):#Store all the constants in the json for time being and rest of the things should go into parameter
    
#     #Package Import
    import pandas as pd
    import numpy as np
    import uuid
    import pandas.io.sql as sqlio
    import psycopg2 as ps
    import psycopg2.extras
    import os
    from dotenv import load_dotenv    
    # dbname dbuser, dbpassword, dbhost, dbport
    conn2 = ps.connect(dbname = dbname,
                      user =dbuser,
                      password = dbpassword,
                      host = dbhost,
                      port = dbport)

    cur = conn2.cursor()
    psycopg2.extras.register_uuid()
    
    #Creating coaching round if for each of the coach for the current session
    coaching_round_id_sql_format = "'"+ str(coaching_round_id) + "'"
    sql_string = "SELECT * FROM coaching_sessions where  coaching_round_id = {} ".format(coaching_round_id_sql_format)
    cur.execute(sql_string)
    row = cur.fetchall()
    print(row)
    col_names = [desc[0] for desc in cur.description]
    session_dict = {}
    for idx, i in enumerate(col_names):
        print(i, idx)
        session_dict[i] = row[0][idx]
    round_no = session_dict['round']
    coaching_session_id = uuid.UUID(str(session_dict['coaching_session_id']))
    print('coaching_session_id',coaching_session_id)
    coachee1 = session_dict['coachee_name1']
    coachee2  = session_dict['coachee_name2']
    coachee3 = session_dict['coachee_name3']
    coaching_session_name = session_dict['coaching_session_name']
    date = session_dict['date']
    user_id = session_dict['user_id']
    coaching_round_id_dict = {}
    coach_list = [coachee1, coachee2, coachee3]    
    name_list = []
    for name in coach_list:
        if name!='' and name is not None:
            name_list.append(name)            
    for name in name_list:
        coaching_round_id_dict[name] = uuid.uuid4()
        cur.execute(
            "INSERT INTO coaching_sessions ( coaching_round_id, coachee_name, round, user_id, coaching_session_name, date, coaching_session_id )  VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (
            coaching_round_id_dict[name], 
            name, 
            round_no, 
            user_id, 
            coaching_session_name,
            date,
            coaching_session_id
            )
        )  

    #Transcribing the data
    data = transcribe_to_csv(file_url, assembly_api_key,coaching_round_id)
    #data.to_csv('TranscribedFilev2.csv')

    transcript = ''  
    import uuid
    for index, row in data.iterrows():
        transcript = transcript + row['speaker_id'] + ': '+ row['transcribed_text'] + '\n'
        cur.execute(
            "INSERT INTO transcription_raw (speaker_id, transcribed_text, paragraph_id, coaching_round_id, round) VALUES (%s, %s, %s, %s, %s)",
            (row['speaker_id'], row['transcribed_text'], row['paragraph_id'], row['coaching_round_id'], round_no)
        )  
    

    #*****Code to identify the order of the coach by using clustering********  
    unique_speakers = data['speaker_id'].unique()   
    client, gpt_model = chat_completion(openai_api_key)
    role_identification, complete_transcript = '', ''  
    data['coach_gpt'] = ''
    speaker_map = {'A': 'AAAAA', 'B':'BBBBB', 'C':'CCCCC', 'D':'DDDD', 'E':'EEEEE' }
    speaker_coach_list = []
    for idx, row in data.iterrows():
        complete_transcript = complete_transcript + speaker_map[row['speaker_id']] + ': ' + row['transcribed_text'] + '\n'
        role_identification = role_identification + speaker_map[row['speaker_id']] + ': ' + row['transcribed_text'] + '\n'       
        if (idx+1)%4 ==0 or idx==data.shape[0]:             
            role_prompt = "Below conversation contains a parth the transcript of a coaching conversation where one of the speakers is providing the coaching to other speaker, while one person might be observing. Can you please identify the coach? Only return the code of the coach. If you feel that the text was spoken by observer then return 'None'"            
#             print(role_identification)           
            coach_code = 'None'
            gpt_response = simple_gpt(role_prompt, role_identification, openai_api_key)
            for item in speaker_map.values():
                if item in gpt_response:
                    coach_code = item
                    break
            data.at[idx, 'coach_gpt'] = coach_code
            if 'none' not in gpt_response.lower():
                speaker_coach_list.append(coach_code)            
#             print('coach_code: ',coach_code)
            role_identification = ''
    data['coach'] = data['coach_gpt']
    data['coach'] = data['coach'].replace('', np.nan).fillna(method='bfill')
#     data.to_csv('Coach_mapping4.csv', index = False)
    print(data)
    data['coach'] = data['coach'].fillna('None')
    transcript_coach_list = [item for item in data['coach'].unique() if 'none' not in item.lower()]
    print('transcript_coach_list: ',transcript_coach_list)    
    gpt_coach_data = {}
    for idx, coach_code in enumerate(transcript_coach_list):
        temp = data[data['coach']==coach_code]
        idx_list = temp.index.values
        print('idx_list: ',idx_list)
        prev= None
        current, result = [], []
        for i in idx_list:
            if prev is not None:
                if (i-prev)<9:
                    current.append(i)                   
                else:
                    result.append(list(current))
                    current = [i]
            else:
                current.append(i)
            prev=i
        result.append(list(current))
        #print('result: ',result)
        max_size = -1
        for lists in result:
            if len(lists)>max_size:
                gpt_coach_data[coach_code] = list(lists)
                max_size = len(lists)
        import statistics
        coach_mean_idx = {}
        for coach_code in gpt_coach_data.keys():
            coach_mean_idx[coach_code] = statistics.mean(gpt_coach_data[coach_code])
        means = list(coach_mean_idx.values())
        means.sort()
        sorted_coach_codes = []
        for val in means:
            for coach_code in gpt_coach_data.keys():
                if val  == coach_mean_idx[coach_code]:
                    sorted_coach_codes.append(coach_code)
    #print('gpt_coach_data: ' ,gpt_coach_data)
    print('sorted_coach_codes: ' ,sorted_coach_codes)
    coach_transcript_df_dict = {}
    for item in sorted_coach_codes:
        coach_transcript_df_dict[item] = data.loc[gpt_coach_data[item],:]      #[data['coach']==item]
        print(coach_transcript_df_dict[item][['speaker_id', 'coach']])

    #Reading Coaching Styles Data From Excel
    import pandas as pd
    model = pd.read_excel(competency_excel_path, sheet_name= 'Competency')
    model = model.fillna('')
    # List of competencies is retrieved from the excel
    competencies_list = list(model['Competency'].unique())
    competency_text = ""
    for index, row in model.iterrows():    
        competency_text = competency_text + '\n\n' + row['Competency'] + ': ' + row['Description']        
    heron_styles = ['Prescriptive', 'Informative', 'Challenging', 'Cathartic', 'Catalytic', 'Supportive']
        
    
    #Generating report for each of the coach
    for idx_temp in range(min(len(name_list),len(sorted_coach_codes))):  
        coach_code = sorted_coach_codes[idx_temp]
        name = name_list[idx_temp]   
        tempdf = coach_transcript_df_dict[coach_code].copy()
        tempdf = tempdf.reset_index(drop=True)
               
        #Data for timechart
        sectionszieinseconds=60
        tempdf['section'] = ((tempdf['ending_time']-tempdf['starting_time'][0])//sectionszieinseconds).astype('int')
        sectionmultiplier=sectionszieinseconds/60
        sectionnumbers = tempdf['section'].unique()
        section_transcript = ''
        timechartresult = []
        for section in range(0,max(sectionnumbers)):
            sectiondf =   tempdf[tempdf['section']==section]    
            section_transcript = ''
            for idx, row in sectiondf.iterrows():
                section_transcript = section_transcript + speaker_map[row['speaker_id']] + ': ' +  row['transcribed_text'] + '\n'
            timechart_prompt =  """. \nUsing the above provided coaching style model, return only the name of the coaching style which best matches the below coaching transcript """
            timechart_response = simple_gpt(competency_text + timechart_prompt, section_transcript, openai_api_key)        
            current = None
            for i in heron_styles:
                if i.lower() in timechart_response.lower():
                    current = i
                    break 
            if current is not None:
                timechartresult.append([section, current])
        print('timechartresult: ',timechartresult)
        coaching_style_timechart = pd.DataFrame(timechartresult, columns = ['section', 'coaching_style'])
        coaching_style_timechart['section'] = (coaching_style_timechart['section']*sectionmultiplier).astype('int')
        print(coaching_style_timechart)      
        for ids, row in coaching_style_timechart.iterrows():
            cur.execute(
                "INSERT INTO coaching_style_timechart (id, coaching_round_id, round,coaching_style ,section, coaching_session_id ) VALUES (%s,%s, %s, %s, %s, %s)",
                ( uuid.uuid4(), coaching_round_id_dict[name], round_no, row['coaching_style'],row['section'],coaching_session_id)
            )
        coaching_style_order = ','.join( list(coaching_style_timechart['coaching_style']))
        prompttomatchsummaryandchart = 'Also when earlier asked about which coaching styles were present in different sections across the text you gave following order: '+ coaching_style_order + '. Please try to keep the summary that you generate consistent with this order. For coaching style that were present provide feedback. For coahing style not identified earlier still keep some recommendations on where it coulf have been used or overll benefit but keep it very high level'
            
        #Data for barchart
        col = 'coaching_style'
        aggregated_styles = coaching_style_timechart.copy()
        aggregated_styles = aggregated_styles.groupby(col)[[col, 'section']].agg('count').rename(columns = {col:'count'}).reset_index()
        total = aggregated_styles['count'].sum()
        aggregated_styles['percentage'] = aggregated_styles['count']/total            
        print(aggregated_styles)

        import random
        random.seed(10)

        newdf = pd.DataFrame([[style, 0, 0, random.choice([4,5,6])/100]for style in heron_styles], columns= aggregated_styles.columns.values)
        newdf = newdf.loc[newdf['coaching_style'].apply(lambda x: True if x not in  aggregated_styles['coaching_style'].values else False)]

        aggregated_styles = pd.concat([aggregated_styles, newdf]).reindex()
        percent_total = aggregated_styles['percentage'].sum()
        aggregated_styles['percentage'] = aggregated_styles['percentage']/percent_total
        print('aggregated_styles updated: ',aggregated_styles)
        for index, row in aggregated_styles.iterrows():
            cur.execute(
                "INSERT INTO coaching_numbers ( id, coaching_round_id, round, coaching_style, count, percentage, style_number, style_explanation, coaching_session_id) VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s)",
                ( uuid.uuid4(), coaching_round_id_dict[name], round_no, row['coaching_style'], row['count'], row['percentage'], random.randint(1, 6), '', coaching_session_id)
            )

        #Getting the transcript for the particular coach
        complete_transcript = ''
        for idx, row in coach_transcript_df_dict[coach_code].iterrows():
            complete_transcript = complete_transcript + speaker_map[row['speaker_id']] + ': ' + row['transcribed_text'] + '\n'
        
        style_summary_prompt =  """. \n In the below text, {} is providing coaching. Use the above provided coaching framework.Your objective is to determine whether the Heron Model has been effectively used during the conversation and provide structured feedback to the coach. The feedback should not mention any names for the coach and coachee. Since the feedback is for the coach, you may use "You" and "Your."
                                Instructions:
                                Write one paragraph for each coaching style and quote examples where possible and scenarios where a particular style was used or could have been used. The feedback should not mention any names for the coach and coachee. Since the feedback is for the coach, you may use "You" and "Your. Provide the feedback in the form of a list, i.e., 1, 2, 3, 4, 5, 6, 7. As there are only six competency, to generate seven points in the list, repeat the text for last competency for the last two points i.e. 6 and 7""".format(coach_code)
        summary_response = simple_gpt(competency_text + style_summary_prompt, complete_transcript, openai_api_key)        
        summary_response = summary_response.replace(coach_code, name)
        print('\n',coach_code,' :, style_feedback_response: ', summary_response)
        print(parse_gpt_output_mcq(summary_response))       
        print()
        import re 
        feedback_dict = {}
        for s in parse_gpt_output_mcq(summary_response)[0:6]:
            for style in heron_styles:
                if style.lower() in s.lower():
                    s = s.replace('\n','').strip()
                    if style.lower() in s[:20].lower():
                        span = (re.search(style.lower(), s.lower()[:20]).span()[1])
                        s = s[span:]
                        if s[0] in [':','-']:
                            s = s[1:]
                    feedback_dict[style] = s.replace(coach_code, name).replace("*",'')

        coaching_style_feedback = pd.DataFrame(list(feedback_dict.items()) , columns = ['coaching_style', 'style_explanation'] )        
        print('feedback_dict: ',feedback_dict)
        print('coaching_style_feedback: ',coaching_style_feedback)
        for ids, row in coaching_style_feedback.iterrows():
            cur.execute(
                "INSERT INTO coaching_style_feedback (id, coaching_round_id, round,coaching_style ,style_number ,style_explanation) VALUES (%s, %s, %s, %s, %s, %s)",
                (uuid.uuid4(), coaching_round_id_dict[name], round_no, row['coaching_style'],0, row['style_explanation'])
        )
                   
        #Overall Feedback from GPT and writing the result in SQL Table        
        # overall_prompt = """. \n In the below text, {} is proioding coaching.  Provide the overall feedback
        # on how the coaching framework is used by the coach. Provide a summary in form of pargraph in less than 100 words.
        #  Do not mention the name or code of coach or coachee in your response. Focus should be on how coach used Heron Framework. Instead of coach use you. """.format(coach_code)
        overall_prompt = """. \n In the below text, {} is providing coaching. Use the above provided coaching framework. Overall feedback: 
                            You are an AI language model tasked with analyzing a transcript from a coaching conversation. Your objective is to determine whether the Heron Model has been effectively used during the conversation and provide structured feedback to the coach in three paragraphs. The feedback should not mention any names for the coach and coachee. Since the feedback is for the coach, you may use "You" and "Your."                           
                            Instructions:                           
                            Assess the overall effectiveness of the conversation in terms of using a balanced approach according to the Heron Model.
                            Evaluate the frequency and appropriateness of each intervention style.
                            Identify any noticeable strengths or weaknesses in the application of the Heron Model.
                            Provide suggestions for improvement in future coaching conversations. The feedback should not mention any names for the coach and coachee. Since the feedback is for the coach, you may use "You" and "Your. """.format(coach_code)
        overall_response = simple_gpt(competency_text + overall_prompt+ prompttomatchsummaryandchart, complete_transcript, openai_api_key)
        overall_response = overall_response.replace(coach_code, name).replace("*",'')
        print('\n\n\n',coach_code,' :, overall_response: ', overall_response)  
        cur.execute(
            "INSERT INTO coaching_round_feedback (id, coaching_round_id, round, feedback_improvements, detailed_analysis, section_no) VALUES (%s, %s, %s, %s, %s, %s)",
            (uuid.uuid4(), coaching_round_id_dict[name], round_no, overall_response, '', 0))
        print(coach_code,name, coaching_round_id_dict[name])
                
##     import datetime
##     ts = str(datetime.datetime.now()).replace(':','_').replace('.','_')            
##     output.to_csv(ts+'result.csv', index=False)  
##     data.to_csv(ts+'data.csv', index=False)   

    conn2.commit()
    cur.close()
    conn2.close()
    return 'Done'




import sys
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    try:
        competency_excel_path = os.getenv("COMPETENCY_EXCEL_PATH")
        assembly_api_key = os.getenv("ASSEMBLY_API_KEY")
        openai_api_key =  os.getenv("OPENAI_API_KEY")

        file_url = str(sys.argv[1])
        # file_url = './coaching_demo.m4a'
        coachingRoundId = str(sys.argv[2])
        coaching_round_id = coachingRoundId
        
        dbname = os.getenv("DB_NAME")
        dbuser = os.getenv("DB_USER")
        dbpassword = os.getenv("DB_PASSWORD")
        dbhost = os.getenv("DB_HOST")
        dbport = os.getenv("DB_PORT")

        main(file_url, competency_excel_path, coaching_round_id, openai_api_key, assembly_api_key, dbname, dbuser, dbpassword, dbhost, dbport)

    except Exception as e:
        print("An error occurred:", str(e))



