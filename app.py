from flask import Flask, render_template, request, jsonify, url_for
import os
from werkzeug.utils import secure_filename
from google.cloud import vision_v1
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import tensorflow as tf
import random
import math

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 모델 로드 (가상의 함수로 가정)
def load_price_prediction_model():
    # 가상의 함수, 실제로는 모델을 로드하는 코드를 추가하세요.
    return None

# 이미지를 전처리하고 모델에 전달하여 가격 예측
def predict_price(model, img_path):
    # 가상의 함수, 실제로는 이미지 전처리 및 모델 예측 코드를 추가하세요.
    # price = ['10000원', '20000원', '30000원', '40000원', '50000원']
    # return np.random.choice(price)  # 가상의 랜덤 값

    random_number = random.uniform(10, 100)
    price = round(random_number) * 100000
    return str(price) + "원"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']

    # 이미지를 안전하게 저장하고 URL을 반환
    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
        image_url = url_for('uploaded_image', filename=filename)
    else:
        return jsonify({'error': 'Invalid file format'}), 400

    # Vision AI API에 연결
    client = vision_v1.ImageAnnotatorClient.from_service_account_file('your vision ai key')

    # 이미지를 Vision API에 전송
    with open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision_v1.Image(content=content)

    # Vision AI API 호출 (라벨링)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    # Vision AI API 출력에서 상위 5개의 라벨만 선택하여 사용
    selected_labels = labels[:3]

    # 라벨 이름을 변경하는 딕셔너리
    label_mapping = {
        'Drinkware': '토기',
        'Tableware': '',
        # 필요한 라벨과 변경할 이름을 추가합니다.
    }
    
    # 선택된 라벨의 이름을 변경합니다.
    transformed_labels = [{'description': label_mapping.get(label.description, label.description)} for label in selected_labels]

    # 모델 로드 (한 번만 로드하면 됨)
    model = load_price_prediction_model()

    # 이미지로부터 가격 예측
    predicted_price = predict_price(model, image_path)

    return jsonify({'labels': transformed_labels,
                    'predicted_price': predicted_price,
                    'image_url': image_url})

    # return jsonify({'labels': [{'description': label.description} for label in selected_labels],
    #                 'predicted_price': predicted_price,
    #                 'image_url': image_url})

@app.route('/uploads/<filename>')
def uploaded_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

if __name__ == '__main__':
    print("서버 실행!!:")
    app.run(host="0.0.0.0",debug=True , port = 3000)
