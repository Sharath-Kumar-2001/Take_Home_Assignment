import re
from pypdf import PdfReader


# --------------------------------------------------
# Step 1: Extract raw text from PDF
# --------------------------------------------------
def extract_pdf_text(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)

    return "\n".join(text)


# --------------------------------------------------
# Step 2: Normalize PDF text (VERY IMPORTANT)
# --------------------------------------------------
def normalize_pdf_text(text: str) -> str:
    """
    Cleans common PDF extraction artifacts.
    """
    text = text.replace("\u00ad", "")          # remove soft hyphens
    text = re.sub(r"[ \t]+", " ", text)        # normalize spaces
    text = re.sub(r"\n{2,}", "\n\n", text)     # normalize newlines
    return text.strip()


# --------------------------------------------------
# Step 3: Extract ONLY the real PART 1 section
# --------------------------------------------------
def extract_part_1_from_pdf(text: str) -> str:
    """
    Extracts PART 1 content while ignoring page headers like:
    '6 PART 1: RECENT ECONOMIC AND FINANCIAL DEVELOPMENTS'
    """

    text = normalize_pdf_text(text)

    pattern = re.compile(
        r"""
        ^\s*Part\s*1\s*                # Real "Part 1" heading
        \n+                            # Newline(s)
        [A-Za-z].*?                    # Section title line
        \n                             # Newline
        (.*?)                          # ===== PART 1 CONTENT =====
        (?=                            # Stop when we see:
            ^\s*Part\s*2\b             #   Part 2 heading
        )
        """,
        re.IGNORECASE | re.DOTALL | re.MULTILINE | re.VERBOSE
    )

    match = pattern.search(text)

    if not match:
        raise ValueError("PART 1 section not found")

    return match.group(1).strip()


# --------------------------------------------------
# Step 4: Remove repeating page headers inside PART 1
# --------------------------------------------------
def remove_page_headers(part1_text: str) -> str:
    """
    Removes repeating headers like:
    '6 PART 1: RECENT ECONOMIC AND FINANCIAL DEVELOPMENTS'
    """

    cleaned = re.sub(
        r"\n?\s*\d+\s+PART\s+1:.*?\n",
        "\n",
        part1_text,
        flags=re.IGNORECASE
    )

    return cleaned.strip()


# --------------------------------------------------
# Step 5: MAIN
# --------------------------------------------------
if __name__ == "__main__":
    pdf_path = "data/test_doc.pdf"

    full_text = extract_pdf_text(pdf_path)
    part_1_text = extract_part_1_from_pdf(full_text)
    part_1_text = remove_page_headers(part_1_text)

    print("✅ PART 1 extracted successfully\n")
    print(part_1_text[:1500])  # preview

    # Optional: save to file
    with open("part_1_only.txt", "w", encoding="utf-8") as f:
        f.write(part_1_text)
