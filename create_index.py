from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader


# -----------------------------
# 1. Load PDF (page-level docs)
# -----------------------------
PDF_PATH = "data/test_doc.pdf"   # <-- change this

loader = PyPDFLoader(PDF_PATH)
pages = loader.load()     # Each item = one page


# -----------------------------
# 2. Clean text (important for PDFs)
# -----------------------------
def clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = " ".join(text.split())
    return text


cleaned_pages = []
for page in pages:
    cleaned_pages.append(
        Document(
            page_content=clean_text(page.page_content),
            metadata={
                "section": "PART-1",
                "page_number": page.metadata.get("page")
            }
        )
    )


# -----------------------------
# 3. Chunk directly (BEST METHOD)
# -----------------------------
splitter = RecursiveCharacterTextSplitter(
    chunk_size=900,
    chunk_overlap=120,
    separators=["\n\n", "\n", " ", ""]
)

chunked_docs = splitter.split_documents(cleaned_pages)


# Add chunk metadata
for i, chunk in enumerate(chunked_docs, start=1):
    chunk.metadata.update({
        "chunk_id": f"C{i}",
        "chunk_preview": chunk.page_content[:150] + "..."
    })


# Debug sample
for d in chunked_docs[:3]:
    print(d.metadata)
    print(d.page_content[:300])
    print("-" * 60)


# -----------------------------
# 4. Create embeddings
# -----------------------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# -----------------------------
# 5. Store in FAISS
# -----------------------------
vectorstore = FAISS.from_documents(
    documents=chunked_docs,
    embedding=embeddings
)

vectorstore.save_local("faiss_part1_index")


# -----------------------------
# 6. Similarity Search Test
# -----------------------------
results = vectorstore.similarity_search(
    "inflation eased last year",
    k=3
)

for r in results:
    print("Page:", r.metadata.get("page_number"))
    print("Chunk:", r.metadata["chunk_id"])
    print("Preview:", r.metadata["chunk_preview"])
    print("-" * 50)
