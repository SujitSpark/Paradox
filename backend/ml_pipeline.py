import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, accuracy_score, classification_report
import joblib
import matplotlib.pyplot as plt
import os
from datetime import datetime

# Set up directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
OUTPUTS_DIR = os.path.join(BASE_DIR, 'outputs')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    dates = pd.date_range(start='2020-01-01', periods=num_samples)
    
    data = {
        'registration_date': np.random.choice(dates, num_samples),
        'last_hearing_date': np.random.choice(dates, num_samples),
        'next_hearing_date': np.random.choice(dates, num_samples),
        'case_type': np.random.choice(['Civil', 'Criminal', 'Family', 'Corporate'], num_samples),
        'nature_of_case': np.random.choice(['Property', 'Theft', 'Divorce', 'Fraud'], num_samples),
        'status': np.random.choice(['Pending', 'Disposed'], num_samples),
        'petitioner_count': np.random.randint(1, 5, num_samples),
        'respondent_count': np.random.randint(1, 5, num_samples),
        'court_name_level': np.random.choice(['High Court', 'District Court', 'Supreme Court'], num_samples),
        'district': np.random.choice(['DistA', 'DistB', 'DistC'], num_samples),
        'state': np.random.choice(['StateX', 'StateY', 'StateZ'], num_samples),
        # Target variables
        'adjournments_count': np.random.randint(0, 20, num_samples),
        'priority_score': np.random.uniform(1.0, 10.0, num_samples),
        'escalation_level': np.random.choice(['Low', 'Medium', 'High'], num_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Process dates for synthetic data as well
    df['registration_date'] = pd.to_datetime(df['registration_date'])
    df['last_hearing_date'] = pd.to_datetime(df['last_hearing_date'])
    df['next_hearing_date'] = pd.to_datetime(df['next_hearing_date'])
    
    current_date = pd.to_datetime('today')
    df['case_age_days'] = (current_date - df['registration_date']).dt.days
    df['days_since_last_hearing'] = (current_date - df['last_hearing_date']).dt.days
    df['days_until_next_hearing'] = (df['next_hearing_date'] - current_date).dt.days
    
    # We also need days_since_first_listing and is_decided to match real data features
    # For synthetic data, we can proxy these or simulate them
    df['days_since_first_listing'] = (df['last_hearing_date'] - df['registration_date']).dt.days
    df['is_decided'] = (df['status'] == 'Disposed').astype(int)
    
    return df

def generate_real_data(num_samples=500):
    np.random.seed(123)
    
    dates = pd.date_range(start='2022-01-01', periods=num_samples)
    
    data = {
        'ddl_case_id': [f'CASE_{i}' for i in range(num_samples)],
        'year': np.random.choice([2022, 2023, 2024], num_samples),
        'state_code': np.random.randint(1, 30, num_samples),
        'dist_code': np.random.randint(1, 50, num_samples),
        'court_no': np.random.randint(1, 10, num_samples),
        'cino': [f'CINO_{i}' for i in range(num_samples)],
        'judge_position': np.random.choice(['Chief Justice', 'District Judge', 'Magistrate'], num_samples),
        'female_defendant': np.random.choice([0, 1], num_samples),
        'female_petitioner': np.random.choice([0, 1], num_samples),
        'female_adv_def': np.random.choice([0, 1], num_samples),
        'female_adv_pet': np.random.choice([0, 1], num_samples),
        'type_name': np.random.choice(['Civil', 'Criminal', 'Family', 'Corporate'], num_samples),
        'purpose_name': np.random.choice(['Hearing', 'Evidence', 'Judgment'], num_samples),
        'disp_name': np.random.choice(['Allowed', 'Dismissed', 'Pending'], num_samples),
        'date_of_filing': np.random.choice(dates, num_samples),
        'date_of_decision': np.random.choice(list(dates) + [pd.NaT], num_samples), # Include NaT for undecided
        'date_first_list': np.random.choice(dates, num_samples),
        'date_last_list': np.random.choice(dates, num_samples),
        'date_next_list': np.random.choice(dates, num_samples)
    }
    
    df = pd.DataFrame(data)
    return df

def map_categorical_features(train_df):
     # Since synthetic and real data have different categorical columns in the prompt,
     # we map the synthetic columns to match the real data for training
     train_df = train_df.rename(columns={
         'case_type': 'type_name',
         'nature_of_case': 'purpose_name',
         'status': 'disp_name',
         'court_name_level': 'judge_position'
     })
     return train_df

def engineer_real_features(df):
    
    current_date = pd.to_datetime('today')
    
    df['date_of_filing'] = pd.to_datetime(df['date_of_filing'], errors='coerce')
    df['date_last_list'] = pd.to_datetime(df['date_last_list'], errors='coerce')
    df['date_first_list'] = pd.to_datetime(df['date_first_list'], errors='coerce')
    df['date_next_list'] = pd.to_datetime(df['date_next_list'], errors='coerce')
    df['date_of_decision'] = pd.to_datetime(df['date_of_decision'], errors='coerce')
    
    df['case_age_days'] = (current_date - df['date_of_filing']).dt.days
    df['days_since_first_listing'] = (df['date_last_list'] - df['date_first_list']).dt.days
    df['days_since_last_hearing'] = (current_date - df['date_last_list']).dt.days
    df['days_until_next_hearing'] = (df['date_next_list'] - current_date).dt.days
    
    df['is_decided'] = df['date_of_decision'].notnull().astype(int)
    
    # Fill NAs in engineered features with 0
    for col in ['case_age_days', 'days_since_first_listing', 'days_since_last_hearing', 'days_until_next_hearing']:
        df[col] = df[col].fillna(0)
        
    return df

def encode_categorical(train_df, test_df, categorical_cols):
    encoders = {}
    
    # Ensure columns exist in both DataFrames
    for col in categorical_cols:
        le = LabelEncoder()
        # Fit on combined data to handle unseen categories
        combined = pd.concat([train_df[col], test_df[col]]).astype(str)
        le.fit(combined)
        
        train_df[col] = le.transform(train_df[col].astype(str))
        test_df[col] = le.transform(test_df[col].astype(str))
        
        encoders[col] = le
        
    return train_df, test_df, encoders

def plot_feature_importance(model, feature_names, title, filename):
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(10, 6))
    plt.title(title)
    plt.bar(range(len(importances)), importances[indices], align="center")
    plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=45, ha='right')
    plt.xlim([-1, len(importances)])
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUTS_DIR, filename))
    plt.close()

def main():
    print("1. Loading synthetic dataset...")
    synthetic_df = generate_synthetic_data(2000)
    
    print("8. Loading real dataset...")
    real_df = generate_real_data(1000)
    real_ids = real_df['ddl_case_id'].copy()
    
    # Map synthetic target columns
    synthetic_df = map_categorical_features(synthetic_df)
    
    print("2 & 9. Feature engineering...")
    real_df = engineer_real_features(real_df)
    
    features = [
        'case_age_days', 
        'days_since_first_listing', 
        'days_since_last_hearing', 
        'days_until_next_hearing', 
        'is_decided',
        'type_name',
        'purpose_name',
        'disp_name',
        'judge_position'
    ]
    
    cat_cols = ['type_name', 'purpose_name', 'disp_name', 'judge_position']
    
    print("3 & 10. Encoding categorical columns...")
    synthetic_df, real_df, encoders = encode_categorical(synthetic_df, real_df, cat_cols)
    joblib.dump(encoders, os.path.join(MODELS_DIR, 'label_encoders.joblib'))
    
    X = synthetic_df[features]
    
    targets = ['adjournments_count', 'priority_score', 'escalation_level']
    y_adj = synthetic_df['adjournments_count']
    y_prio = synthetic_df['priority_score']
    
    # Encode classification target securely
    le_esc = LabelEncoder()
    y_esc = le_esc.fit_transform(synthetic_df['escalation_level'])
    joblib.dump(le_esc, os.path.join(MODELS_DIR, 'target_encoder_escalation.joblib'))
    
    print("4. Splitting train/validation data...")
    X_train, X_val, y_adj_train, y_adj_val = train_test_split(X, y_adj, test_size=0.2, random_state=42)
    _, _, y_prio_train, y_prio_val = train_test_split(X, y_prio, test_size=0.2, random_state=42)
    _, _, y_esc_train, y_esc_val = train_test_split(X, y_esc, test_size=0.2, random_state=42)
    
    print("5. Training Random Forest models...")
    rf_adj = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_adj.fit(X_train, y_adj_train)
    
    rf_prio = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_prio.fit(X_train, y_prio_train)
    
    rf_esc = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_esc.fit(X_train, y_esc_train)
    
    print("6. Evaluating models...")
    adj_preds = rf_adj.predict(X_val)
    print(f"Adjournments Count - RMSE: {np.sqrt(mean_squared_error(y_adj_val, adj_preds)):.4f}, MAE: {mean_absolute_error(y_adj_val, adj_preds):.4f}")
    
    prio_preds = rf_prio.predict(X_val)
    print(f"Priority Score - RMSE: {np.sqrt(mean_squared_error(y_prio_val, prio_preds)):.4f}, MAE: {mean_absolute_error(y_prio_val, prio_preds):.4f}")
    
    esc_preds = rf_esc.predict(X_val)
    print("Escalation Level Classification Report:")
    print(classification_report(y_esc_val, esc_preds, target_names=le_esc.classes_))
    
    with open(os.path.join(OUTPUTS_DIR, 'evaluation_metrics.txt'), 'w') as f:
        f.write(f"Adjournments Count - RMSE: {np.sqrt(mean_squared_error(y_adj_val, adj_preds)):.4f}, MAE: {mean_absolute_error(y_adj_val, adj_preds):.4f}\n")
        f.write(f"Priority Score - RMSE: {np.sqrt(mean_squared_error(y_prio_val, prio_preds)):.4f}, MAE: {mean_absolute_error(y_prio_val, prio_preds):.4f}\n\n")
        f.write("Escalation Level Classification Report:\n")
        f.write(classification_report(y_esc_val, esc_preds, target_names=le_esc.classes_))
    
    # Plot feature importances
    plot_feature_importance(rf_adj, features, 'Feature Importance - Adjournments Count', 'feat_imp_adjournments.png')
    plot_feature_importance(rf_prio, features, 'Feature Importance - Priority Score', 'feat_imp_priority.png')
    plot_feature_importance(rf_esc, features, 'Feature Importance - Escalation Level', 'feat_imp_escalation.png')
    
    print("7. Saving models...")
    joblib.dump(rf_adj, os.path.join(MODELS_DIR, 'rf_adjournments.joblib'))
    joblib.dump(rf_prio, os.path.join(MODELS_DIR, 'rf_priority.joblib'))
    joblib.dump(rf_esc, os.path.join(MODELS_DIR, 'rf_escalation.joblib'))
    
    print("11. Generating predictions for real dataset...")
    X_real = real_df[features]
    
    real_adj_preds = rf_adj.predict(X_real)
    real_prio_preds = rf_prio.predict(X_real)
    real_esc_preds_encoded = rf_esc.predict(X_real)
    real_esc_preds = le_esc.inverse_transform(real_esc_preds_encoded)
    
    final_output = pd.DataFrame({
        'ddl_case_id': real_ids,
        'predicted_adjournments_count': real_adj_preds,
        'predicted_priority_score': real_prio_preds,
        'predicted_escalation_level': real_esc_preds
    })
    
    print("12 & 13. Saving final dataset...")
    final_output_path = os.path.join(OUTPUTS_DIR, 'predicted_real_cases.csv')
    final_output.to_csv(final_output_path, index=False)
    print(f"Workflow complete. Results saved to {final_output_path}")

if __name__ == "__main__":
    main()
