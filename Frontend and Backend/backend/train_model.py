import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

from scratch_model import ScratchDecisionTreeClassifier

def train_and_save():
    # 1. Locate dataset
    possible_paths = [
        r"C:\Users\Kashika Jamod\Desktop\ML project\Loan_default.csv",
        r"D:\ML-Project\Loan_default.csv\Loan_default.csv",
        r"D:\ML-Project\Loan_default.csv",
        r"d:\ML-Project\Loan_Default_Prediction\Loan_default.csv",
        "Loan_default.csv"
    ]
    file_path = None
    for p in possible_paths:
        if os.path.isfile(p):
            file_path = p
            break

    if not file_path:
        raise FileNotFoundError("Loan_default.csv dataset could not be found.")

    print(f"Loading dataset from: {file_path}")
    raw_df = pd.read_csv(file_path)
    raw_rows_count = len(raw_df)

    df = raw_df.copy()

    # Drop LoanID if present
    if 'LoanID' in df.columns:
        df = df.drop(columns=['LoanID'])

    # EDA Stats collection
    eda_stats = {
        "dataset_source": "Kaggle Loan Default Prediction Dataset",
        "raw_records": raw_rows_count,
        "rows_removed": 0,
        "final_records": len(df),
        "total_features": len(df.columns) - 1,
        "default_rate_pct": f"{round(df['Default'].mean() * 100, 2)}%",
        "healthy_ranges": [
            {"parameter": "Credit Score", "healthy": "650 - 850", "unit": "FICO Range"},
            {"parameter": "Debt-to-Income (DTI)", "healthy": "< 0.35 (35%)", "unit": "Ratio"},
            {"parameter": "Monthly Income", "healthy": "> $4,500", "unit": "USD / Month"},
            {"parameter": "Loan-to-Income", "healthy": "< 0.40x", "unit": "Multiplier"},
            {"parameter": "Interest Rate", "healthy": "5.0% - 12.5%", "unit": "Percentage"}
        ]
    }

    num_cols = ['Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 
                'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio']
    cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 
                'HasDependents', 'LoanPurpose', 'HasCoSigner']

    print("Encoding categorical features...")
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    X = df.drop(columns=['Default'])
    y = df['Default']

    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Scaling numerical features...")
    scaler = StandardScaler()
    
    X_train_num_scaled = scaler.fit_transform(X_train[num_cols])
    X_train_scaled = X_train.copy()
    X_train_scaled[num_cols] = X_train_num_scaled

    X_test_scaled = X_test.copy()
    X_test_scaled[num_cols] = scaler.transform(X_test[num_cols])

    # 1. Train Scikit-Learn Model (RandomForest)
    print("Training Scikit-Learn RandomForest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_scaled, y_train)

    rf_preds = rf_model.predict(X_test_scaled)
    rf_probs = rf_model.predict_proba(X_test_scaled)[:, 1]

    rf_metrics = {
        "algorithm": "Ensemble Random Forest Classifier",
        "library": "Scikit-Learn (sklearn.ensemble)",
        "trained_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "hyperparameters": {
            "n_estimators": 100,
            "max_depth": 12,
            "criterion": "gini",
            "min_samples_split": 2,
            "min_samples_leaf": 1
        },
        "accuracy": f"{round(accuracy_score(y_test, rf_preds) * 100, 2)}%",
        "precision": f"{round(precision_score(y_test, rf_preds, zero_division=0) * 100, 2)}%",
        "recall": f"{round(recall_score(y_test, rf_preds, zero_division=0) * 100, 2)}%",
        "f1_score": f"{round(f1_score(y_test, rf_preds, zero_division=0) * 100, 2)}%",
        "roc_auc": f"{round(roc_auc_score(y_test, rf_probs), 4)}"
    }
    print("Scikit-Learn Model Metrics:", rf_metrics)

    # 2. Train Scratch Algorithm Model (No Libraries)
    print("Training Scratch Decision Tree Classifier (No Libraries Constraint)...")
    # Sample subset for fast scratch tree building if dataset is very large
    sample_size = min(25000, len(X_train_scaled))
    sample_idxs = np.random.choice(len(X_train_scaled), sample_size, replace=False)
    X_train_scratch = X_train_scaled.iloc[sample_idxs]
    y_train_scratch = y_train.iloc[sample_idxs]

    scratch_model = ScratchDecisionTreeClassifier(max_depth=8, min_samples_split=10)
    scratch_model.fit(X_train_scratch, y_train_scratch)

    test_sample_size = min(5000, len(X_test_scaled))
    test_idxs = np.random.choice(len(X_test_scaled), test_sample_size, replace=False)
    X_test_scratch = X_test_scaled.iloc[test_idxs]
    y_test_scratch = y_test.iloc[test_idxs]

    scratch_preds = scratch_model.predict(X_test_scratch)
    scratch_probs = scratch_model.predict_proba(X_test_scratch)[:, 1]

    scratch_metrics = {
        "algorithm": "Custom Scratch Decision Tree Classifier",
        "library": "None (Pure Python & NumPy Scratch Implementation)",
        "trained_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "hyperparameters": {
            "max_depth": 8,
            "min_samples_split": 10,
            "criterion": "Gini Impurity (Scratch Math)",
            "library_used": False
        },
        "accuracy": f"{round(accuracy_score(y_test_scratch, scratch_preds) * 100, 2)}%",
        "precision": f"{round(precision_score(y_test_scratch, scratch_preds, zero_division=0) * 100, 2)}%",
        "recall": f"{round(recall_score(y_test_scratch, scratch_preds, zero_division=0) * 100, 2)}%",
        "f1_score": f"{round(f1_score(y_test_scratch, scratch_preds, zero_division=0) * 100, 2)}%",
        "roc_auc": f"{round(roc_auc_score(y_test_scratch, scratch_probs), 4)}"
    }
    print("Scratch Model Metrics:", scratch_metrics)

    # Output directory
    output_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(output_dir, exist_ok=True)

    model_path = os.path.join(output_dir, "model.pkl")
    scratch_model_path = os.path.join(output_dir, "scratch_model.pkl")
    scaler_path = os.path.join(output_dir, "scaler.pkl")
    encoders_path = os.path.join(output_dir, "encoders.pkl")
    eda_path = os.path.join(output_dir, "eda_stats.json")
    comparison_path = os.path.join(output_dir, "model_comparison.json")

    joblib.dump(rf_model, model_path)
    joblib.dump(scratch_model, scratch_model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(encoders, encoders_path)

    with open(eda_path, 'w') as f:
        json.dump(eda_stats, f, indent=2)

    comparison_data = {
        "scikit_learn": rf_metrics,
        "scratch_implementation": scratch_metrics
    }
    with open(comparison_path, 'w') as f:
        json.dump(comparison_data, f, indent=2)

    print("All ML Artifacts and SOP metadata saved successfully!")

if __name__ == "__main__":
    train_and_save()
