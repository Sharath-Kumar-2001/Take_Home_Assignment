# Monetary Policy Report Question Answering System

## 📌 Problem Statement

The **Monetary Policy Report (MPR)** contains critical economic insights, but extracting specific information from it is challenging due to the following reasons:

### ❗ Challenges
- The report is **densely written in narrative form**
- Insights are **scattered across long textual sections**
- No structured way to extract targeted information

### 🎯 Analyst Needs
Economic analysts often need quick answers to focused questions such as:
- Employment gains by demographic groups
- Wage pressures in specific sectors
- Impact of labor market conditions on inflation

### 🚫 Limitations of Manual Analysis
- Time-consuming to search through long documents
- Prone to human error
- Inefficient for repeated or large-scale analysis
- No support for **natural language queries**

### ✅ Solution
This project enables users to **query the Monetary Policy Report using natural language**, allowing fast, accurate, and repeatable access to economic insights.

![Architecture Diagram](docs/architecture.png)


### steps to install
1️⃣ Clone the repository
```bash
git clone https://github.com/username/repository-name.git
cd repository-name

2️⃣ Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run the backend application
fastapi dev main.py
frontend application
npm run dev
