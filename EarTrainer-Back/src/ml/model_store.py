import os
import pickle

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

def get_model_path(user_id):
    user_dir = os.path.join(MODEL_DIR, f"user_{user_id}")
    os.makedirs(user_dir, exist_ok=True)
    return os.path.join(user_dir, 'model.pkl')

def save_model(user_id, model):
    path = get_model_path(user_id)
    with open(path, 'wb') as f:
        pickle.dump(model, f)

def load_model(user_id):
    path = get_model_path(user_id)
    if not os.path.exists(path):
        raise FileNotFoundError(f"No model for user {user_id}")
    with open(path, 'rb') as f:
        return pickle.load(f)

def delete_model(user_id):
    path = get_model_path(user_id)
    if os.path.exists(path):
        os.remove(path)
