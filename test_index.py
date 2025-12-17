from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = FAISS.load_local(
    "faiss_part1_index",
    embeddings,
    allow_dangerous_deserialization=True
)

query = "inflation eased in recent months"
results = vectorstore.similarity_search(query, k=5)

# for r in results:
#     print(r.metadata["chunk_id"])
#     print(r.metadata["chunk_preview"])
#     print("-" * 50)

retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 4,
        "filter": {"section": "PART-1"}
    }
)

docs = retriever.invoke(
    "labor market cooling"
)

# for d in docs:
#     print(d.metadata["chunk_id"], d.metadata["chunk_preview"])

prompt = ChatPromptTemplate.from_template("""
You are a concise and factual chatbot that answers questions
about the U.S. Monetary Policy Report.

RULES:
- Use ONLY the information provided in the context.
- Do NOT use outside knowledge.
- Do NOT mention the context, rules, or limitations.

ANSWER STYLE:
- Keep responses brief (1–3 sentences).
- Focus only on the most relevant facts.
- Avoid background explanations unless directly asked.
- No bullet points unless explicitly requested.

WHEN INFORMATION IS MISSING:
- If partially available, answer briefly with what is known.
- If not available, respond naturally, for example:
  - "This is not covered in the Monetary Policy Report."
  - "The report does not provide details on this."

Context:
{context}

User Question:
{question}

Answer (short and factual):
""")

def format_docs(docs):
    return "\n\n".join(
        f"[{d.metadata['chunk_id']}]\n{d.page_content}"
        for d in docs
    )

llm = ChatOpenAI(model="gpt-4.1", temperature=0)

rag_chain = prompt | llm

def confidence_score_from_docs(docs):
    scores = []

    for d in docs:
        # FAISS stores distance internally; simulate similarity
        if "score" in d.metadata:
            s = d.metadata["score"]
            scores.append(1 / (1 + s))

    if not scores:
        return {"average_similarity": None}

    return {
        "average_similarity": sum(scores) / len(scores),
        "num_chunks": len(scores)
    }


def ask(question: str):
    # 1. Retrieve ONCE
    docs = retriever.invoke(question)

    # 2. Generate answer using same docs
    answer = rag_chain.invoke({
        "context": format_docs(docs),
        "question": question
    })

    # 3. Build response
    return {
        "question": question,
        "answer": (
            answer.content
            if hasattr(answer, "content")
            else str(answer)
        ),
        "contexts": [d.page_content for d in docs],
        "confidence": confidence_score_from_docs(docs),
        "sources": [
            {
                "chunk_id": d.metadata["chunk_id"],
                "preview": d.metadata["chunk_preview"]
            }
            for d in docs
        ]
    }


# response = ask("What does the report say about recent inflation trends?")

# print("\nAnswer:\n", response["answer"])
# print("\nConfidence:", response["confidence"])
# print("\nSources:")
# for s in response["sources"]:
#     print(f"- {s['chunk_id']}, {s} ")
