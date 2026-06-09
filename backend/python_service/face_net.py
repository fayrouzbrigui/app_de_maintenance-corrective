from flask import Flask, request, jsonify
import numpy as np
import cv2
from mtcnn.mtcnn import MTCNN
import pickle
import os
from PIL import Image
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from keras_facenet import FaceNet

app = Flask(__name__)

# Initialize face detector
detector = MTCNN()

# Initialize FaceNet embedder (NO .h5 loading anymore)
embedder = FaceNet()

model = None
out_encoder = None

model_path = 'svc_model.pkl'
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model, out_encoder = pickle.load(f)
else:
    print("⚠️ svc_model.pkl not found. Train the model first using /train.")


def get_face_embedding(image):
    results = detector.detect_faces(image)
    if not results:
        return None

    x1, y1, w, h = results[0]['box']
    x1, y1 = abs(x1), abs(y1)
    x2, y2 = x1 + w, y1 + h

    face = image[y1:y2, x1:x2]
    face = cv2.resize(face, (160, 160))

    # keras-facenet expects RGB image
    face = face.astype('uint8')

    embedding = embedder.embeddings([face])
    return embedding[0]


@app.route('/get_embedding', methods=['POST'])
def get_embedding():
    try:
        data = request.get_json()
        image_path = data.get('image_path')

        if not image_path or not os.path.exists(image_path):
            return jsonify({'error': 'Valid image_path not provided or file does not exist'}), 400

        image = Image.open(image_path)
        image = np.array(image.convert('RGB'))

        embedding = get_face_embedding(image)

        if embedding is None:
            return jsonify({'error': 'No face detected'}), 400

        return jsonify({'embedding': embedding.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/train', methods=['POST'])
def train_model():
    global model, out_encoder

    try:
        data = request.get_json()
        embeddings = data.get('embeddings', [])

        if not embeddings:
            return jsonify({'error': 'No embeddings provided'}), 400

        X = [item['embedding'] for item in embeddings]
        y = [item['name'] for item in embeddings]

        X = np.asarray(X)
        y = np.asarray(y)

        out_encoder = LabelEncoder()
        y_encoded = out_encoder.fit_transform(y)

        model = SVC(kernel='linear', probability=True)
        model.fit(X, y_encoded)

        with open(model_path, 'wb') as f:
            pickle.dump((model, out_encoder), f)

        return jsonify({'message': 'Model trained and saved.'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    global model, out_encoder

    if model is None or out_encoder is None:
        return jsonify({'error': 'Model not trained yet. Train it first using /train.'}), 400

    try:
        data = request.get_json()
        image_path = data.get('image_path')

        if not image_path or not os.path.exists(image_path):
            return jsonify({'error': 'Valid image_path not provided or file does not exist'}), 400

        image = Image.open(image_path)
        image = np.array(image.convert('RGB'))

        embedding = get_face_embedding(image)

        if embedding is None:
            return jsonify({'error': 'No face detected'}), 400

        preds = model.predict_proba([embedding])[0]
        j = np.argmax(preds)
        confidence = preds[j]

        label = out_encoder.inverse_transform([j])[0] if confidence > 0.7 else "Unknown"

        return jsonify({
            'label': label,
            'confidence': float(confidence)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)