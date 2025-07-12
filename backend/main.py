from supabase import create_client, Client
import traceback
from qdrant_client import QdrantClient
from fastapi import FastAPI
from pydantic import BaseModel
from controllerFunctions import *
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse

import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv
from fastapi.middleware.cors import CORSMiddleware

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)
# print(os.getenv("SECRET"))


app = FastAPI()

origins = [
    
    "*",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Origins that can access the API
    allow_credentials=True,
    allow_methods=["*"],              # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],              # Authorization, Content-Type, etc.
)

# qdrant connection
qdrant_api_key_write = os.getenv("QDRANT_API_KEY_WRITE")
qdrant_api_key_read = os.getenv("QDRANT_API_KEY_READ")
qdrant_url=os.getenv("QDRANT_URL")

qdrant_client = QdrantClient(
    url=qdrant_url, 
    api_key=qdrant_api_key_write,
    timeout=20.0, 
    
)
print("Qdrant client initialized")
# print(type(qdrant_client))
# print(qdrant_client.get_collections())
# print(os.getcwd()) 

print_memory_usage()


# supabase connection 
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")


url: str = supabase_url
key: str = supabase_key
supabase: Client = create_client(url, key)
print("supabase initialised : ")
print(supabase)

response = supabase.table("Demo").select("id").limit(1).execute()
print("response   : ", response)

class PredictRequest(BaseModel):
    foo: str | None = None
    info : str | None = "N0 one"
    num : int | None = 0
  
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}



class GetPdfRequest(BaseModel):
    pdfData: str  | None = None


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

        
from datetime import date
@app.post("/upload")
async def upload_file(googleAuth: str = Form(...), activeProjectId: str= Form(...), file: UploadFile = File(...), collection_name: Optional[str] = Form("test_collection_2")):

    try:
        # if(activeProjectId=="null") :
        #     activeProjectId = str(uuid.uuid4())   
        print("activeProjectId : ")
        print(activeProjectId)
        # return None
        
        print("upload_file : ")
        print(file.filename)
        
        public_url = upload_pdf_to_supabase(
            supabase=supabase,
            file=file.file,
            file_name=activeProjectId
        )
        print("public_url : ")
        print(public_url)
        
        
        today = date.today()
        response = (
            supabase.table("Demo")
            .insert({"googleAuth": googleAuth,"title" :trim_pdf_extension( file.filename) , "fileName" : file.filename, "uploadDate" : today.isoformat(), "fileUrl" : public_url, "id": activeProjectId, "chats" : []})
            .execute()
        )
        
        print("response : ")
        print(response)
        # return None
        context_text =await convert_pdf_to_text_large(file)
        print("sentence array ")
        print("-"*20)
        sentences = get_sentences_array_v2(context_text)
        print("paragraph array ")
        print("-"*20)
        para_chunks = chunk_text_with_overlap(context_text)
        print("sentence embeddings")
        print("-"*20)
        sentences_embeddings =await generate_embeddings_v2(sentences)
        print("paragraph embeddings ")
        print("-"*20)
        para_chunks_embeddings =await generate_embeddings_v2(para_chunks)
        print("done")
        op_info_sentences =await  insert_embeddings(sentences_embeddings, sentences, qdrant_client, activeProjectId)
        op_info_para_chunks =await  insert_embeddings(para_chunks_embeddings, para_chunks, qdrant_client, activeProjectId)
        print("embeddings : ")
        print(len(sentences_embeddings[0]))
        print(op_info_sentences)
        print(op_info_para_chunks)

        return JSONResponse(content={"filename": file.filename, "file": "file"})
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)

    
class getanswer(BaseModel):
    question: str | None =" "
    collection_name: str | None = "test_collection_2"
    limit: int | None = 100  
    
@app.post('/getanswer')
async def get_answer(request: getanswer):
    print("getanswer called")
    print(request.collection_name)
    # return None
    try:
        print("getans")
        question = request.question
        print(request)
        
        context =await get_context(question, qdrant_client, collection_name=request.collection_name, limit=request.limit)
        print("context : ")
        print(context)
        # answer = llm_response(question, context)
        # print(answer['answer'])
        # return JSONResponse(content= {"answer" : answer['answer']}, status_code=200)
        
        answer = await ask_llm_v2(question, context)
        print("answer : ")
        return JSONResponse(content= {"answer" : answer}, status_code=200)  
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return JSONResponse(content={"answer" : "Error! please retry "}, status_code=200)

@app.post('/getchat')
async def getChat (id:str = Form(...)):
    try:
        print("getChat called")
        print(id)
        response = (
            supabase.table("Demo")
            .select("chats")
            .eq("id", id)
            .execute()
        )
        print(response.data)
        return JSONResponse(content=response.data, status_code=200)     
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
import json
@app.post('/updatechat')
async def updateChat(id: str = Form(...), chats: str = Form(...)):
    try:
        print("updateChat called")
        print(id)
        # print(chat)
        response = (
            supabase.table("Demo")
            .update({"chats": json.loads(chats)})
            .eq("id", id)
            .execute()
        )
        print(response.data)
        return JSONResponse(content={"message": "Chat updated successfully"}, status_code=200) 
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.post('/getprojects')
async def getProjects(googleAuth: str = Form(...)):
    try:
        print("getProjects called")
        print(googleAuth)
        response = (
            supabase.table("Demo")
            .select("id,title, fileName, uploadDate, fileUrl")
            .eq("googleAuth", googleAuth)
            .execute()
        )
        print(response.data)
        return JSONResponse(content=response.data, status_code=200)     
    except Exception as e:
        print(f"Error in getprojects: {e}")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/delete")
def delete(id: str = Form(...)):
    print("delete called for id : ", id)
    try:
        response = ( supabase
            .storage
            .from_("pdfs")
            .remove([id])
        )

        response = (
            supabase.table("Demo")
            .delete()
            .eq("id", id)
            .execute()
        )
        
        delete_collection(id, qdrant_client)
        return JSONResponse(content={"message": "Chat deleted successfully"}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)