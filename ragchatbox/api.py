from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os
import logging
from typing import List
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from app import DocumentProcessor, DocumentManager, CompanyInfoAssistant

# Cấu hình logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Tải biến môi trường
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY không được tìm thấy trong file .env")

# Khởi tạo FastAPI
app = FastAPI(title="Company Info Chatbot API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo các đối tượng
doc_processor = DocumentProcessor()
doc_manager = DocumentManager(doc_processor)
company_assistant = CompanyInfoAssistant()  # Khởi tạo company_assistant
vectorstore = None

# Tự động tải tài liệu khi API khởi động
@app.on_event("startup")
async def startup_event():
    global vectorstore
    try:
        logging.info("Đang tải tài liệu từ thư mục data/...")
        success = doc_manager.load_files_from_data_directory()
        if success:
            all_texts, _ = doc_manager.get_processed_data()
            vectorstore = FAISS.from_documents(all_texts, doc_processor.embeddings)
            logging.info(f"Đã xử lý {len(doc_manager.processed_files)} tài liệu.")
        else:
            logging.warning("Không tìm thấy tài liệu trong thư mục data/ hoặc xử lý thất bại.")
    except Exception as e:
        logging.error(f"Lỗi khi tải tài liệu: {str(e)}")
        raise

# Định nghĩa mô hình dữ liệu
class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

# Endpoint để hỏi câu hỏi
@app.post("/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global vectorstore
    try:
        if vectorstore is None:
            raise HTTPException(status_code=400, detail="Không có tài liệu nào được xử lý. Vui lòng kiểm tra thư mục data/.")
        
        response = company_assistant.get_response(request.question, vectorstore)
        referenced_files = set()
        chain = company_assistant.setup_chain(vectorstore)
        result = chain({"question": request.question})
        
        for doc in result.get("source_documents", []):
            file_path = doc.metadata.get('source', '')
            if file_path:
                file_name = Path(file_path).name
                referenced_files.add(file_name)
        
        return ChatResponse(
            answer=response,
            sources=list(referenced_files)
        )
    except Exception as e:
        logging.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint kiểm tra trạng thái
@app.get("/health")
async def health_check():
    return {"status": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)