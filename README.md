---

# 🧠 HeadlineIQ – AI-Powered News Headline Analyzer

HeadlineIQ is an AI-powered application that analyzes news headlines and classifies them into **Normal News**, **Medium Sensational**, or **High Clickbait** categories.
The system uses **Natural Language Processing (NLP)** and an **unsupervised K-Means clustering model** to understand headline structure, emotional intensity, and SEO-related characteristics.

In addition to classification, HeadlineIQ provides **SEO insights, platform suitability, and actionable suggestions** to help journalists, bloggers, and content creators improve headline quality.

---

## 🚀 Key Features

* AI-based headline classification (Normal / Medium / High Clickbait)
* Emotion analysis using custom emotion scoring
* SEO & Google Search friendliness evaluation
* Social media suitability insights
* Explainable AI (feature contribution analysis)
* REST API built with FastAPI
* Mobile app integration using React Native

---

## 🛠️ Tech Stack

### Backend (AI + API)

* Python
* FastAPI
* Scikit-learn
* K-Means Clustering
* StandardScaler
* Joblib
* NLP-based feature engineering

### Frontend (Mobile App)

* React Native
* JavaScript
* Fetch API

---

## 📂 Project Structure

```
news-sensation-model/
│
├── api/
│   ├── main.py                # FastAPI application
│   ├── feature_engineering.py # Feature extraction & explainability
│   └── models/
│       ├── sensational_kmeans_model_v1.1.pkl
│       └── sensational_scaler_model_v1.1.pkl
│
├── mobile-app/
│   └── HeadlineIQApp/          # React Native application
│
├── requirements.txt
├── README.md
└── vercel.json (optional)
```

---

## ⚙️ Model & API Setup (Backend)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/news-sensation-model.git
cd news-sensation-model
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run FastAPI Server

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5️⃣ Test API in Browser

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## 📡 API Endpoint

### POST `/predict`

#### Request Body

```json
{
  "headline": "Trump threatens Canada with 100% tariffs if it makes a deal with China"
}
```

#### Response Example

```json
{
  "prediction": "Medium Sensational",
  "cluster_id": 1,
  "headline_analysis": {
    "seo_friendly": true,
    "google_search_friendly": true,
    "social_media_friendly": true,
    "best_platforms": [
      "Google Search",
      "Google Discover",
      "Twitter (X)"
    ],
    "improvement_suggestion": "This headline is well-balanced. You may slightly enhance emotional wording, but keep it factual."
  }
}
```

---

## 📱 React Native App Setup (APK / Mobile App)

### 1️⃣ Go to Mobile App Folder

```bash
cd mobile-app/HeadlineIQApp
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Metro Server

```bash
npx react-native start
```

### 4️⃣ Run on Android

```bash
npx react-native run-android
```

> ⚠️ Make sure your **mobile and backend are on the same network**, or use **ngrok** to expose the API.

---

## 🌐 API Integration (React Native Example)

```js
const analyzeHeadline = async (headline) => {
  const response = await fetch('http://YOUR_IP:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ headline }),
  });

  return await response.json();
};
```

---

## 🧠 How the Algorithm Works (Brief)

* Headlines are converted into numerical features
* Features are scaled using StandardScaler
* K-Means groups headlines into 3 natural clusters
* Each cluster is mapped to a meaningful label
* Feature contribution explains prediction logic

---

## 🎯 Use Cases

* News portals
* Blogging platforms
* SEO tools
* Content quality analysis
* Headline A/B testing
* AI-powered CMS automation

---

## 📌 Future Improvements

* Transformer-based emotion detection
* Multilingual headline support
* Trend-based click prediction
* Online learning for adaptive clustering

---

## 👨‍💻 Author

**Muhammad Shabbir**
AI Engineer | IBM Certified AI Professional
Specialized in NLP, AI Model Deployment, and AI-powered Applications

📧 Open to collaborations and research opportunities

---


