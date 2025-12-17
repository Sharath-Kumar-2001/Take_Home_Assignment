import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from ragas.embeddings import LangchainEmbeddingsWrapper
from langchain_openai import OpenAIEmbeddings
from test_index import ask

# Load CSV
df = pd.read_csv("eval/ragas_evaluation_dataset.csv")

eval_rows = []
embeddings = LangchainEmbeddingsWrapper(
    OpenAIEmbeddings()
)

for _, row in df.iterrows():
    rag_output = ask(row["question"])

    eval_rows.append({
        "question": row["question"],
        "answer": rag_output["answer"],
        "contexts": rag_output["contexts"],
        "ground_truth": row["ground_truth"]
    })

# Convert to HuggingFace Dataset
dataset = Dataset.from_list(eval_rows)

# Run RAGAS evaluation
results = evaluate(
    dataset,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ],
    embeddings=embeddings
)

print(results)

scores_df = results.to_pandas()
eval_df = dataset.to_pandas()
evaluated_df = pd.concat([eval_df, scores_df], axis=1)
# View first few rows
print(evaluated_df.head())

# Save to CSV
evaluated_df.to_csv("eval/ragas_evaluated_answers.csv", index=False)
