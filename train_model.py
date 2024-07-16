import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# Expanded sample training data
texts = [
    "This product is great", 
    "Items safely received with good condition and good value for money", 
    "I love this", 
    "Scam alert", 
    "Hi",
    "Worst product ever, totally fake",
    "Excellent quality and fast shipping",
    "This is a scam, do not buy!",
    "Very satisfied with the purchase",
    "Fraudulent seller, avoid at all costs"
    "Good quality n comfortable  ... thanks"
    "very beautiful soft material  .... worth buying .... thanks"
    "my second purchase  ... Good quality  n comfortable  ... thanks"

]
labels = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1]  # 0 for real, 1 for fake

# Vectorize texts
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# Train a simple model
model = LogisticRegression()
model.fit(X, labels)

# Save model and vectorizer
with open('model.pkl', 'wb') as model_file:
    pickle.dump((vectorizer, model), model_file)
print("Model saved successfully")
