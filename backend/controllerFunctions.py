from supabase import create_client, Client
from qdrant_client import AsyncQdrantClient  
from qdrant_client.http.models import Distance, VectorParams
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from qdrant_client.models import PointStruct
import os
from dotenv import load_dotenv, find_dotenv
import tempfile
import pdfplumber
import tempfile
import os
from fastapi import UploadFile
import psutil
import os
from groq import Groq
import cohere
import numpy as np
import re

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)




cohere_api_key: str = os.getenv("COHERE_API_KEY")
qdrant_api_key_write = os.getenv("QDRANT_API_KEY_WRITE")
qdrant_api_key_read = os.getenv("QDRANT_API_KEY_READ")
qdrant_url=os.getenv("QDRANT_URL")
groq_api_key = os.getenv("GROQ_API_KEY")


point_chunk_size = 50

# print("loading sentence transformer model...")
# embedding_model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L3-v2')

cohere_client = cohere.ClientV2(cohere_api_key)


# print("loading question answering model...")
# model_name = "deepset/bert-base-cased-squad2"

# print("loading nlp pipeline...")
# nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)


def hello():
    print("Hello from the controller function!")

# async def generate_embeddings(sentences):
#     embeddings = embedding_model.encode([sentence for sentence in sentences])
#     return embeddings.astype('float16')
    
# def compare_embeddings(embedding_one, embedding_two):
#   result_arr =[]
#   for i in range(embedding_one.shape[0]):
#     result=0 
#     for j in range(embedding_one.shape[1]):
#       result += embedding_one[i][j]* embedding_two[i][j]
#     result_arr.append(result)
#   return result_arr

async def ensure_collection_exists(
    collection_name: str,
    vector_size: int = 384,
    distance: Distance = Distance.DOT,
) -> AsyncQdrantClient:  
    client = AsyncQdrantClient( 
        url=qdrant_url,
        api_key=qdrant_api_key_write,
    )

    # Use async methods
    existing_collections = await client.get_collections()
    collection_names = [col.name for col in existing_collections.collections]

    if collection_name in collection_names:
        print(f"Collection '{collection_name}' already exists.")
    else:
        print(f"Creating collection '{collection_name}'...")
        await client.recreate_collection(  
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=distance),
        )
        print(f"Collection '{collection_name}' created.")

    return client 


async def insert_embeddings(embeddings, sentences, qdrant_client, collection_name):
  try:
    async_qdrant_client = await ensure_collection_exists(collection_name)

    point_array = []

    for i in range(embeddings.shape[0]):
      point_array.append(PointStruct(id=i, vector=embeddings[i], payload= {"sentence" : sentences[i]}))
      
    print("point_array size : ", len(point_array))
    # return 0 
    retry_point_array = []
    for i in range(0, len(point_array), point_chunk_size):
      chunk = point_array[i:i + point_chunk_size]
      try:
        qdrant_client.upsert(
            collection_name=collection_name,
            wait=True,
            points=chunk,
        )
        print(f"Inserted chunk starting at {i} with size {len(chunk)}")
      except Exception as e:
        retry_point_array.append(chunk)
        print(f"Error inserting chunk starting at {i}: {e}")
        
        # retry setup 
      for i in range(0, len(retry_point_array), int(point_chunk_size/10)):
        retry_chunk = retry_point_array[i:i + int(point_chunk_size/10)]
        try:
          qdrant_client.upsert(
              collection_name=collection_name,
              wait=True,
              points=retry_chunk,
          )
          print(f"Retried chunk starting at {i} with size {len(retry_chunk)}")
        except Exception as e:
          print(f"Error retrying retry_chunk starting at {i}: {e}")
          
  except Exception as e:
    print(f"Error in insert_embeddings: {e}")
    return {"status": "error", "message": str(e)}

def search_embedding(embeddings,qdrant_client,collection_name, maxLimit=1):
  search_result = qdrant_client.query_points(
      collection_name=collection_name,
      query=embeddings,
      with_payload=True,
      limit=maxLimit
  ).points
  return search_result

def delete_collection(collection_name, qdrant_client):
  qdrant_client.delete_collection(collection_name=collection_name)

# def get_sentence_array(article):
#   # article_sentences: list
#   article_sentences = ((sent_tokenize(article)))
#   return article_sentences

async def get_context ( question, qdrant_client,collection_name, limit=3):
  question_array = []
  question_array.append(question)
  print(question_array)
  question_embedding=await generate_embeddings_v2(question_array)
  res= search_embedding(question_embedding[0], qdrant_client, collection_name, limit)

  context= ""
  for i in range(len(res)):
    context += res[i].payload['sentence'] + " "

  return context

# def llm_response( question, context):
  
#   QA_input = {
#       'question': question,
#       'context': context
#   }
#   res = nlp(QA_input)

#   return res

async def convert_pdf_to_text_copilot(pdf_file):
    try:
        with pdfplumber.open(pdf_file.file) as pdf:
            text =  ".".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text.replace("\n", " ") if text else "No text found in PDF"
    except Exception as e:
        print(f"Error extracting text: {e}")
        return "Error extracting text"

async def convert_pdf_to_text_large(pdf_file: UploadFile):
    temp_path = None
    try:
        pdf_file.file.seek(0)
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            temp_path = tmp.name
            # Write uploaded file contents to temp file
            contents = await pdf_file.read()
            tmp.write(contents)
        
        # Process the temporary file
        with pdfplumber.open(temp_path) as pdf:
            text = " ".join(
                page.extract_text().replace("\n", " ") 
                for page in pdf.pages 
                if page.extract_text()
            )
            
        return text if text else "No text found in PDF"
    
    except Exception as e:
        print(f"Error extracting text: {e}")
        return f"Error extracting text: {str(e)}"
    
    finally:
        # Clean up the temporary file
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
        # Reset the file pointer if needed
        await pdf_file.seek(0)
        
        

def upload_pdf_to_supabase(
    supabase: Client,
    file, 
    bucket_name: str = "pdfs", 
    file_name: str = None,
    content_type: str = "application/pdf"
):
    
    try:
        if not file_name:
            raise ValueError("file_name parameter is required when uploading a file object")
        
        # Read the file data
        file_data = file.read()
        
        # Upload to Supabase Storage
        res = supabase.storage.from_(bucket_name).upload(
            path=file_name,
            file=file_data,
            file_options={"content-type": content_type}
        )
        
        print(f"Successfully uploaded {file_name} to {bucket_name} bucket")
        
        # Return public URL (requires proper bucket policies)
        return supabase.storage.from_(bucket_name).get_public_url(file_name)
    
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None

def trim_pdf_extension(filename):
    if filename.lower().endswith('.pdf'):
        return filename[:-4]
    return filename

def chunk_text_with_overlap(text, chunk_size=500, overlap_size=250):
    
    chunks = []
    start = 0
    end = chunk_size
    
    while start < len(text):
        chunk = text[start:end]
        chunks.append(chunk)
        
        # Move the window forward (chunk_size - overlap_size)
        start += (chunk_size - overlap_size)
        end = start + chunk_size
    
    return chunks

def print_memory_usage():
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    print(f"Current memory usage: {mem_info.rss / (1024 * 1024):.2f} MB (RSS)")
    print(f"Virtual memory size: {mem_info.vms / (1024 * 1024):.2f} MB (VMS)")
    try:
        full_info = process.memory_full_info()
        print(f"Unique Set Size (USS): {getattr(full_info, 'uss', 'N/A') / (1024 * 1024):.2f} MB")
        print(f"Proportional Set Size (PSS): {getattr(full_info, 'pss', 'N/A') / (1024 * 1024):.2f} MB")
        print(f"Swap: {getattr(full_info, 'swap', 'N/A') / (1024 * 1024):.2f} MB")
    except Exception as e:
        print(f"Detailed memory info not available: {e}")

async def ask_llm_v2(question: str, context: str):
    client = Groq(api_key=groq_api_key)
    reduced_context = context[:5000]
    prompt = f"Using the following context, answer the question:\n\nContext: {reduced_context}\n\nQuestion: {question}"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="gemma2-9b-it",
    )

    return (chat_completion.choices[0].message.content)

async def generate_embeddings_v2(sentences):
    final_response = []
    for i in range(0, len(sentences), 50):
        batch = sentences[i:i + 50]
        print(f"Processing batch {i // 50 + 1} with {len(batch)} sentences")
        try:
            response =  cohere_client.embed(
                texts=batch,
                model="embed-english-light-v3.0",
                input_type="classification",
                embedding_types=["float"],
            )
            final_response.append(response.embeddings.float_)
        except Exception as e:
            print(f"Error generating embeddings for batch {i // 50 + 1}: {e}")

    return np.concatenate(final_response, axis=0)

def get_sentences_array_v2(text):
    # Split on . ? ! followed by whitespace and a capital letter or end of string
    pattern = r'(?<=[.!?])\s+(?=[A-Z])'
    sentences = re.split(pattern, text)
    return [s.strip() for s in sentences if s.strip()]