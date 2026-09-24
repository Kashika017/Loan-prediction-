from pydantic import BaseModel, Field
from typing import Literal, List, Optional, Dict, Any

class LoanApplicantInput(BaseModel):
    Age: int = Field(..., ge=18, le=100, description="Applicant age in years (18-100)")
    Income: int = Field(..., ge=1000, le=1000000, description="Annual income in USD")
    LoanAmount: int = Field(..., ge=1000, le=1000000, description="Requested loan amount in USD")
    CreditScore: int = Field(..., ge=300, le=850, description="Credit score (300-850)")
    MonthsEmployed: int = Field(..., ge=0, le=600, description="Months of employment history")
    NumCreditLines: int = Field(..., ge=0, le=30, description="Number of active credit lines")
    InterestRate: float = Field(..., ge=0.0, le=50.0, description="Interest rate percentage")
    LoanTerm: int = Field(..., ge=1, le=360, description="Loan term in months")
    DTIRatio: float = Field(..., ge=0.0, le=1.0, description="Debt-to-Income ratio (0.0 to 1.0)")
    
    Education: Literal["Bachelor's", "High School", "Master's", "PhD", "Graduate", "Not Graduate"]
    EmploymentType: Literal["Full-time", "Part-time", "Self-employed", "Unemployed"]
    MaritalStatus: Literal["Divorced", "Married", "Single"]
    HasMortgage: Literal["No", "Yes"]
    HasDependents: Literal["No", "Yes"]
    LoanPurpose: Literal["Auto", "Business", "Education", "Home", "Other"]
    HasCoSigner: Literal["No", "Yes"]

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 35,
                "Income": 75000,
                "LoanAmount": 15000,
                "CreditScore": 720,
                "MonthsEmployed": 48,
                "NumCreditLines": 3,
                "InterestRate": 8.5,
                "LoanTerm": 36,
                "DTIRatio": 0.25,
                "Education": "Bachelor's",
                "EmploymentType": "Full-time",
                "MaritalStatus": "Married",
                "HasMortgage": "Yes",
                "HasDependents": "No",
                "LoanPurpose": "Home",
                "HasCoSigner": "No"
            }
        }

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    category: str

class PredictionResponse(BaseModel):
    prediction: Literal["Default", "No Default"]
    probability: float
    probability_percentage: str
    risk_level: Literal["Low Risk", "High Risk"]
    confidence_score: float
    message: str
    feature_importance: Optional[List[FeatureImportanceItem]] = None

class ModelInsightsResponse(BaseModel):
    algorithm: str
    dataset_size: str
    total_features: int
    train_samples: int
    test_samples: int
    accuracy: str
    precision: str
    recall: str
    f1_score: str
    roc_auc: str
    feature_importance: List[FeatureImportanceItem]

class DashboardStatsResponse(BaseModel):
    total_predictions: int
    approved_predictions: int
    rejected_predictions: int
    average_probability: float
    approval_rate: str
    model_accuracy: str
