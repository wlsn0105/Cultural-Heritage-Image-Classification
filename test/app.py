# 필요한 라이브러리 임포트
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
from werkzeug.utils import secure_filename  # secure_filename 임포트
import numpy as np
import os

# Flask 애플리케이션 설정
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# 모델 정의
def create_model(input_shape):
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# 모델 학습
def train_model(train_dir, target_size, epochs):
    train_datagen = ImageDataGenerator(rescale=1./255)
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=target_size,
        batch_size=32,
        class_mode='binary'
    )
    model = create_model((*target_size, 3))
    model.fit(train_generator, epochs=epochs)
    return model

# 모델 로드 및 이미지 분류
def classify_image(model, image_path, target_size):
    # 이미지를 모델의 입력 형식에 맞게 전처리
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # 이미지 배치 차원 추가

    # 모델로 이미지 분류
    predictions = model.predict(img_array)
    score = predictions[0]

    # 결과를 진품 또는 가품으로 변환
    if score >= 0.5:
        return "진품"
    else:
        return "가품"


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']

    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)

        # 이미지 분류
        classification_result = classify_image(model, image_path, target_size=(150, 150))

        # 분류 결과가 진품이 아니라면 가품으로 분류
        if classification_result == "진품":
            result_text = "진품"
        else:
            result_text = "가품"

        return jsonify({'classification_result': result_text})
    else:
        return jsonify({'error': 'Invalid file format'}), 400
    
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    # 데이터 경로 및 학습 관련 설정
    train_dir = 'data/train'  # 학습용 이미지 디렉토리
    epochs = 10  # 학습 에포크 수

    # 모델 학습
    model = train_model(train_dir, target_size=(150, 150), epochs=epochs)

    # Flask 애플리케이션 실행
    app.run(host='0.0.0.0', port=8000)
