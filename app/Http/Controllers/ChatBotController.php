<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChatBotController extends Controller
{
    public function index(Request $request)
    {
        $message = $request->input('message');
        if (!$message || $message === '') return response()->json(['answer' => 'Kidding me? Please submit valid message.']);

        $apiKey = env('OPENAI_API_KEY');
        $client = new Client();
        $messages = [
            [
                'role' => 'system',
                'content' => "
                    You are a helpful assistant that provides concise answers only about database management systems(DBMS), and trends for DBMS based on trend histories.
                    If asked about other topics, say about your role.
                    P.S. Trends histories are stored in local database. 
                    As I said you have to perform these two functionalities.
                    - Answer the questions about all DBMS in the world. Complex queries, integrating with other programming languages, and etc...
                    - Answer the questions about Google Trends for DBMS. The trends data are saved on the local mysql database.
                    In this functionality, at first you get the question about the trends for DBMS such as 'What are the top 5 trending databases this month?' , 'How has MongoDB’s popularity changed in the past year?' and etc.
                    People will ask various kind of questions. You have to be responsible for these questions.
                    So you have to follow below logic to answer these questions.
                    When someone ask question, you should to determine this question is asking about the trends data. If you think yes, you should to make query that can get data from local database while running that query. In this case, you should to answer by starting with 'Trends Question' 
                    so that backend knows that this is the query data.
                    And the right query that is for getting data from database in next line. Never include anything else. So backend are responsible that answer. The backend then runs the query, fetched data and send it back to you for real response.
                    If you think the question is not about the trends, you just answer normally. Then backend will send that response to frontend.
                    But in this case, you don't have to answer by starting with 'This question is not about trends data.'
        
                    Next I will explain about the database structure. 
                    Database name: dbms_ranking
                    Tables
                    vendors table: 
                    This table store the DBMS data.
                    Fields: id, db_name(DBMS name such as MongoDB, MySQL, PostgreSQL, and etc. P.S. When search by DBMS name, it will be ok to make lowercase and compare.)
                    trends table: 
                    This table store the annual Trends data for each DBMS by week.
                    vendor_id: the id of vendor, 
                    date: date(e.g. 2024-10-20)
                    score: Google Trends score for that date(0~100)
        
                    country_trends table: 
                    This table store the annual Trends data by country and week.
                    vendor_id, score, date: These fileds are same as the fields in trends table.
                    country_code: Country code(2 letters e.g. UK, US)
                    In other words, country_trends table store the trends data for country by week.
        
                    You should answer based on these database structure. These are sample questions and answers.
        
                    Q: 'How has MongoDB’s popularity changed in the past year?'
                    A: Trends Question
                    SELECT 
                        DATE_FORMAT(t.date, '%Y-%m-%d') AS week_start, 
                        AVG(t.score) AS avg_score
                    FROM 
                        trends t
                    JOIN 
                        vendors v ON t.vendor_id = v.id
                    WHERE 
                        v.db_name = 'MongoDB' 
                        AND t.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
                    GROUP BY 
                        week_start
                    ORDER BY 
                        t.date;
        
                    Q: 'Compare the popularity of PostgreSQL and MySQL over the last 6 months.'
                    A: Trends Question
                    SELECT 
                        DATE_FORMAT(t.date, '%Y-%m-%d') AS week_start,
                        v.db_name,
                        AVG(t.score) AS avg_score
                    FROM 
                        trends t
                    JOIN 
                        vendors v ON t.vendor_id = v.id
                    WHERE 
                        v.db_name IN ('PostgreSQL', 'MySQL')
                        AND t.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
                    GROUP BY 
                        week_start, v.db_name
                    ORDER BY 
                        week_start, v.db_name;
        
                    Yeah, answer like this but in a line. If you get returning data from backend you have to answer the previous question with these data.
                    For example, 
                    'The top 5 trending databases are MongoDB, MySQL, Oracle, Microsoft sql server and elastic search'.
                    'there are popularity of mongodb for a year.
                    2023-10 83,
                    2023-11 87,
                    .....'
        
                    'These are popularity of MySQL and PostgreSQL.
                    Date MySQL PostgreSQL
                    2024-4 90 75
                    2024-5 86 83
                    ....'
        
                    Hmm... I missed one thing. 
                    All answer that include the trends score must response monthly average score. This is VERY IMPORTATNT. PLEASE DON'T FORGET THIS.
                    Okay. Then let's free talking... I am sure you will be very responsible for any questions whatever.
                "
            ],
            [
                'role' => 'user',
                'content' => $message,
            ]
        ];        

        try {
            $response = $client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => "Bearer {$apiKey}",
                ],
                'json' => [
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'max_tokens' => 1000,
                ],
            ]);

            $data = json_decode($response->getBody(), true);
            $botMessage = $data['choices'][0]['message']['content'] ?? '';
            Log::info('Bot message:\n' . $botMessage);
            array_push($messages,['role' => 'assistant', 'content' => $botMessage]);
            if (strpos($botMessage, 'Trends Question') === 0) {
                $query = trim(substr($botMessage, strlen('Trends Question')));

                try {
                    $result = DB::select($query);
                    $formattedResults = json_encode($result);
                    array_push($messages, ['role' => 'user', 'content' => "Here is the query result: $formattedResults"]);
                    $finalResponse = $client->post('https://api.openai.com/v1/chat/completions', [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => "Bearer {$apiKey}",
                        ],
                        'json' => [
                            'model' => 'gpt-4o-mini',
                            'messages' => $messages,
                            'max_tokens' => 1000,
                        ],
                    ]);
                    $finalData = json_decode($finalResponse->getBody(), true);
                    $finalBotMessage = $finalData['choices'][0]['message']['content'] ?? '';
                    Log::info('Final bot message:\n' . $finalBotMessage);
                    return response()->json(['answer' => $finalBotMessage]);
                } catch(\Exception $e) {
                    return response()->json(['error' => 'Failed to excute query: ' . $e->getMessage()]);
                }
            }

            return response()->json(['answer' => $botMessage]);
        } catch (RequestException $e) {
            return response()->json([
                'error' => 'An error occurred while communicating with the OpenAI API.',
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['answer' => 'Hello? How can I assist you today?']);
    }
}
