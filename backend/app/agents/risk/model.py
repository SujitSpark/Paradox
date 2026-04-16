# agents/ml_risk_prediction_agent/model.py

import xgboost as xgb
import joblib
import os
import pandas as pd
import numpy as np
from .config import MODEL_PATH, NUMERIC_FEATURES, CATEGORICAL_FEATURES, TARGET_COLUMN

def train_or_load_model(df: pd.DataFrame):
    """Train the model if it doesn't exist, otherwise load and optionally retrain."""
    
    # Check for model existence
    if os.path.exists(MODEL_PATH):
        print(f"Loading existing model from {MODEL_PATH}")
        model = joblib.load(MODEL_PATH)
    else:
        print("Model not found. Training new XGBRegressor...")
        model = train_model(df)
        joblib.dump(model, MODEL_PATH)
    
    return model

def train_model(df: pd.DataFrame):
    """Train XGBoost Regressor on the provided data."""
    # 1. Prepare features and target
    y = df[TARGET_COLUMN]
    X = df.drop(columns=[TARGET_COLUMN])
    
    # 2. Extract only training features
    # Ensure columns match expectations for encoding
    X_processed = pd.get_dummies(df, columns=[c for c in CATEGORICAL_FEATURES if c in df.columns], drop_first=True)
    
    # 3. Handle model features
    X_train = X_processed[[c for c in X_processed.columns if c in NUMERIC_FEATURES or any(c.startswith(cat) for cat in CATEGORICAL_FEATURES)]]
    
    # 4. Train
    model = xgb.XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, objective='reg:squarederror')
    model.fit(X_train, y)
    
    return model

def predict_ml_risk(df: pd.DataFrame, model) -> pd.Series:
    """Predict predicted_adjournments and normalize to 0-100 risk score."""
    
    # Prepare input features
    X_processed = pd.get_dummies(df, columns=[c for c in CATEGORICAL_FEATURES if c in df.columns], drop_first=True)
    
    # Align columns with model features
    model_features = model.get_booster().feature_names
    X_input = pd.DataFrame(columns=model_features)
    for col in model_features:
        if col in X_processed.columns:
            X_input[col] = X_processed[col]
        else:
            X_input[col] = 0
            
    # Predict
    predicted_adjournments = model.predict(X_input)
    
    # Normalize to 0-100 risk score
    # max_adj = max(1, max(adjournments_in_dataset))
    max_adj = max(1, df[TARGET_COLUMN].max())
    risk_ml = (predicted_adjournments / max_adj) * 100
    
    return pd.Series(risk_ml).clip(upper=100)
