import numpy as np
import pandas as pd

class DecisionTreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, *, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    def is_leaf_node(self):
        return self.value is not None

class ScratchDecisionTreeClassifier:
    """
    Pure Python & NumPy Decision Tree Classifier implemented from scratch
    without using any Machine Learning libraries (No Scikit-Learn).
    Compliant with Darshan University ML Project SOP Phase 1 Week 3 Constraint.
    """
    def __init__(self, min_samples_split=5, max_depth=10, n_features=None):
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.n_features = n_features
        self.root = None

    def fit(self, X, y):
        if isinstance(X, pd.DataFrame):
            X = X.values
        if isinstance(y, (pd.Series, pd.DataFrame)):
            y = y.values.ravel()
            
        self.n_features = X.shape[1] if not self.n_features else min(X.shape[1], self.n_features)
        self.root = self._grow_tree(X, y)

    def _grow_tree(self, X, y, depth=0):
        n_samples, n_feats = X.shape
        n_labels = len(np.unique(y))

        # Check stopping criteria
        if (depth >= self.max_depth or n_labels == 1 or n_samples < self.min_samples_split):
            leaf_value = self._most_common_label(y)
            # Calculate probability of class 1
            prob_1 = np.mean(y == 1) if n_samples > 0 else 0.0
            return DecisionTreeNode(value=(leaf_value, prob_1))

        feat_idxs = np.random.choice(n_feats, self.n_features, replace=False)

        # Find best split
        best_feat, best_thresh = self._best_split(X, y, feat_idxs)

        if best_feat is None:
            leaf_value = self._most_common_label(y)
            prob_1 = np.mean(y == 1) if n_samples > 0 else 0.0
            return DecisionTreeNode(value=(leaf_value, prob_1))

        # Split and recurse
        left_idxs, right_idxs = self._split(X[:, best_feat], best_thresh)
        left = self._grow_tree(X[left_idxs, :], y[left_idxs], depth + 1)
        right = self._grow_tree(X[right_idxs, :], y[right_idxs], depth + 1)
        
        return DecisionTreeNode(best_feat, best_thresh, left, right)

    def _best_split(self, X, y, feat_idxs):
        best_gini = 1.0
        split_idx, split_thresh = None, None

        for feat_idx in feat_idxs:
            X_column = X[:, feat_idx]
            # Sample thresholds for speed on large datasets
            thresholds = np.percentile(X_column, np.linspace(10, 90, 10))

            for threshold in thresholds:
                gini = self._gini_impurity(y, X_column, threshold)
                if gini < best_gini:
                    best_gini = gini
                    split_idx = feat_idx
                    split_thresh = threshold

        return split_idx, split_thresh

    def _gini_impurity(self, y, X_column, threshold):
        left_idxs, right_idxs = self._split(X_column, threshold)
        if len(left_idxs) == 0 or len(right_idxs) == 0:
            return 1.0

        n = len(y)
        n_l, n_r = len(left_idxs), len(right_idxs)
        
        # Gini for left node
        p_l1 = np.sum(y[left_idxs] == 1) / n_l
        gini_l = 1.0 - (p_l1**2 + (1.0 - p_l1)**2)

        # Gini for right node
        p_r1 = np.sum(y[right_idxs] == 1) / n_r
        gini_r = 1.0 - (p_r1**2 + (1.0 - p_r1)**2)

        # Weighted Gini impurity
        child_gini = (n_l / n) * gini_l + (n_r / n) * gini_r
        return child_gini

    def _split(self, X_column, split_thresh):
        left_idxs = np.argwhere(X_column <= split_thresh).flatten()
        right_idxs = np.argwhere(X_column > split_thresh).flatten()
        return left_idxs, right_idxs

    def _most_common_label(self, y):
        if len(y) == 0:
            return 0
        vals, counts = np.unique(y, return_counts=True)
        return vals[np.argmax(counts)]

    def predict(self, X):
        if isinstance(X, pd.DataFrame):
            X = X.values
        return np.array([self._traverse_tree(x, self.root)[0] for x in X])

    def predict_proba(self, X):
        if isinstance(X, pd.DataFrame):
            X = X.values
        probs_1 = np.array([self._traverse_tree(x, self.root)[1] for x in X])
        probs_0 = 1.0 - probs_1
        return np.column_stack((probs_0, probs_1))

    def _traverse_tree(self, x, node):
        if node.is_leaf_node():
            return node.value

        if x[node.feature] <= node.threshold:
            return self._traverse_tree(x, node.left)
        return self._traverse_tree(x, node.right)
