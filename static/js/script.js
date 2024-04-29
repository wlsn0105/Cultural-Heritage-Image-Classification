function uploadImage() {
    var formData = new FormData();
    formData.append('image', $('#image-input')[0].files[0]);

    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // 이미지 표시
            var imageUrl = URL.createObjectURL($('#image-input')[0].files[0]);
            $('#uploaded-image').attr('src', imageUrl);

            $('#result-container').html('<h2>Detected Objects:</h2>');
            response.labels.forEach(function(label) {
                $('#result-container').append('<p>' + label.description + '</p>');
            });

            $('#result-container').append('<h2>Predicted Price:</h2>');
            $('#result-container').append('<p>' + response.predicted_price + '</p>');
        },
        error: function(error) {
            console.error('Error uploading image:', error);
        }
    });
}
